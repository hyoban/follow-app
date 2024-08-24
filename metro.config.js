// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push('sql')

// This is a workaround for expo-dom
// https://github.com/expo/expo/issues/22482
// https://docs.expo.dev/versions/latest/config/metro/#custom-resolving
// https://github.com/facebook/metro/issues/330
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (
      moduleName.endsWith('./Platform')
      || moduleName.endsWith('../Utilities/Platform')
      || moduleName.endsWith('../Libraries/Utilities/Platform')
    ) {
      return {
        filePath: require.resolve('react-native-web/dist/exports/Platform'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('../Components/AccessibilityInfo/legacySendAccessibilityEvent')) {
      return {
        filePath: require.resolve('react-native-web/dist/exports/AccessibilityInfo'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('./PlatformColorValueTypes')) {
      return {
        filePath: require.resolve('react-native-web/dist/exports/StyleSheet'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('RCTNetworking')) {
      return {
        filePath: require.resolve('identity-obj-proxy'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('./RCTAlertManager')) {
      return {
        filePath: require.resolve('identity-obj-proxy'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('DevToolsSettings/DevToolsSettingsManager')) {
      return {
        filePath: require.resolve('identity-obj-proxy'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('Utilities/BackHandler')) {
      return {
        filePath: require.resolve('react-native-web/dist/exports/BackHandler'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('BaseViewConfig')) {
      return {
        filePath: require.resolve('identity-obj-proxy'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('../Image/Image')) {
      return {
        filePath: require.resolve('identity-obj-proxy'),
        type: 'sourceFile',
      }
    }

    if (moduleName.endsWith('./StyleSheet/PlatformColorValueTypes')) {
      return {
        filePath: require.resolve('identity-obj-proxy'),
        type: 'sourceFile',
      }
    }

    // Logic to resolve the module name to a file path...
    // NOTE: Throw an error if there is no resolution.
  }

  // * .expo/@dom/00bb935b368d3519cca2a1dc067f71ec1f66887b.js(.web.ts|.ts|.web.tsx|.tsx|.web.mjs|.mjs|.web.js|.js|.web.jsx|.jsx|.web.json|.json|.web.cjs|.cjs|.web.scss|.scss|.web.sass|.sass|.web.css|.css|.web.sql|.sql)
  // * .expo/@dom/00bb935b368d3519cca2a1dc067f71ec1f66887b.js/index(.web.ts|.ts|.web.tsx|.tsx|.web.mjs|.mjs|.web.js|.js|.web.jsx|.jsx|.web.json|.json|.web.cjs|.cjs|.web.scss|.scss|.web.sass|.sass|.web.css|.css|.web.sql|.sql)

  // For expo dom, we need to directly resolve the source files

  if (moduleName.includes('.expo/@dom/')) {
    const isAbsolute = path.isAbsolute(moduleName)

    return {
      filePath: isAbsolute ? moduleName : path.resolve(context.originModulePath, moduleName),
      type: 'sourceFile',
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
