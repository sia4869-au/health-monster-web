const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// package.json の exports 解決で壊れる場合の回避
config.resolver.unstable_enablePackageExports = false;

module.exports = config;