module.exports = {
  plugins: ['@svgr/plugin-jsx'],
  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-remove-jsx-attribute',
          {
            elements: ['Svg'],
            attributes: ['xmlns'],
          },
        ],
      ],
    },
  },
}
