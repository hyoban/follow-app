// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push('sql')

// https://github.com/expo/expo/issues/22482
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
  // Optionally, chain to the standard Metro resolver.
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
