const path = require('node:path')
const { cleanupSVG, importDirectorySync, isEmptyColor, parseColors, runSVGO } = require('@iconify/tools')
const { compareColors, stringToColor } = require('@iconify/utils/lib/colors')

function getCollection(dir) {
  // Import icons
  const iconSet = importDirectorySync(dir, {
    includeSubDirs: false,
  })

  // Validate, clean up, fix palette and optimism
  iconSet.forEachSync((name, type) => {
    if (type !== 'icon') {
      return
    }

    const svg = iconSet.toSVG(name)
    if (!svg) {
      // Invalid icon
      iconSet.remove(name)
      return
    }

    // Clean up and optimize icons
    try {
      // Clean up icon code
      cleanupSVG(svg)

      // Change color to `currentColor`
      // Skip this step if icon has hardcoded palette
      const blackColor = stringToColor('black')
      const whiteColor = stringToColor('white')
      parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          if (!color) {
            // Color cannot be parsed!
            throw new Error(
              `Invalid color: "${colorStr}" in attribute ${attr}`,
            )
          }

          if (isEmptyColor(color)) {
            // Color is empty: 'none' or 'transparent'. Return as is
            return color
          }

          // Change black to 'currentColor'
          if (compareColors(color, blackColor)) {
            return 'currentColor'
          }

          // Remove shapes with white color
          if (compareColors(color, whiteColor)) {
            return 'remove'
          }

          // NOTE: MGC icons has default color of #10161F
          if (compareColors(color, stringToColor('#10161F'))) {
            return 'currentColor'
          }

          // Icon is not monotone
          return color
        },
      })

      runSVGO(svg)
    }
    catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err)
      iconSet.remove(name)
      return
    }

    // Update icon
    iconSet.fromSVG(name, svg)
  })

  // Export
  return iconSet.export()
}

module.exports = function babel(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        './babel-iconify.js',
        {
          collections: {
            mgc: getCollection(path.resolve(__dirname, './icons/mgc')),
          },
        },
      ],
      [
        'inline-import',
        { extensions: ['.sql'] },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
