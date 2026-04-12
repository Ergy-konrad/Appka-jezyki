import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// This endpoint is called by Vercel Cron daily to keep the Supabase
// free-tier database from pausing due to inactivity.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ status: 'skipped', reason: 'no supabase config' })
  }

  try {
    const supabase = createClient(url, key)

    // Ping: update the keepalive timestamp
    const { error } = await supabase
      .from('keepalive')
      .update({ last_ping: new Date().toISOString() })
      .eq('id', 1)

    if (error) {
      // Table might not exist yet, try a simple query instead
      await supabase.from('profiles').select('id').limit(1)
    }

    return NextResponse.json({
      status: 'ok',
      pinged_at: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 })
  }
}
