import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  let content = ''

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages
    })

    content = chatCompletion.choices[0].message.content?.trim() || ''
  } catch (error) {
    console.error(`Error communicating with OpenAI: ${error}`)
  }

  return NextResponse.json({ content })
}
