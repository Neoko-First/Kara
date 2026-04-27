module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
      // ⚠️ doit toujours être en dernier
      "react-native-reanimated/plugin",
    ],
  };
};
