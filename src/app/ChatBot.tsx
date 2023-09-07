'use client'

import { useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

interface Message {
  role: 'system' | 'assistant' | 'user'
  content: string
}

export default function ChatBot() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newMessages: Message[] = [...messages, { role: 'user', content: question }]
    setMessages(newMessages)
    setQuestion('')

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: newMessages })
    })

    const { content } = await response.json()
    setMessages((m) => ([...m, { role: 'assistant', content }]))
  }

  return (
    <div className="chatbot w-full">

      <div className="mt-4 flex flex-col gap-4 text-base leading-normal text-gray-600">
        {messages.map((message, idx) => (
          <div key={idx} className="flex gap-4">
            <div>
              <Avatar initial={message.role === 'user' ? 'NA' : 'B'} />
            </div>
            <div className="pt-1">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <form action="/api/chat" method="post" className="mt-4" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input 
            type="text" 
            name="question" 
            className="grow p-2 rounded-md border border-gray-200 outline-none focus:border-gray-300" 
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
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
      {initial.toUpperCase()}
    </div>
  )
}
