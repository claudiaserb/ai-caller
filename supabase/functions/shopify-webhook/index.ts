import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const shopDomain = req.headers.get('x-shopify-shop-domain')
  const topic = req.headers.get('x-shopify-topic')
  
  console.log('Webhook received:', topic, 'from', shopDomain)

  if (topic !== 'orders/create') {
    return new Response('OK', { status: 200 })
  }

  const order = await req.json()

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Get shop_id and user_id from shopify_stores
  const { data: storeData, error: storeError } = await supabase
    .from('shopify_stores')
    .select('user_id')
    .eq('shop_domain', shopDomain)
    .single()

  if (storeError || !storeData) {
    console.error('Store not found:', shopDomain, storeError)
    return new Response('Store not found', { status: 404 })
  }

  // Get shop_id from shops table
  const { data: shopData, error: shopError } = await supabase
    .from('shops')
    .select('id')
    .eq('store_url', `https://${shopDomain}`)
    .single()

  if (shopError || !shopData) {
    console.error('Shop not found in shops table:', shopDomain, shopError)
    return new Response('Shop not found', { status: 404 })
  }

  // Save order to orders table
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: storeData.user_id,
      shop_id: shopData.id,
      shopify_order_id: String(order.id),
      order_number: String(order.order_number),
      customer_name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'Unknown',
      customer_phone: order.customer?.phone || order.shipping_address?.phone || order.billing_address?.phone || null,
      customer_email: order.customer?.email || null,
      total_amount: parseFloat(order.total_price) || 0,
      currency: order.currency || 'RON',
      order_status: 'pending',
      payment_status: order.financial_status || 'pending',
      shipping_status: order.fulfillment_status || 'unfulfilled',
      payment_method: order.payment_gateway_names?.[0] || 'unknown',
      country_code: order.shipping_address?.country_code || order.billing_address?.country_code || null,
      placed_at: order.created_at,
      notes: order.note || null,
    })

  if (orderError) {
    console.error('Error saving order:', orderError)
    return new Response('Error saving order', { status: 500 })
  }

  console.log('Order saved successfully:', order.order_number)

  // TODO: Trigger AI call here for order confirmation

  return new Response('OK', { status: 200 })
})