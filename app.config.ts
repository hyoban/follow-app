import type { ConfigContext, ExpoConfig } from 'expo/config'

export default function app({ config }: ConfigContext): ExpoConfig {
  return {
    ...config,

    name: 'Follow',
    slug: 'follow-app',
    version: '1.0.0',
    scheme: 'follow',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-dev-launcher',
        {
          launchMode: 'most-recent',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: [
      '**/*',
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'cc.hyoban.follow',
      userInterfaceStyle: 'automatic',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'cc.hyoban.follow',
      userInterfaceStyle: 'automatic',
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '0de3f5f4-f24c-491f-a2a2-3d303f84f790',
      },
    },
  }
}
