import { NextRequest, NextResponse } from 'next/server'

// Free Dictionary API - no API key needed!
// https://dictionaryapi.dev/
export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get('word')
  const lang = request.nextUrl.searchParams.get('lang') || 'en'

  if (!word) {
    return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURIComponent(word)}`
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Word not found', word }, { status: 404 })
      }
      throw new Error(`Dictionary API returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch dictionary data', details: String(err) },
      { status: 500 }
    )
  }
}
