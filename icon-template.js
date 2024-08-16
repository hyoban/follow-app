function template(variables, { tpl }) {
  return tpl`
  import { memo } from 'react'
  import type { SvgProps } from 'react-native-svg'
  import Svg, { Path } from 'react-native-svg'
  
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
