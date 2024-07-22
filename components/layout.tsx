export type Padding = {
  p?: number
  px?: number
  py?: number
  pt?: number
  pr?: number
  pb?: number
  pl?: number
}

export type Margin = {
  m?: number
  mx?: number
  my?: number
  mt?: number
  mr?: number
  mb?: number
  ml?: number
}

export type Width = {
  w?: number
  minW?: number
  maxW?: number
}

export type Height = {
  h?: number
  minH?: number
  maxH?: number
}

export type Color = {
  bg?: 'app' | 'subtle' | 'component' | string & {}
  text?: string
}

export type CommonProps = Padding & Margin & Width & Height & Color
