'use client'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import { useChat } from 'ai/react'
import { EraserIcon, SendIcon, SparklesIcon, SquareIcon } from 'lucide-react'
import { KeyboardEvent, useEffect, useRef } from 'react'

export default function Chat() {
  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
  } = useChat()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      // click the submit button
      const submitButton = document.getElementById('chat-submit')
      if (submitButton) {
        submitButton.click()
      }
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      const element = textareaRef.current
      element.style.height = 'auto'
      element.style.height = Math.min(element.scrollHeight, 200) + 'px'
    }
  }, [input])

  return (
    <>
      {messages.length === 0 && (
        <div className="mt-[20vh] text-center flex items-center justify-center flex-col gap-8 text-xl">
          <SparklesIcon className="mx-auto h-12 w-12 text-primary" />
          Ask a question below!
        </div>
      )}
      <div className="flex flex-col py-8 gap-4 w-full max-w-7xl mx-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`flex items-center gap-2 max-w-[40vw] p-2 px-4 rounded-sm ${
                message.role === 'assistant'
                  ? 'bg-primary text-white'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="pb-2 pr-1 fixed bottom-6 right-16 left-16">
        <form
          className="relative flex w-full items-end gap-4 rounded bg-muted p-2 pl-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          onSubmit={handleSubmit}
        >
          {messages.length > 0 && (
            <>
              {isLoading ? (
                <div className="absolute -top-16 right-0 flex justify-end bg-transparent pr-3">
                  <Button
                    variant={'outline'}
                    onClick={stop}
                    className="bg-background"
                  >
                    Stop
                    <SquareIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="absolute -top-16 left-1/2 flex -translate-x-1/2 transform gap-4 bg-transparent pr-3">
                  <Button
                    type="button"
                    variant={'outline'}
                    onClick={() => setMessages([])}
                    className="w-48 bg-background"
                  >
                    Clear
                    <EraserIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              className="h-auto w-full w-full resize-none bg-transparent outline-none"
              style={{
                bottom: `${textareaRef?.current?.scrollHeight}px`,
                maxHeight: '200px',
                overflow: `${
                  textareaRef.current && textareaRef.current.scrollHeight > 200
                    ? 'auto'
                    : 'hidden'
                }`,
              }}
              placeholder={'Ask a question...'}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button
            size={'sm'}
            disabled={!Boolean(input) || isLoading}
            type="submit"
            id="chat-submit"
          >
            {isLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </>
  )
}
