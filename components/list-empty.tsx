import { Column } from './flex'
import { Iconify } from './icon'
import { Text } from './text'

export function ListEmpty() {
  return (
    <Column
      h={150}
      align="center"
      justify="center"
      gap={10}
    >
      <Iconify icon="mgc:celebrate-cute-re" size={50} />
      <Text size={20}>Nothing here</Text>
    </Column>
  )
}
