import { argv } from 'yargs';
import { execSync, StdioOptions } from 'child_process';
import { join } from 'path';

import { readFileSync, statSync, unlinkSync, writeFileSync } from 'fs';

const APP_SRC = join(__dirname, '..', 'src');

// SHELL RUNNER

let run = (cmd: string, env: any = {}, outputAsResult: boolean = true) => {
  let shell = process.env.ComSpec || process.env.SHELL || false,
    opts = {
      env: {
        ...process.env,
        ...env,
      },
      maxBuffer: 1024 * 1024,
      stdio: <StdioOptions>(outputAsResult ? 'pipe' : 'inherit'),
    };

  if (shell) {
    opts['shell'] = shell;
  }

  console.info(`[run] ${cmd} (${JSON.stringify(env)})`);

  let result = execSync(cmd, opts);

  if (result instanceof Buffer) {
    result = (result as any).toString();
  }

  return result;
};

// TRANSFORMER

function transform(source, output) {
  statSync(source); // check if exists

  let fileContent = readFileSync(source).toString();

  fileContent = fileContent
    .replace(/\&#10;/g, '\n')
    .replace(/\&#13;/g, '\n')
    .replace(/<x\s+(.*?)\s*\/>/g, '{{$1}}')
    .replace(/{{id="INTERPOLATION" equiv-text="[^"]+"}}/g, '%1$s')
    .replace(
      /{{id="INTERPOLATION_([0-9]+)" equiv-text="[^"]+"}}/g,
      (substring, match_1) => {
        const idx = parseInt(match_1) + 1;

        if (idx < 2) {
          process.exit(1);
        }

        return `%${idx}$s`;
      }
    );

  writeFileSync(output, fileContent);
}

// MAIN

export = () => cb => {
  run(`node_modules/.bin/ng xi18n --i18nFormat xlf`, {}, false);
  transform(
    join(APP_SRC, 'messages.xlf'),
    join(APP_SRC, 'locale', argv.output || 'Default.xliff')
  );
  unlinkSync(join(APP_SRC, 'messages.xlf'));

  cb();
};
