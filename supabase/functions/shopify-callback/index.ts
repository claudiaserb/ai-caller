import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SHOPIFY_CLIENT_ID = Deno.env.get('SHOPIFY_CLIENT_ID')!
const SHOPIFY_CLIENT_SECRET = Deno.env.get('SHOPIFY_CLIENT_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const url = new URL(req.url)
  const shop = url.searchParams.get('shop')
  const code = url.searchParams.get('code')
  const stateParam = url.searchParams.get('state')

  if (!shop || !code) {
    return new Response('Missing parameters', { status: 400 })
  }

  // Parse state to get user_id
  let userId = null
  try {
    const state = JSON.parse(decodeURIComponent(stateParam || '{}'))
    userId = state.user_id
  } catch (e) {
    console.error('Failed to parse state:', e)
  }

  // Exchange code for access token
  const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: SHOPIFY_CLIENT_ID,
      client_secret: SHOPIFY_CLIENT_SECRET,
      code: code,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (!tokenData.access_token) {
    console.error('Failed to get access token:', tokenData)
    return new Response('Failed to get access token', { status: 400 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Save to shopify_stores table
  const { error: shopifyError } = await supabase
    .from('shopify_stores')
    .upsert({
      user_id: userId,
      shop_domain: shop,
      access_token: tokenData.access_token,
      scope: tokenData.scope,
    }, {
      onConflict: 'shop_domain'
    })

  if (shopifyError) {
    console.error('Error saving to shopify_stores:', shopifyError)
  }

  // Save to shops table for dropdown
  const shopName = shop.replace('.myshopify.com', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const { error: shopsError } = await supabase
    .from('shops')
    .insert({
      user_id: userId,
      name: shopName,
      platform: 'Shopify',
      store_url: `https://${shop}`,
      api_key: tokenData.access_token,
      is_active: true,
    })

  if (shopsError) {
    console.error('Error saving to shops:', shopsError)
  }

  // Register webhook for new orders
  const webhookUrl = `${SUPABASE_URL}/functions/v1/shopify-webhook`

  const webhookResponse = await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': tokenData.access_token,
    },
    body: JSON.stringify({
      webhook: {
        topic: 'orders/create',
        address: webhookUrl,
        format: 'json',
      },
    }),
  })

  const webhookData = await webhookResponse.json()

  if (webhookData.errors) {
    console.error('Error registering webhook:', webhookData.errors)
  } else {
    console.log('Webhook registered successfully:', webhookData)
  }

  // Redirect to app dashboard
  return Response.redirect('http://localhost:5173/profile?tab=stores&shopify=connected', 302)
})