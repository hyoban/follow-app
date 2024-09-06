const path = require('node:path')

function kebabToCamelCase(str) {
  // arrow-right-circle-cute-fi -> ArrowRightCircleCuteFi
  // back-2-cute-re -> Back2CuteRe
  return str.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join('')
}

function defaultIndexTemplate(filePaths) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath))
    const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename
    return `export { default as Icon${kebabToCamelCase(exportName)} } from './${basename}'`
  })
  return exportEntries.join('\n')
}

module.exports = defaultIndexTemplate
