module.exports = {
  svgProps: {
    viewBox: '0 0 24 24',
  },
  replaceAttrValues: {
    '#10161F': '{props.color || theme.colors.gray12}',
  },
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
