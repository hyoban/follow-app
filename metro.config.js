// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push('sql')

// https://github.com/expo/expo/issues/22482
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // * .expo/@dom/00bb935b368d3519cca2a1dc067f71ec1f66887b.js(.web.ts|.ts|.web.tsx|.tsx|.web.mjs|.mjs|.web.js|.js|.web.jsx|.jsx|.web.json|.json|.web.cjs|.cjs|.web.scss|.scss|.web.sass|.sass|.web.css|.css|.web.sql|.sql)
  // * .expo/@dom/00bb935b368d3519cca2a1dc067f71ec1f66887b.js/index(.web.ts|.ts|.web.tsx|.tsx|.web.mjs|.mjs|.web.js|.js|.web.jsx|.jsx|.web.json|.json|.web.cjs|.cjs|.web.scss|.scss|.web.sass|.sass|.web.css|.css|.web.sql|.sql)

  // For expo dom, we need to directly resolve the source files

  if (moduleName.includes('.expo/@dom/')) {
    return {
      filePath: moduleName,
      type: 'sourceFile',
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
