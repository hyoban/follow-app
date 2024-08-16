const path = require('node:path')

function defaultIndexTemplate(filePaths) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath))
    const exportName = basename.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
    return `export { default as Icon${exportName} } from './${basename}'`
  })
  return exportEntries.join('\n')
}

module.exports = defaultIndexTemplate
