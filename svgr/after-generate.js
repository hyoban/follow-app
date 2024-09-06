// read all files under components/icons directory, exclude index.ts file.
const fs = require('node:fs')
const path = require('node:path')

const iconsDir = path.resolve(__dirname, '../components/icons')
const icons = fs.readdirSync(iconsDir).filter(file => file !== 'index.ts')

// remove `<Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />` in file content
const removeFillOpacity = content => content.replaceAll(/<Path fill="#fff" fillOpacity=\{0.01\} d="M24 0v24H0V0z" \/>/g, '')
// replace `Ref<SVGSVGElement>` with `Ref<Svg>`
const replaceRef = content => content.replaceAll('Ref<SVGSVGElement>', 'Ref<Svg>')

icons.forEach((icon) => {
  const filePath = path.resolve(iconsDir, icon)
  const content = fs.readFileSync(filePath, 'utf-8')
  const updatedContent = removeFillOpacity(content)
  fs.writeFileSync(filePath, replaceRef(updatedContent))
})

// run `eslint --fix` to format all files
const { execSync } = require('node:child_process')

execSync('npx eslint --fix components/icons/*', { stdio: 'inherit' })
