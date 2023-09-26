import { CAC } from "cac";
import { generateTypescript } from "./generators/typescript";
import { Document } from "./types";

import fs from "fs";
import yaml from "js-yaml";

const generators = {
  ts: generateTypescript,
};

const supportedLanguagesText = Object.keys(generators).join(", ");

const STDIN_FILENO = 0;

export function registerTransformCommand(cli: CAC): void {
  function generate(options: {
    input?: string;
    lang?: keyof typeof generators;
  }) {
    const lang = options.lang;
    if (!lang) {
      console.error(`Please choose an output language`);
      cli.outputHelp();
      return;
    }
    const generator = generators[lang];
    if (!generator) {
      console.error(`Unsupported output language: ${lang}`);
      cli.outputHelp();
      return;
    }
    const input = fs.readFileSync(options.input ?? STDIN_FILENO);
    const document = yaml.load(input.toString()) as Document;
    const code = generator(document);
    console.log(code);
  }

  cli
    .command("", "Generate types from Flipt export", {
      allowUnknownOptions: true,
      ignoreOptionDefaultValue: true,
    })
    .option(
      "--input <path>",
      "Path to export file. You can also supply stdin instead.",
    )
    .option(
      "--lang <language>",
      `Output language. Supported: ${supportedLanguagesText}`,
      { default: "ts" },
    )
    .example((bin) => `flipt export | ${bin}`)
    .action(generate);
}
