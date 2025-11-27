import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SHOPIFY_CLIENT_ID = Deno.env.get('SHOPIFY_CLIENT_ID')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const REDIRECT_URI = SUPABASE_URL + '/functions/v1/shopify-callback'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const url = new URL(req.url)
  const shop = url.searchParams.get('shop')
  const userId = url.searchParams.get('user_id')

  if (!shop) {
    return new Response('Missing shop parameter', { status: 400 })
  }

  const scopes = 'read_orders,write_orders,read_customers'

  const state = JSON.stringify({
    nonce: crypto.randomUUID(),
    user_id: userId
  })

  const authUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_CLIENT_ID}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `state=${encodeURIComponent(state)}`

  return Response.redirect(authUrl, 302)
})