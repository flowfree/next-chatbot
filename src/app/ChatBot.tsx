'use client'

import { useState } from 'react'

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
    <div className="w-full">

      <ul className="flex flex-col">
        {messages.map((message, idx) => (
          <li key={idx} className="flex gap-2">
            <p>
              <strong>{message.role === 'user' ? 'You: ' : 'Bot: '}</strong>
              {message.content}
            </p>
          </li>
        ))}
      </ul>

      <form action="/api/chat" method="post" className="" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input 
            type="text" 
            name="question" 
            className="grow p-2 rounded-md border border-gray-300 outline-none focus:border-gray-400" 
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
