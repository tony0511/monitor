import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import esbuild, { minify } from 'rollup-plugin-esbuild'

const plugins = [
  alias({
    entries: [],
    customResolver: nodeResolve({ extensions: [".tsx", ".ts"] })
  }),
  esbuild({
    // All options are optional
    include: /\.[jt]sx?$/, // default, inferred from `loaders` option
    exclude: /node_modules/, // default
    sourceMap: false, // by default inferred from rollup's `output.sourcemap` option
    minify: process.env.NODE_ENV === 'production',
    target: 'es2017', // default, or 'es20XX', 'esnext'
    jsx: 'transform', // default, or 'preserve'
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    // Like @rollup/plugin-replace
    define: {
      __VERSION__: '"x.y.z"',
    },
    tsconfig: 'tsconfig.json', // default
    // Add extra loaders
    loaders: {
      // Add .json files support
      // require @rollup/plugin-commonjs
      '.json': 'json',
      // Enable JSX in .js files too
      '.js': 'jsx',
    }
  }),
  nodeResolve(),
  commonjs()
]

const bundleConfig = {
  input: 'src/index.ts',
  output: {
    format: 'umd',
    name: 'MonitorCore',
    sourcemap: true,
    strict: false
  },
  context: 'window',
  plugins: [
    ...plugins
  ]
}

export default [
  {
    ...bundleConfig,
    output: {
      ...bundleConfig.output,
      file: 'build/index.js'
    }
  },
  {
    ...bundleConfig,
    output: {
      ...bundleConfig.output,
      file: 'build/index.min.js'
    },
    plugins: [
      ...bundleConfig.plugins,
      minify()
    ]
  }
]
