import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Dezactivează body parsing (necesar pentru verificarea semnăturii Stripe)
export const config = {
  api: { bodyParser: false },
};

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
  });

  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Tratează evenimentele Stripe
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        // TODO: Salvează în baza de date că acest email are abonament activ
        // Momentan logăm — înlocuiește cu DB (Supabase, PlanetScale etc.)
        console.log(`✅ Plată confirmată pentru: ${customerEmail}`);
        console.log(`   Session ID: ${session.id}`);
        console.log(`   Amount: ${session.amount_total} ${session.currency}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`❌ Abonament anulat: ${subscription.id}`);
      // TODO: Marchează userul ca non-premium în DB
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`⚠️ Plată eșuată pentru: ${invoice.customer_email}`);
      break;
    }

    default:
      console.log(`Eveniment netratat: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
