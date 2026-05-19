import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'WriteFlow Premium',
              description: 'Generări nelimitate cu AI',
            },
            unit_amount: 999,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Eroare la crearea sesiunii' }, { status: 500 });
  }
}