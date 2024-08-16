function template(variables, { tpl }) {
  return tpl`
  ${variables.imports}
  
  ${variables.interfaces}
  
  function ${variables.componentName}(${variables.props}) {
    return (
      ${variables.jsx}
    )
  }
  
  ${variables.exports}
  `
}

module.exports = template
