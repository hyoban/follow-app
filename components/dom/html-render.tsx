'use dom'

import './main.css'

import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import type { Root } from 'hast-util-to-jsx-runtime/lib'
import { useEffect } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import { VFile } from 'vfile'

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
  onLayout: (size: [number, number]) => Promise<void>
  content: string
}) {
  useSize(onLayout)

  const file = new VFile(content)

  const pipeline = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeStringify)

  const tree = pipeline.parse(content)

  const hastTree = pipeline.runSync(tree, file) as Root
  const result = toJsxRuntime(hastTree, {
    Fragment,
    ignoreInvalidStyle: true,
    jsx: (type, props, key) => jsx(type as any, props, key),
    jsxs: (type, props, key) => jsxs(type as any, props, key),
    passNode: true,
  })

  return (
    <div
      className="prose w-full p-6 dark:prose-invert"
    >
      {result}
    </div>
  )
}
