import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import esbuild, { minify } from 'rollup-plugin-esbuild'

const plugins = [
  // 设置别名
  alias({
    entries: [
      {
        find: '@monitor/core',
        replacement: path.join(__dirname, '../core/src')
      },
      {
        find: '@monitor/error-tracker-kit',
        replacement: path.join(__dirname, '../error-tracker-kit/src')
      },
    ],
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
  // 支持 nodejs 内部模块加载
  nodeResolve(),
  // 支持 commonjs 规范模块加载
  commonjs()
]

const bundleConfig = {
  input: 'src/index.tsx',
  output: {
    format: 'umd',
    name: 'ReactErrorTracker',
    sourcemap: true,
    strict: false,
    // 指定外部模块的全部变量名
    globals: {
      'react': 'React'
    },
  },
  //
  context: 'window',
  plugins: [
    ...plugins
  ],
  // 显示指定外部模块
  external: [
    'react'
  ],
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
