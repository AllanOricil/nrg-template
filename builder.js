const fs = require("fs-extra");
const path = require("path");
const esbuild = require("esbuild");
const Handlebars = require("handlebars");
const deepmerge = require("deepmerge");

const BUNDLER_FOLDER = "./.node-red-builder";
const BUNDLER_TMP_FOLDER = path.join(BUNDLER_FOLDER, "tmp");
const BUNDLER_SERVER_TMP_FOLDER = path.join(BUNDLER_TMP_FOLDER, "server");
const BUNDLER_SERVER_TMP_SRC_FOLDER = path.join(
  BUNDLER_SERVER_TMP_FOLDER,
  "src"
);
const BUNDLER_CLIENT_TMP_FOLDER = path.join(BUNDLER_TMP_FOLDER, "client");
const BUNDLER_CLIENT_TMP_SRC_FOLDER = path.join(
  BUNDLER_CLIENT_TMP_FOLDER,
  "src"
);

const BUNDLER_TMP_SRC_FOLDER = path.join(BUNDLER_TMP_FOLDER, "src");
const BUNDLER_TMP_DIST_FOLDER = path.join(BUNDLER_TMP_FOLDER, "dist");

const SRC_FOLDER = "./src";
const DIST_FOLDER = "./dist";
const ASSETS_FOLDER = "./assets";
const NODES_FOLDER = "./src/nodes";
const BUILDER = "./builder";
const TEMPLATES = path.join(BUILDER, "templates");

async function clean() {
  console.log("cleaning up before next build");
  await fs.remove(DIST_FOLDER);
  await fs.remove(BUNDLER_TMP_FOLDER);
  console.log("clean up completed successfully");
}

async function setup() {
  console.log("setting up bundler dir");
  await fs.mkdirp(BUNDLER_FOLDER);
  await fs.mkdirp(BUNDLER_TMP_FOLDER);
  console.log("setup complete");
}

async function bundleJavascript(config) {
  await esbuild.build(config);
}

async function renderServerEntrypoint(nodes) {
  const template = Handlebars.compile(
    fs.readFileSync(
      path.join(TEMPLATES, "server", "entrypoint.handlebars"),
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
  fs.mkdirpSync(BUNDLER_SERVER_TMP_FOLDER);
  fs.copySync(SRC_FOLDER, BUNDLER_SERVER_TMP_SRC_FOLDER);

  const nodes = fs.readdirSync(
    path.resolve(BUNDLER_SERVER_TMP_SRC_FOLDER, "nodes")
  );
  const severEntrypoint = await renderServerEntrypoint(nodes);

  const serverEntrypointPath = path.resolve(
    BUNDLER_SERVER_TMP_SRC_FOLDER,
    "index.js"
  );
  fs.writeFileSync(serverEntrypointPath, severEntrypoint, {
    encoding: "utf-8",
  });

  await bundleJavascript(
    {
      entryPoints: [serverEntrypointPath],
      bundle: true,
      platform: "node",
      format: "cjs",
      minify: false,
      // NOTE: this must be true so that class names are preserved.
      // NOTE: this prop doesnt work unless minify = true
      keepNames: true,
      outfile: path.resolve(BUNDLER_TMP_DIST_FOLDER, "index.js"),
      sourcemap: true,
    }
  );

  console.log("server bundled");
}

async function bundleClient() {
  console.log("bundling client");
  fs.mkdirpSync(BUNDLER_CLIENT_TMP_FOLDER);
  fs.copySync(SRC_FOLDER, BUNDLER_CLIENT_TMP_SRC_FOLDER);

  const nodes = fs.readdirSync(
    path.resolve(BUNDLER_CLIENT_TMP_SRC_FOLDER, "nodes")
  );

  const renderedClientHtmlOutput = path.join(
    BUNDLER_TMP_DIST_FOLDER,
    "index.html"
  );

  const template = Handlebars.compile(
    fs.readFileSync(path.join(TEMPLATES, "client", "html.handlebars"), "utf-8")
  );

  const entryPointTemplate = Handlebars.compile(
    fs.readFileSync(path.join(TEMPLATES, "client", "entrypoint.handlebars"), "utf-8")
  )

  for (const node of nodes) {
    const jsOutputPath = path.join(
      BUNDLER_CLIENT_TMP_SRC_FOLDER,
      "nodes",
      node,
      "index.js"
    );

    const renderedJsEntrypoint = entryPointTemplate({
      path: "./" + path.join("client", "index.js"),
      type: node
    })

    fs.writeFileSync(
      path.join(
        BUNDLER_CLIENT_TMP_SRC_FOLDER,
        "nodes",
        node,
        "index.js"
      ), 
      renderedJsEntrypoint, 
      { encoding: "utf-8"}
    )

    await bundleJavascript(
      {
        entryPoints: [path.resolve(
          BUNDLER_CLIENT_TMP_SRC_FOLDER,
          "nodes",
          node,
          "index.js"
        )],
        bundle: true,
        platform: "browser",
        target: ["es2015"],
        minify: true,
        // NOTE: this must be true so that class names are preserved.
        // NOTE: this prop doesnt work unless minify = true
        keepNames: true,
        outfile: jsOutputPath,
        sourcemap: "inline",
        allowOverwrite: true,
      }
    );

    const js = fs.readFileSync(jsOutputPath, { encoding: "utf-8" });
    

    const html = fs.readFileSync(
      path.resolve(
        BUNDLER_CLIENT_TMP_SRC_FOLDER,
        "nodes",
        node,
        "client",
        "index.html"
      ),
      { encoding: "utf-8" }
    );

    const renderedClientHtml =
      template({
        NODE: node,
        HTML: html.trim(),
        JAVASCRIPT: js.trim(),
      }) + "\n";

    fs.appendFileSync(renderedClientHtmlOutput, renderedClientHtml, {
      encoding: "utf-8",
    });
  }

  console.log("client bundled");
}

async function bundleIcons() {
  console.log("creating icons dir");
  const nodes = fs.readdirSync(path.resolve(SRC_FOLDER, "nodes"));
  const iconsOutput = path.join(BUNDLER_TMP_DIST_FOLDER, "icons");
  fs.mkdirpSync(iconsOutput);
  for (const node of nodes) {
    fs.copySync(
      path.resolve(SRC_FOLDER, "nodes", node, "client", "icons"),
      iconsOutput
    );
  }
  console.log("icons dir created");
}

async function bundleLocales() {
  console.log("creating locales dir");
  const nodes = fs.readdirSync(path.resolve(SRC_FOLDER, "nodes"));
  const localesOutput = path.join(BUNDLER_TMP_DIST_FOLDER, "locales");
  fs.mkdirpSync(localesOutput);

  const template = Handlebars.compile(
    fs.readFileSync(
      path.join(TEMPLATES, "client", "locale.handlebars"),
      "utf-8"
    )
  );

  const dictionariesMap = new Map();

  for (const node of nodes) {
    const docs = fs.readdirSync(
      path.resolve(SRC_FOLDER, "nodes", node, "client", "i18n", "docs")
    );

    for (const doc of docs) {
      const language = path.basename(doc, path.extname(doc));
      const localeLanguageOutput = path.join(localesOutput, language);
      fs.mkdirpSync(localeLanguageOutput);
      const html = fs.readFileSync(
        path.join(SRC_FOLDER, "nodes", node, "client", "i18n", "docs", doc),
        { encoding: "utf-8" }
      );
      const renderedHtml =
        template({
          NODE: node,
          HTML: html.trim(),
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
      path.resolve(SRC_FOLDER, "nodes", node, "client", "i18n", "dictionaries")
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
            SRC_FOLDER,
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
    await Promise.all([bundleServer(), bundleClient(), bundleIcons(), bundleLocales()]);
    fs.copySync(BUNDLER_TMP_DIST_FOLDER, DIST_FOLDER);
  } catch (err) {
    console.error("something went wrong", err);
    process.exit(1);
  }
};

main();
