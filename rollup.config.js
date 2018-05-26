import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';

import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'lib/index.es.js',
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [
    // Automatically externalize peerDependencies in a rollup bundle.
    external(),

    // Prints out typescript syntactic and semantic diagnostic messages
    typescript({
      tsconfigDefaults: {
        compilerOptions: { declaration: true, jsx: 'react' },
      },
    }),

    postcss({
      minimize: true, // uses cssnano behind scene
      modules: true, // enable css modules
      extensions: ['.css', '.scss', '.sass'], // uses node-sass
    }),

    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['env', { modules: false }], 'stage-1', 'react'],
      plugins: ['external-helpers'],
    }),

    resolve(),

    // minify using
    uglify({}, minify),

    // logs the filesize in cli when done
    filesize(),

    // Progress while building
    progress({ clearLine: false }),

    // Generate statistics
    visualizer({
      filename: './statistics.html',
      title: 'My Bundle',
    }),
  ],
};
