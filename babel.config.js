 /** @type {import('react-native-worklets/plugin').PluginOptions} */
  const workletsPluginOptions = {
    useRunOnUIFunction: true
  }
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin','react-native-worklets/plugin', workletsPluginOptions],
};
