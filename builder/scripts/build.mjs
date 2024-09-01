import fs from "fs-extra";
import path from "path";
import esbuild from "esbuild";
import Handlebars from "handlebars";
import deepmerge from "deepmerge";
import * as cheerio from "cheerio";
import vuePlugin from "esbuild-vue";
import { packageDirectorySync } from "pkg-dir";

const PROJECT_ROOT_DIRECTORY = packageDirectorySync();

const BUILDER_CONFIG_FILE = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "nrg.config.mjs"
);
const BUILDER_ASSETS_DIRECTORY = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "builder"
);
const BUILDER_TEMPLATES = path.resolve(BUILDER_ASSETS_DIRECTORY, "templates");
const BUILDER_DOT_DIRECTORY = path.resolve(PROJECT_ROOT_DIRECTORY, ".nrg");
const BUNDLER_TMP_DIRECTORY = path.resolve(BUILDER_DOT_DIRECTORY, "tmp");
const BUNDLER_SERVER_TMP_DIRECTORY = path.resolve(
  BUNDLER_TMP_DIRECTORY,
  "server"
);
const BUNDLER_SERVER_TMP_SRC_DIRECTORY = path.resolve(
  BUNDLER_SERVER_TMP_DIRECTORY,
  "src"
);
const BUNDLER_CLIENT_TMP_DIRECTORY = path.resolve(
  BUNDLER_TMP_DIRECTORY,
  "client"
);
const BUNDLER_CLIENT_TMP_SRC_DIRECTORY = path.resolve(
  BUNDLER_CLIENT_TMP_DIRECTORY,
  "src"
);

const BUNDLER_TMP_SRC_DIRECTORY = path.resolve(BUNDLER_TMP_DIRECTORY, "src");
const BUNDLER_TMP_DIST_DIRECTORY = path.resolve(BUNDLER_TMP_DIRECTORY, "dist");

const SRC_DIRECTORY = path.resolve(PROJECT_ROOT_DIRECTORY, "src");
const DIST_DIRECTORY = path.resolve(PROJECT_ROOT_DIRECTORY, "dist");

async function clean() {
  console.log("cleaning up before next build");
  await fs.remove(DIST_DIRECTORY);
  await fs.remove(BUNDLER_TMP_DIRECTORY);
  console.log("clean up completed successfully");
}

async function setup() {
  console.log("setting up bundler dir");
  await fs.mkdirp(BUILDER_DOT_DIRECTORY);
  await fs.mkdirp(BUNDLER_TMP_DIRECTORY);
  console.log("setup complete");
}

async function processHtml(node) {
  const html = fs.readFileSync(
    path.resolve(
      BUNDLER_CLIENT_TMP_SRC_DIRECTORY,
      "nodes",
      node,
      "client",
      "index.html"
    ),
    { encoding: "utf-8" }
  );
  const $ = cheerio.load(html, null, false);
  const templateContent = $("template").html();
  const newDiv = `<div id="${node}">${templateContent}</div>`;
  $("template").replaceWith(newDiv);
  return $.html();
}

async function bundleJavascript(config) {
  await esbuild.build(config);
}

async function renderServerEntrypoint(nodes) {
  const template = Handlebars.compile(
    fs.readFileSync(
      path.join(BUILDER_TEMPLATES, "server", "entrypoint.handlebars"),
      "utf-8"
    )
  );

  const result = template({
    nodes: nodes.map((node, index) => {
      return {
        name: `Node${index}`,
        id: node,
        path: `./nodes/${node}/server`,
      };
    }),
  });

  return result;
}

async function bundleServer() {
  console.log("bundling server");
  fs.mkdirpSync(BUNDLER_SERVER_TMP_DIRECTORY);
  fs.copySync(SRC_DIRECTORY, BUNDLER_SERVER_TMP_SRC_DIRECTORY);

  const nodes = fs.readdirSync(
    path.resolve(BUNDLER_SERVER_TMP_SRC_DIRECTORY, "nodes")
  );
  const severEntrypoint = await renderServerEntrypoint(nodes);

  const serverEntrypointPath = path.resolve(
    BUNDLER_SERVER_TMP_SRC_DIRECTORY,
    "index.js"
  );
  fs.writeFileSync(serverEntrypointPath, severEntrypoint, {
    encoding: "utf-8",
  });

  await bundleJavascript({
    entryPoints: [serverEntrypointPath],
    bundle: true,
    platform: "node",
    format: "cjs",
    minify: false,
    // NOTE: this must be true so that class names are preserved.
    // NOTE: this prop doesnt work unless minify = true
    keepNames: true,
    outfile: path.resolve(BUNDLER_TMP_DIST_DIRECTORY, "index.js"),
    sourcemap: true,
  });

  console.log("server bundled");
}

async function bundleClient() {
  console.log("bundling client");
  fs.mkdirpSync(BUNDLER_CLIENT_TMP_DIRECTORY);
  fs.copySync(SRC_DIRECTORY, BUNDLER_CLIENT_TMP_SRC_DIRECTORY);

  const nodes = fs.readdirSync(
    path.resolve(BUNDLER_CLIENT_TMP_SRC_DIRECTORY, "nodes")
  );

  const template = Handlebars.compile(
    fs.readFileSync(
      path.join(BUILDER_TEMPLATES, "client", "html.handlebars"),
      "utf-8"
    )
  );

  const entryPointTemplate = Handlebars.compile(
    fs.readFileSync(
      path.join(BUILDER_TEMPLATES, "client", "entrypoint.handlebars"),
      "utf-8"
    )
  );

  const clientHtmlPath = path.join(BUNDLER_TMP_DIST_DIRECTORY, "index.html");
  for (const node of nodes) {
    const jsOutputPath = path.join(
      BUNDLER_CLIENT_TMP_SRC_DIRECTORY,
      "nodes",
      node,
      "index.js"
    );

    const renderedJsEntrypoint = entryPointTemplate({
      path: "./" + path.join("client", "index.js"),
      type: node,
    });

    fs.writeFileSync(
      path.join(BUNDLER_CLIENT_TMP_SRC_DIRECTORY, "nodes", node, "index.js"),
      renderedJsEntrypoint,
      { encoding: "utf-8" }
    );

    await bundleJavascript({
      entryPoints: [
        path.resolve(
          BUNDLER_CLIENT_TMP_SRC_DIRECTORY,
          "nodes",
          node,
          "index.js"
        ),
      ],
      bundle: true,
      format: "iife",
      platform: "browser",
      target: ["es2020"],
      outfile: jsOutputPath,
      keepNames: true,
      minify: true,
      sourcemap: "inline",
      allowOverwrite: true,
      plugins: [
        vuePlugin({
          production: true,
        }),
      ],
    });

    const js = fs.readFileSync(jsOutputPath, { encoding: "utf-8" });

    const html = await processHtml(node);

    const renderedClientHtml =
      template({
        type: node,
        html: html.trim(),
        javascript: js.trim(),
      }) + "\n";

    fs.appendFileSync(clientHtmlPath, renderedClientHtml, {
      encoding: "utf-8",
    });
  }

  fs.appendFileSync(
    clientHtmlPath,
    '<script>const socket=new WebSocket("ws://localhost:3001");socket.addEventListener("message",e=>{"refresh"===e.data&&location.reload()}),socket.addEventListener("error",e=>{console.error("WebSocket error observed:",e)});</script>',
    { encoding: "utf-8" }
  );

  console.log("client bundled");
}

async function bundleIcons() {
  console.log("creating icons dir");
  const nodes = fs.readdirSync(path.resolve(SRC_DIRECTORY, "nodes"));
  const iconsOutput = path.join(BUNDLER_TMP_DIST_DIRECTORY, "icons");
  fs.mkdirpSync(iconsOutput);
  for (const node of nodes) {
    fs.copySync(
      path.resolve(SRC_DIRECTORY, "nodes", node, "client", "icons"),
      iconsOutput
    );
  }
  console.log("icons dir created");
}

async function bundleLocales() {
  console.log("creating locales dir");
  const nodes = fs.readdirSync(path.resolve(SRC_DIRECTORY, "nodes"));
  const localesOutput = path.join(BUNDLER_TMP_DIST_DIRECTORY, "locales");
  fs.mkdirpSync(localesOutput);

  const template = Handlebars.compile(
    fs.readFileSync(
      path.join(BUILDER_TEMPLATES, "client", "locale.handlebars"),
      "utf-8"
    )
  );

  const dictionariesMap = new Map();

  for (const node of nodes) {
    const docs = fs.readdirSync(
      path.resolve(SRC_DIRECTORY, "nodes", node, "client", "i18n", "docs")
    );

    for (const doc of docs) {
      const language = path.basename(doc, path.extname(doc));
      const localeLanguageOutput = path.join(localesOutput, language);
      fs.mkdirpSync(localeLanguageOutput);
      const html = fs.readFileSync(
        path.join(SRC_DIRECTORY, "nodes", node, "client", "i18n", "docs", doc),
        { encoding: "utf-8" }
      );
      const renderedHtml =
        template({
          type: node,
          html: html.trim(),
        }) + "\n";

      fs.appendFileSync(
        path.join(localeLanguageOutput, "index.html"),
        renderedHtml,
        {
          encoding: "utf-8",
        }
      );
    }

    const dictionaries = fs.readdirSync(
      path.resolve(
        SRC_DIRECTORY,
        "nodes",
        node,
        "client",
        "i18n",
        "dictionaries"
      )
    );

    for (const dictionary of dictionaries) {
      const language = path.basename(dictionary, path.extname(dictionary));
      const localeLanguageOutput = path.join(localesOutput, language);
      fs.mkdirpSync(localeLanguageOutput);

      if (!dictionariesMap.has(language)) {
        dictionariesMap.set(language, {
          data: {},
          path: localeLanguageOutput,
        });
      }

      const json = JSON.parse(
        fs.readFileSync(
          path.join(
            SRC_DIRECTORY,
            "nodes",
            node,
            "client",
            "i18n",
            "dictionaries",
            dictionary
          ),
          { encoding: "utf-8" }
        )
      );

      const current = dictionariesMap.get(language);
      dictionariesMap.set(language, {
        data: deepmerge({ [node]: json }, current.data),
        path: current.path,
      });
    }
  }

  for (const [key, value] of dictionariesMap) {
    fs.writeFileSync(
      path.join(value.path, "index.json"),
      JSON.stringify(value.data),
      {
        encoding: "utf-8",
      }
    );
  }
  console.log("locales dir created");
}

const main = async () => {
  try {
    await clean();
    await setup();
    await Promise.all([
      bundleServer(),
      bundleClient(),
      bundleIcons(),
      bundleLocales(),
    ]);
    fs.copySync(BUNDLER_TMP_DIST_DIRECTORY, DIST_DIRECTORY);
  } catch (err) {
    console.error("something went wrong", err);
    process.exit(1);
  }
};

main();
