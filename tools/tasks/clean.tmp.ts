import rimraf = require('rimraf');

export = (gulp, plugins) => cb => {
  rimraf.sync('.ngcli-build/');
  rimraf.sync('.tmp.aot/');
  rimraf.sync('.tmp/');

  cb();
};
