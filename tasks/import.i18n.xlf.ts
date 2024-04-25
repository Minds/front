import { argv } from 'yargs';
import { join } from 'path';
import { create, convert } from 'xmlbuilder2';

import { readFileSync, statSync, existsSync, writeFileSync } from 'fs';

const APP_ROOT = join(__dirname, '..');
const APP_SRC = join(APP_ROOT, 'src');

// TRANSFORMER

function addXTag(source) {
  if (typeof source !== 'string') {
    console.warn(source);
    throw new Error('Invalid translation string');
  }

  const nodeStr = `<root>${source.replace(
    /{\$([^}]+)}/g,
    `<x id="$1" />`
  )}</root>`;

  const node = convert(nodeStr, {
    format: 'object',
    noDoubleEncoding: true,
  });

  return node['root'];
}

function transform(source, outputTemplate) {
  statSync(source); // check if exists

  let fileContent = readFileSync(source).toString();

  const doc: any = convert(
    {
      encoding: 'UTF-8',
    },
    fileContent.trim(),
    { format: 'object', wellFormed: true, noDoubleEncoding: true }
  );

  if (!doc.xliff.file['@target-language']) {
    throw new Error('Missing target-language attribute');
  }

  doc.xliff.file.body['trans-unit'] = doc.xliff.file.body['trans-unit'].map(
    (transUnit) => {
      const output = JSON.parse(JSON.stringify(transUnit));

      if (typeof output.source === 'string') {
        output.source = addXTag(output.source);
      } else {
        output.source['#'] = addXTag(output.source['#']);
      }

      if (typeof output.target === 'string') {
        output.target = addXTag(output.target);
      } else {
        output.target['#'] = addXTag(output.target['#']);
      }

      return output;
    }
  );

  const language = doc.xliff.file['@target-language'].slice(0, 2);
  const output = outputTemplate.replace(/\*/, language);

  writeFileSync(
    output,
    create(doc).end({ noDoubleEncoding: true, prettyPrint: true })
  );
}

// MAIN

export = () => (cb) => {
  if (!argv['input']) {
    return cb(`Missing --input argument`);
  }

  const inputFile = join(APP_ROOT, argv['input']);

  if (!existsSync(inputFile)) {
    return cb(`"${inputFile}" does not exist`);
  }

  transform(inputFile, join(APP_SRC, 'locale', 'Minds.*.xliff'));

  cb();
};
