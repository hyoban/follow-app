'use dom'

import './main.css'

import { useEffect } from 'react'

function useSize(callback: (size: [number, number]) => void) {
  useEffect(() => {
    // Observe window size changes
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        callback([width, height])
      }
    })

    observer.observe(document.body)

    callback([document.body.clientWidth, document.body.clientHeight])

    return () => {
      observer.disconnect()
    }
  }, [callback])
}

export default function HtmlRender({
  onLayout,
  content,
}: {
  dom: import('expo/dom').DOMProps
  onLayout: (size: [number, number]) => any
  content: string
}) {
  useSize(onLayout)

  return (
    <div
      className="prose w-full p-6 dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
