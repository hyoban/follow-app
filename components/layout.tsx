import type { DimensionValue } from 'react-native'

export type Padding = {
  p?: DimensionValue
  px?: DimensionValue
  py?: DimensionValue
  pt?: DimensionValue
  pr?: DimensionValue
  pb?: DimensionValue
  pl?: DimensionValue
}

export type Margin = {
  m?: DimensionValue
  mx?: DimensionValue
  my?: DimensionValue
  mt?: DimensionValue
  mr?: DimensionValue
  mb?: DimensionValue
  ml?: DimensionValue
}

export type Width = {
  w?: DimensionValue
  minW?: DimensionValue
  maxW?: DimensionValue
}

export type Height = {
  h?: DimensionValue
  minH?: DimensionValue
  maxH?: DimensionValue
}

export type Color = {
  bg?: 'app' | 'subtle' | 'component' | string & {}
  text?: string
}

export type CommonProps = Padding & Margin & Width & Height & Color
