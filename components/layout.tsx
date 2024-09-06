import type { ColorValue, DimensionValue } from 'react-native'

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

export type BackgroundColor = {
  bg?: ColorValue
  text?: ColorValue
}

export type CommonProps = Padding & Margin & Width & Height & BackgroundColor
