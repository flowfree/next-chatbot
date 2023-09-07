'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Message {
  role: 'system' | 'assistant' | 'user'
  content: string
}

export default function ChatBot() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(question)

    const newMessages: Message[] = [
      ...messages, 
      { role: 'user', content: question },
      { role: 'assistant', content: '...'}
    ]
    setMessages(newMessages)
    setQuestion('')

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    })

    const stream = response.body

    if (stream === null) {
      throw new Error('Stream is null')
    }

    const reader = stream.getReader()
    const textDecoder = new TextDecoder('utf-8')
    
    let content = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      content += textDecoder.decode(value)
      setMessages(messages => ([
        ...messages.slice(0, -1),
        { role: 'assistant', content }
      ]))

      // Always scroll to the bottom of the page
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
      document.body.scrollTop = document.body.scrollHeight;
    }
  }

  return (
    <div className="chatbot w-full pb-8">

      <ul className="flex flex-col gap-2 text-base leading-normal text-gray-600">
        {messages.map((message, idx) => (
          <li key={idx} className={`flex gap-4 first:mt-4`}>
            <div>
              <Avatar initial={message.role === 'user' ? 'U' : 'B'} />
            </div>
            <div className="pt-1 markdown">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div>
                        <SyntaxHighlighter style={monokai}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>

      <form action="/api/chat" method="post" className="mt-2" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input 
            type="text" 
            name="question" 
            className="grow p-2 rounded-md border border-gray-200 outline-none focus:border-indigo-500" 
            placeholder="Send a message" 
            value={question}
            onChange={e => setQuestion(e.target.value)}
            autoComplete="off"
          />
          <button className="py-2 px-4 rounded-md shadow bg-indigo-600 hover:bg-indigo-600/90 text-white">
            Submit
          </button>
        </div>
      </form>

    </div>
  )
}

function Avatar({ initial }: { initial: string }) {
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-md bg-indigo-100 text-sm font-bold text-indigo-700">
      {initial.toUpperCase()}
    </div>
  )
}
