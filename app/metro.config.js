const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// path.resolve garantit un chemin compatible Windows → converti en file:// par Metro
const config = getDefaultConfig(path.resolve(__dirname));

module.exports = withNativeWind(config, { input: "./global.css" });
