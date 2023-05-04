/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable quotes */
import { JSDOM } from "jsdom";
import { NodeVM } from "vm2";
import fs from "fs";
import path from "path";
import { build } from "esbuild";
import {bidRequests, bidderRequest} from './params.js'

async function bundle(entryFilePath, outfile) {
  try {
    await build({
      entryPoints: [entryFilePath],
      outfile,
      bundle: true,
      format: "cjs",
      platform: "node",
      footer: { js: `console.log(spec.buildRequests(${bidRequests}, ${bidderRequest}).data.eids)` },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

function runWithJsdom(entryFilePath) {
  // Add performance to the window object
  global.performance = {};
  global.performance.now = () => 0;

  const jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const { window } = jsdom;

  const outfile = 'bundled.js';
  bundle(entryFilePath, outfile).then(() => {
    const code = fs.readFileSync(outfile, "utf8");

    const FEATURES = {}
    const vm = new NodeVM({
      console: "inherit",
      sandbox: { window, navigator: window.navigator, document: window.document, FEATURES },
      require: {
        external: true,
        builtin: ["fs", "path"],
        root: "./",
        context: "sandbox",
      },
    })

  vm.run(code, path.resolve(outfile));

  // Clean up the bundled file after execution
  fs.unlinkSync(outfile);
  }).catch((err) => console.error(err))
}

runWithJsdom("./../modules/apacdexBidAdapter.js");
