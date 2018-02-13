import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

export default {
  input: '.tmp/app/bootstrap-i18n-aot.js',
  output: {
    format: 'iife',
    file: 'public/js/build-i18n-aot.js', // output a single application bundle
    sourcemap: false,
  },
  context: 'window',
  plugins: [
      nodeResolve({jsnext: true, module: true}),
      commonjs({
        include: 'node_modules/rxjs/**',
      }),
      uglify()
  ]
}
