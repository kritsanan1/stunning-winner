import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    // Store webhook event in database
    await supabaseAdmin
      .from('webhooks')
      .insert({
        event_type: event.type,
        stripe_event_id: event.id,
        payload: event.data.object,
      });

    switch (event.type) {
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  // Find user by email and link Stripe customer ID
  if (customer.email) {
    await supabaseAdmin
      .from('users')
      .update({ stripe_customer_id: customer.id })
      .eq('email', customer.email);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get user by Stripe customer ID
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (user) {
    await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        stripe_price_id: subscription.items.data[0]?.price.id,
        stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        status: subscription.status,
        plan_type: getPlanTypeFromPriceId(subscription.items.data[0]?.price.id),
      });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      stripe_price_id: subscription.items.data[0]?.price.id,
      stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      status: subscription.status,
      plan_type: getPlanTypeFromPriceId(subscription.items.data[0]?.price.id),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      plan_type: 'free',
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
      })
      .eq('stripe_subscription_id', invoice.subscription);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'past_due',
      })
      .eq('stripe_subscription_id', invoice.subscription);
  }
}

function getPlanTypeFromPriceId(priceId: string | undefined): string {
  if (!priceId) return 'free';
  
  // Map your Stripe price IDs to plan types
  const priceMap: { [key: string]: string } = {
    'price_basic': 'basic',
    'price_pro': 'pro',
    'price_enterprise': 'enterprise',
  };
  
  return priceMap[priceId] || 'free';
}
