import { GoogleGenerativeAI } from '@fuyun/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
const apiBaseUrl = process.env.API_BASE_URL

// 使用条件运算符来决定是否传递 baseURL
const genAI = apiBaseUrl
  ? new GoogleGenerativeAI(apiKey, apiBaseUrl)
  : new GoogleGenerativeAI(apiKey)

export const startChatAndSendMessageStream = async(history: ChatMessage[], newMessage: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const chat = model.startChat({
    history: history.map(msg => ({
      role: msg.role,
      parts: msg.parts.map(part => part.text).join(''), // Join parts into a single string
    })),
    generationConfig: {
      maxOutputTokens: 8000,
    },
  })

  // Use sendMessageStream for streaming responses
  const result = await chat.sendMessageStream(newMessage)
  return result.stream
}
