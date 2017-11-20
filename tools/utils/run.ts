import { execSync } from 'child_process';

import * as gutil from 'gulp-util';

export const run = (cmd: string, env: any = {}, outputAsResult: boolean = true) => {
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

  if (!outputAsResult) {
    gutil.log(gutil.colors.grey('$'), gutil.colors.cyan(cmd), gutil.colors.grey(`(${JSON.stringify(env)})`));
  }

  let result = execSync(cmd, opts);

  if (result instanceof Buffer) {
    result = result.toString();
  }

  return result;
};
