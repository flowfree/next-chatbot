import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      stream: true,
      messages
    })

    const stream = OpenAIStream(chatCompletion)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(`Error communicating with OpenAI: ${error}`)
  }
}
