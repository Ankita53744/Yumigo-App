const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  defaultConfig.resolver.extraNodeModules = require("react-native-polyfill-globals");
  return defaultConfig;
})();
