import fs from "fs-extra";
import path from "path";
import esbuild from "esbuild";
import Handlebars from "handlebars";
import deepmerge from "deepmerge";
import * as cheerio from "cheerio";
import vuePlugin from "esbuild-vue";
import {
  PROJECT_ROOT_DIRECTORY,
  DIST_DIRECTORY,
  BUNDLER_TMP_DIRECTORY,
  BUILDER_DEFAULT_NRG_CONFIG,
  BUILDER_DOT_DIRECTORY,
  BUNDLER_SERVER_TMP_DIRECTORY,
  SRC_DIRECTORY,
  BUNDLER_SERVER_TMP_SRC_DIRECTORY,
  BUNDLER_CLIENT_TMP_DIRECTORY,
  BUNDLER_CLIENT_TMP_SRC_DIRECTORY,
  BUILDER_TEMPLATES,
  BUNDLER_TMP_DIST_DIRECTORY,
  BUNDLER_TMP_DIST_SOURCE_MAP_PATH,
} from "./constants.mjs";

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

function fixServerSourceMapPaths() {
  if (fs.existsSync(BUNDLER_TMP_DIST_SOURCE_MAP_PATH)) {
    const sourceMap = JSON.parse(
      fs.readFileSync(BUNDLER_TMP_DIST_SOURCE_MAP_PATH, { encoding: "utf-8" })
    );

    sourceMap.sources = sourceMap.sources.map((source) => {
      let resolvedPath;
      if (source.startsWith("../../../node_modules")) {
        resolvedPath = path.resolve(
          PROJECT_ROOT_DIRECTORY,
          source.replace("../../../", "../")
        );
      }

      if (source.startsWith("../server/src")) {
        resolvedPath = path.resolve(
          PROJECT_ROOT_DIRECTORY,
          source.replace("../server", "../")
        );
      }
      return path.relative(PROJECT_ROOT_DIRECTORY, resolvedPath);
    });

    fs.writeFileSync(
      BUNDLER_TMP_DIST_SOURCE_MAP_PATH,
      JSON.stringify(sourceMap),
      { encoding: "utf-8" }
    );
  }
}

async function bundleServer(config) {
  console.log("bundling server");
  fs.mkdirpSync(BUNDLER_SERVER_TMP_DIRECTORY);
  fs.copySync(SRC_DIRECTORY, BUNDLER_SERVER_TMP_SRC_DIRECTORY);

  const nodes = fs.readdirSync(
    path.resolve(BUNDLER_SERVER_TMP_SRC_DIRECTORY, "nodes")
  );

  const serverEntrypoint = await renderServerEntrypoint(nodes);
  const serverEntrypointPath = path.resolve(
    BUNDLER_SERVER_TMP_SRC_DIRECTORY,
    "index.js"
  );
  fs.writeFileSync(serverEntrypointPath, serverEntrypoint, {
    encoding: "utf-8",
  });

  const bundlerConfig = {
    ...config.build.server,
    entryPoints: [serverEntrypointPath],
    outfile: path.resolve(BUNDLER_TMP_DIST_DIRECTORY, "index.js"),
  };

  await bundleJavascript(bundlerConfig);
  fixServerSourceMapPaths();

  console.log("server bundled");
}

async function bundleClient(config, watch) {
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

    const bundlerConfig = {
      ...config.build.client,
      entryPoints: [
        path.resolve(
          BUNDLER_CLIENT_TMP_SRC_DIRECTORY,
          "nodes",
          node,
          "index.js"
        ),
      ],
      outfile: jsOutputPath,
    };

    await bundleJavascript(bundlerConfig);
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

  if (watch) {
    // TODO: add this to the rendered tempalte only if --watch is set
    const refreshScriptTemplate = Handlebars.compile(
      fs.readFileSync(
        path.resolve(BUILDER_TEMPLATES, "client", "refresh-script.handlebars"),
        { encoding: "utf-8" }
      )
    );
    const renderedRefreshScript = refreshScriptTemplate({
      port: config.watch.port,
    });
    fs.appendFileSync(clientHtmlPath, renderedRefreshScript, {
      encoding: "utf-8",
    });
  }

  console.log("client bundled");
}

async function bundleIcons(config) {
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

async function bundleLocales(config) {
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

async function build(config, watch) {
  await clean();
  await setup();
  await Promise.all([
    bundleServer(config),
    bundleClient(config, watch),
    bundleIcons(config),
    bundleLocales(config),
  ]);
  fs.copySync(BUNDLER_TMP_DIST_DIRECTORY, DIST_DIRECTORY);
}

export { build };
