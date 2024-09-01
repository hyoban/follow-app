function template(variables, { tpl }) {
  return tpl`
  ${variables.imports}
  import { useStyles } from 'react-native-unistyles'
  
  ${variables.interfaces}
  
  function ${variables.componentName}(${variables.props}) {
    const { theme } = useStyles()
    return (${variables.jsx})
  }
  
  ${variables.exports}
  `
}

module.exports = template
