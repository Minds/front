import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

export default {
  entry: '.tmp/app/bootstrap-aot.js',
  dest: 'public/js/build-aot.js', // output a single application bundle
  sourceMap: false,
  format: 'iife',
  context: 'window',
  plugins: [
      nodeResolve({jsnext: true, module: true}),
      commonjs({
        include: 'node_modules/rxjs/**',
      }),
      uglify()
  ]
}
