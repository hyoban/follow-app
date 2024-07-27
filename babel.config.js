module.exports = function babel(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-iconify/plugin',
      ['inline-import', { extensions: ['.sql'] }],
      'react-native-reanimated/plugin',
    ],
  }
}
