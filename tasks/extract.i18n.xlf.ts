import { argv } from 'yargs';
import { execSync, StdioOptions } from 'child_process';
import { join } from 'path';
import { create, convert } from 'xmlbuilder2';

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

  const doc: any = convert(
    {
      encoding: 'UTF-8',
    },
    fileContent.trim(),
    { format: 'object' }
  );

  doc.xliff.file.body['trans-unit'] = doc.xliff.file.body['trans-unit'].map(
    transUnit => {
      const output = JSON.parse(JSON.stringify(transUnit));

      const note = {
        '@priority': '1',
        '@from': 'meaning',
        '#': 'ng2.template',
      };

      if (!output['note']) {
        output['note'] = note;
      } else if (typeof output['note'].length === 'undefined') {
        output['note'] = [output['note'], note];
      } else {
        output['note'].push(note);
      }

      return output;
    }
  );

  writeFileSync(output, create(doc).end({ prettyPrint: true }));
}

// MAIN

export = () => cb => {
  run(`npx ng xi18n --out-file=messages.xlf --format=xlf`, {}, false);
  transform(
    join(APP_SRC, 'messages.xlf'),
    join(APP_SRC, 'locale', argv.output || 'Base.xlf')
  );
  unlinkSync(join(APP_SRC, 'messages.xlf'));

  cb();
};
