module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // export * as ... を先に変換するプラグイン
      '@babel/plugin-transform-export-namespace-from',

      // 必要なら他のプラグインをここに追加
      // 例: 'module:react-native-dotenv' や 'react-native-paper/babel' など

      // react-native-reanimated の plugin は必ず最後に置く
      'react-native-reanimated/plugin'
    ],
  };
};
