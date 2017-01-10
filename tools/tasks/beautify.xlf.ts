import { join } from 'path';
import { argv } from 'yargs';
import { statSync, readFileSync, writeFileSync } from 'fs';
import { APP_SRC } from '../config';

let XML = require('pixl-xml')

export = (gulp, plugins) => done => {
  if (!argv.source) {
    throw new Error('Missing source parameter. e.g. Default.xlf');
  }

  let file = join(APP_SRC, 'locale', argv.source);
  statSync(file); // check if exists

  let fileContent = readFileSync(file).toString();

  fileContent = fileContent
    .replace(/\&#10;/g, "\n")
    .replace(/\&#13;/g, "\n")
    .replace(/<x\s+(.*?)\s*\/>/g, "[_x_start_] $1 [_x_end_]");

  let xmlContent = XML.parse(fileContent, {
    preserveAttributes: true,
    preserveDocumentNode: true
  });

  xmlContent.xliff.file.body['trans-unit'] = xmlContent.xliff.file.body['trans-unit'].sort((a, b) => {
    if (
      !a || !a._Attribs || !a._Attribs.id ||
      !b || !b._Attribs || !b._Attribs.id
    ) {
      return 0;
    }

    return a._Attribs.id > b._Attribs.id ? 1 : -1;
  });

  let result = XML.stringify(xmlContent, void 0, 0, "  ", "\n");

  result = result
    .replace(/\[_x_start_\]/g, '<x')
    .replace(/\[_x_end_\]/g, '/>');

  writeFileSync(file, result);

  done();
};
