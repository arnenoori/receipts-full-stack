'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import React, { MouseEventHandler, ReactElement, useState } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip'
import { useToast } from '../use-toast'

type Props = {
  side?: 'left' | 'right' | 'top' | 'bottom'
} & (
  | {
      children: string
      value?: string
    }
  | {
      children: ReactElement
      value: string
    }
)

export default function CopyCell({ side, children, value }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const { toast } = useToast()

  const handleCopy: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()

    if (typeof children === 'string') {
      navigator.clipboard.writeText(value ?? children)
    } else if (value) {
      navigator.clipboard.writeText(value)
    }

    setCopied(true)
    setOpen(true)

    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    })

    setTimeout(() => {
      setCopied(false)
      setOpen(false)
    }, 1500)
  }

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          {typeof children === 'string' ? (
            <button className="cursor-pointer" onClick={handleCopy}>
              {children}
            </button>
          ) : (
            // add the onClick handler to the first child
            React.cloneElement(children, {
              onClick: handleCopy,
            })
          )}
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2" side={side}>
          {copied ? 'Copied' : 'Click to copy'}
          {copied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
