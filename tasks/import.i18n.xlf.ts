import { argv } from 'yargs';
import { join } from 'path';
import { readFileSync, statSync, writeFileSync } from 'fs';
const https = require('https');
const querystring = require('querystring');
const url = require('url');

const APP_SRC = join(__dirname, '..', 'src');

// HTTP

function req(uri, method = 'get', data = null, extraOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const isPost = method.toUpperCase() === 'POST';

    const options = {
      method: method.toUpperCase(),
      headers: {},
      ...url.parse(uri),
      ...extraOptions,
    };

    let body = '';

    if (data) {
      body = querystring.stringify(data);
    }

    if (isPost && data && !options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = body.length;
    }

    const req = https.request(options, res => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${statusCode}`));
      }

      res.setEncoding('utf8');

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(body);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', e => {
      reject(e);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

// TRANSFORMER

function transform(fileContent, destination) {
  fileContent = fileContent
    .replace(/%([0-9]+)\$s/g, (substring, match_1) => {
      let idx = parseInt(match_1) - 1;

      if (idx < 1) {
        return `{{id="INTERPOLATION"}}`;
      }

      return `{{id="INTERPOLATION_${idx}"}}`;
    })
    .replace(/{{([^}]+)}}/g, `<x $1 />`);

  writeFileSync(destination, fileContent);
}

// MAIN

export = () => async cb => {
  if (
    (!argv.file && !argv['poeditor-key']) ||
    (argv.file && argv['poeditor-key'])
  ) {
    cb('Please specify either an local file (--file) or a poeditor.com API key (--poeditor-key)');
  }

  if (!argv.locale) {
    cb('Please specify a locale');
  }

  let fileContent;

  if (argv.file) {
    const file = join(__dirname, '..', argv.file);

    console.log(`* Using ${file}…`);

    statSync(file); // check if exists
    fileContent = readFileSync(file).toString();
  } else if (argv['poeditor-key']) {
    if (!argv['poeditor-id']) {
      throw new Error('Please specify a poeditor.com Project ID (--poeditor-id');
    }

    const locale = argv['poeditor-locale'] || argv.locale;
    console.log(`* Requesting '${locale}' (as '${argv['locale']}') from Project #${argv['poeditor-id']}`);

    const { response, result } = JSON.parse(await req('https://api.poeditor.com/v2/projects/export', 'post', {
      api_token: argv['poeditor-key'],
      id: argv['poeditor-id'],
      language: locale,
      type: 'xliff',
    }));

    if (response.status !== 'success' || !result.url) {
      throw new Error(response.message || JSON.stringify(response));
    }

    console.log(`* Downloading ${result.url}…`);

    fileContent = await req(result.url);

    if (!fileContent) {
      throw new Error('Invalid file');
    }
  }

  const dest = join(APP_SRC, 'locale', `Minds.${argv.locale}.xliff`);
  transform(fileContent, dest);

  console.log(`* Parsed and saved to ${dest}…`);

  cb();
};
