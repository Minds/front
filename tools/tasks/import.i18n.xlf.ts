import { APP_SRC } from '../config';
import { argv } from 'yargs';
import { execSync } from 'child_process';
import { join } from 'path';

import { readFileSync, statSync, unlinkSync, writeFileSync } from 'fs';

// SHELL RUNNER

let run = (cmd: string, env: any = {}, outputAsResult: boolean = true) => {
  let shell = process.env.ComSpec || process.env.SHELL || false,
    opts = {
      env: {
        ...process.env,
        ...env
      },
      maxBuffer: 1024 * 1024,
      stdio: outputAsResult ? 'pipe' : 'inherit'
    };

  if (shell) {
    opts['shell'] = shell;
  }

  console.info(`[run] ${cmd} (${JSON.stringify(env)})`);

  let result = execSync(cmd, opts);

  if (result instanceof Buffer) {
    result = result.toString();
  }

  return result;
};

// TRANSFORMER

function transform(source) {
  statSync(source); // check if exists

  let fileContent = readFileSync(source).toString();

  fileContent = fileContent
    .replace(/%([0-9]+)\$s/g, (substring, match_1) => {
      let idx = parseInt(match_1) - 1;

      if (idx < 1) {
        return `{{id="INTERPOLATION"}}`;
      }

      return `{{id="INTERPOLATION_${idx}"}}`;
    })
    .replace(/{{([^}]+)}}/g, `<x $1 />`);

  writeFileSync(source, fileContent);
}

// MAIN

export = (gulp, plugins) => cb => {
  if (!argv.locale) {
    cb('Please specify a locale');
  }

  transform(join(APP_SRC, 'locale', `Minds.${argv.locale}.xliff`));
};
