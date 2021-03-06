const path = require("path");

const pkgName = "fetchNodeDetails";
const libraryName = pkgName.charAt(0).toUpperCase() + pkgName.slice(1);

const baseConfig = {
  mode: "production",
  entry: "./index.js",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    library: libraryName,
    libraryExport: "default",
  },
  module: {
    rules: [],
  },
};

const eslintLoader = {
  enforce: "pre",
  test: /\.js$/,
  exclude: /node_modules/,
  loader: "eslint-loader",
};

const babelLoaderWithPolyfills = {
  test: /\.m?js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "babel-loader",
  },
};

const optimization = {
  optimization: {
    minimize: false,
  },
};

const babelLoader = { ...babelLoaderWithPolyfills, use: { loader: "babel-loader", options: { plugins: ["@babel/transform-runtime"] } } };

const umdPolyfilledConfigMinified = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.polyfill.umd.min.js`,
    libraryTarget: "umd",
  },
  module: {
    rules: [eslintLoader, babelLoaderWithPolyfills],
  },
};

const umdPolyfilledConfig = {
  ...umdPolyfilledConfigMinified,
  ...optimization,
  output: {
    ...umdPolyfilledConfigMinified.output,
    filename: `${pkgName}.polyfill.umd.js`,
  },
};

const umdConfigMinified = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.umd.min.js`,
    libraryTarget: "umd",
  },
  module: {
    rules: [eslintLoader, babelLoader],
  },
};

const umdConfig = {
  ...umdConfigMinified,
  ...optimization,
  output: {
    ...umdConfigMinified.output,
    filename: `${pkgName}.umd.js`,
  },
};

const cjsConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.cjs.js`,
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [eslintLoader, babelLoader],
  },
  externals: [/^(@babel\/runtime)/i],
};

module.exports = [umdPolyfilledConfig, umdPolyfilledConfigMinified, umdConfig, umdConfigMinified, cjsConfig];

// v5
// experiments: {
//   outputModule: true
// }

// node: {
//   global: true,
// },
// resolve: {
//   alias: { crypto: 'crypto-browserify', stream: 'stream-browserify', vm: 'vm-browserify' },
//   aliasFields: ['browser'],
// },
