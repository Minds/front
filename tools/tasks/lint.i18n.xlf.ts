import * as gutil from 'gulp-util';
import * as XML from 'pixl-xml';
import { join } from 'path';
import { argv } from 'yargs';
import { statSync, readFileSync } from 'fs';
import { APP_SRC } from '../config';
import { Hash } from 'crypto';

// Context Error

class ContextError extends Error {
  public context: any[];
  public type = 'error';

  constructor(context: any, public message: string) {
    super(message);

    this.context = context instanceof Array ?
      context : [ context ];
  }
}

class ContextWarning extends ContextError {
  public type = 'warning';
}

// Context and note parsers

function parseContext(context) {
  let result: any = {};

  if (!(context instanceof Array)) {
    throw new Error(`Invalid context format: ${JSON.stringify(context)}`);
  }

  context.forEach(contextItem => {
    if (!contextItem._Attribs || !contextItem._Attribs['context-type']) {
      throw new Error(`Invalid context format: ${JSON.stringify(context)}`);
    }

    result[contextItem._Attribs['context-type']] = contextItem._Data;
  });

  if (!result.sourcefile || !result.linenumber) {
    throw new Error(`Invalid context format: ${JSON.stringify(context)}`);
  }

  return result;
}

function parseNote(note) {
  let result: any = {};

  note.forEach(noteItem => {
    if (!noteItem._Attribs || !noteItem._Attribs.from) {
      throw new Error(`Invalid note format: ${JSON.stringify(note)}`);
    }

    result[noteItem._Attribs.from] = noteItem._Data;
  });

  return result;
}

// Hash helper

class SourceHash {
  protected _hash: Hash;
  protected _excerpt: string = '';

  constructor(source: string, meaning: string) {
    this._hash = require('crypto').createHash('sha256');
    this._hash.update(this.normalizeString(`{{meaning=${meaning}}${source}`));
    this._excerpt = source.replace(/{{[^}]+}}/g, '%');
  }

  protected normalizeString(text: string) {
    return text.replace(/[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+/g, ' ').trim();
  }

  getDigest() {
    return this._hash.digest('hex');
  }

  getExcerpt() {
    return this._excerpt;
  }
}

// Source Cache helper

class SourceCache {
  protected _cache: any = {};

  add(source: string, meaning: string, data: { id: string, context: any[] }): this {
    const sourceHash = new SourceHash(source, meaning),
      digest = sourceHash.getDigest();

    if (typeof this._cache[digest] === 'undefined') {
      this._cache[digest] = [];
    }

    this._cache[digest].push({ ...data, excerpt: sourceHash.getExcerpt() });

    return this;
  }

  lint(): number {
    let warnings = 0;

    for (let hash in this._cache) {
      let entries = this._cache[hash];

      if (entries.length === 1) {
        continue;
      }

      const ids = entries.map(entry => entry.id).join(', '),
        context = entries
          .reduce((result, entry) => {
            result.push(...entry.context)
            return result;
          }, []);

      gutil.log(gutil.colors.yellow('!'), 'Units', gutil.colors.cyan(ids), 'share the same meaning and content.');
      gutil.log(' ', gutil.colors.gray(`"${entries[0].excerpt}"`));

      context.forEach(context => {
        gutil.log('    ', gutil.colors.yellow('->'), gutil.colors.gray(`${context.sourcefile}:${context.linenumber}`));
      });

      console.log('');
      warnings++;
    }

    return warnings;
  }
}

// Linter

class Linter {

  protected sourceCache: SourceCache;

  constructor(protected units: any[]) {
    this.sourceCache = new SourceCache();
  }

  lint({ permissive }): { count, successes, warnings, errors } {
    let count = 0;
    let successes = 0;
    let warnings = 0;
    let errors = 0;

    console.log('');

    for (let unit of this.units) {
      try {
        this.lintUnit(unit, count);

        successes++;
      } catch (e) {
        let prefix: any = '-';

        if (!e.type || e.type == 'error') {
          prefix = gutil.colors.red('\u2717');
          errors++;
        } else if (e.type == 'warning') {
          prefix = gutil.colors.yellow('!');
          warnings++;
        }

        gutil.log(prefix, e.message);

        if (e.context) {
          e.context.forEach((context, index) => {
            gutil.log(' ', gutil.colors.yellow(`#${index}`), gutil.colors.gray(`${context.sourcefile}:${context.linenumber}`));
          });
        }

        console.log('');

      } finally {
        count++;
      }
    }

    if (!permissive) {
      warnings += this.sourceCache.lint();
    }

    gutil.log('Lint finished:');
    gutil.log('=', gutil.colors.magenta(`${count}`));

    if (successes)
      gutil.log(gutil.colors.green('\u2713'), gutil.colors.magenta(`${successes}`));

    if (warnings)
      gutil.log(gutil.colors.yellow('!'), gutil.colors.magenta(`${warnings}`));

    if (errors)
      gutil.log(gutil.colors.red('\u2717'), gutil.colors.magenta(`${errors}`));

    console.log('');

    return { count, successes, warnings, errors };
  }

  lintUnit(unit, index) {
    let id = unit._Attribs.id,
      context = null,
      note = { meaning: 'GENERIC' };

    // Grab context

    if (unit['context-group']) {
      if (unit['context-group'] instanceof Array) {
        context = unit['context-group'].map(contextGroupItem => parseContext(contextGroupItem.context));
      } else {
        context = [ parseContext(unit['context-group'].context) ];
      }
    }

    // Check ID

    if (!id) {
      throw new ContextError(context, `Missing ID for unit #${index}`);
    }

    // Check note (Angular's "context")

    if (unit.note) {
      note = { ...note, ...parseNote(unit.note instanceof Array ? unit.note : [ unit.note ]) };
    }

    // Check source

    if (typeof unit.source !== 'string') {
      throw new ContextError(context, `Invalid interpolation value on 'source' for unit ${id}. Did you use \`gulp extract\`?`);
    }

    // Add to cache

    this.sourceCache
      .add(unit.source, note.meaning, { id, context });

    // Warnings

    if (/^[a-f0-9]+$/.test(id)) {
      throw new ContextWarning(context, `Unit ${id} likely is an Angular i18n generated ID`);
    }
  }
}

// MAIN

export = (gulp, plugins) => cb => {
  if (!argv.file) {
    throw new Error('Missing file parameter. e.g. Default.xlf');
  }

  let file = join(APP_SRC, 'locale', argv.file);
  statSync(file); // check if exists

  let fileContent = readFileSync(file).toString();

  let xmlContent = XML.parse(fileContent, {
    preserveAttributes: true,
    preserveDocumentNode: true
  });

  const linter = new Linter(xmlContent.xliff.file.body['trans-unit']);
  let result = linter.lint(argv);

  let valid = !result.errors;

  if (argv.strict) {
    valid = !result.errors && !result.warnings;
  } else if (argv.soft) {
    valid = true;
  }

  cb(valid ? null : `${argv.source} failed passing the checks.`);
};
