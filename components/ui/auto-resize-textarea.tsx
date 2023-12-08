import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxHeight?: number
  autoFocus?: boolean
}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const maxHeight = props.maxHeight || Math.pow(2, 16)

    React.useEffect(() => {
      if (textareaRef.current) {
        const element = textareaRef.current
        element.style.height = 'auto'
        element.style.height = Math.min(element.scrollHeight, 200) + 'px'
      }
    }, [props.value])

    React.useEffect(() => {
      if (props.autoFocus && textareaRef.current && !Boolean(props.value)) {
        textareaRef.current?.focus()
      }
    }, [props.autoFocus, props.value])

    return (
      <textarea
        className={cn('h-auto w-full resize-none', className)}
        style={{
          maxHeight: `${maxHeight}px`,
          overflow: `${
            textareaRef.current && textareaRef.current.scrollHeight > maxHeight
              ? 'auto'
              : 'hidden'
          }`,
        }}
        ref={textareaRef}
        rows={1}
        {...props}
      />
    )
  }
)
AutoResizeTextarea.displayName = 'AutoResizeTextarea'

export { AutoResizeTextarea }
