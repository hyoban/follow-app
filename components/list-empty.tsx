import { useEffect, useState } from 'react'

import { Column } from './flex'
import { Iconify } from './icon'
import { Text } from './text'

type Props = {
  children: React.ReactNode
  waitBeforeShow?: number
}

function Delayed({ children, waitBeforeShow = 200 }: Props) {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, waitBeforeShow)
    return () => clearTimeout(timer)
  }, [waitBeforeShow])

  return isShown ? children : null
}

export function ListEmpty() {
  return (
    <Delayed>
      <Column
        h={150}
        align="center"
        justify="center"
        gap={10}
      >
        <Iconify icon="mgc:celebrate-cute-re" size={50} />
        <Text size={20}>Nothing here</Text>
      </Column>
    </Delayed>
  )
}
