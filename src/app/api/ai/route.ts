import { NextRequest, NextResponse } from 'next/server'

// AI Tutor endpoint - works with Groq (free!), OpenAI, or any OpenAI-compatible API
// Default: Groq free tier (console.groq.com)

const PROVIDERS = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
  },
}

const SYSTEM_PROMPT = `Jesteś LinguaTutor - przyjaznym nauczycielem języków dla polskiego użytkownika.

Twoje możliwości:
- Uczysz angielskiego (poziom B2) i hiszpańskiego (od zera/A1)
- Tłumaczysz słowa i zdania z kontekstem
- Wyjaśniasz gramatykę w prosty sposób po polsku
- Prowadzisz konwersację w wybranym języku
- Poprawiasz błędy i wyjaśniasz dlaczego coś jest źle
- Podajesz przykłady użycia słów
- Generujesz ćwiczenia dostosowane do poziomu

Zasady:
- Odpowiadaj po polsku, chyba że użytkownik pisze w innym języku
- Używaj emoji żeby było weselej
- Gdy podajesz słowa/frazy w obcym języku, dodawaj wymowę w nawiasie
- Bądź cierpliwy i motywujący
- Dawaj krótkie, konkretne odpowiedzi
- Gdy poprawiasz błędy, rób to delikatnie i z wyjaśnieniem`

export async function POST(request: NextRequest) {
  const apiKey = process.env.AI_API_KEY || process.env.GROQ_API_KEY
  const provider = (process.env.AI_PROVIDER || 'groq') as keyof typeof PROVIDERS

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'AI not configured',
        message: 'Dodaj GROQ_API_KEY do zmiennych środowiskowych. Darmowe konto: console.groq.com',
      },
      { status: 503 }
    )
  }

  try {
    const { messages } = await request.json()

    const config = PROVIDERS[provider] || PROVIDERS.groq

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AI API error:', response.status, errorData)
      return NextResponse.json(
        { error: 'AI API error', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Brak odpowiedzi.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('AI error:', err)
    return NextResponse.json(
      { error: 'Failed to get AI response', details: String(err) },
      { status: 500 }
    )
  }
}
