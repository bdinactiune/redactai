# 🚀 RedactAI — Ghid de lansare

## Ce s-a schimbat față de ArticolAI

### ✅ Rebranding complet
- Numele `ArticolAI` → `RedactAI` în tot codul
- URL-uri actualizate la `redactai.ro`
- Sitemap actualizat
- Metadata SEO îmbunătățită

### ✅ Securitate fixată
- Cheia Groq NU mai e hardcodată în cod — acum vine din `.env.local`
- JWT Secret vine din variabile de mediu (nu mai e `my-secret-key-123`)
- Validarea emailului îmbunătățită la login

### ✅ Stripe Webhook real
- Fișier nou: `app/api/stripe-webhook/route.ts`
- Verifică semnătura Stripe (securizat)
- Tratează: plată reușită, abonament anulat, plată eșuată

### ✅ Landing page nou
- Design dark editorial, modern
- Secțiuni: Hero, Features, Cum funcționează, Testimoniale, Prețuri, CTA
- Animații CSS, responsive complet
- Disponibil la `/landing` (sau mută la `/` dacă vrei să înlocuiești app-ul)

---

## 📋 Pași de deployment pe Vercel

### 1. Configurează variabilele de mediu în Vercel

Mergi la: **Vercel Dashboard → Proiectul tău → Settings → Environment Variables**

Adaugă aceste variabile:

```
GROQ_API_KEY          = gsk_... (cheia ta Groq de la console.groq.com)
JWT_SECRET            = (string random lung, ex: openssl rand -base64 32)
STRIPE_SECRET_KEY     = sk_live_... (din Stripe Dashboard)
STRIPE_WEBHOOK_SECRET = whsec_... (vezi pasul 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
NEXT_PUBLIC_APP_URL   = https://redactai.ro
ADMIN_EMAIL           = bdinactiune@gmail.com
```

⚠️ **IMPORTANT**: Șterge vechea cheie Groq `gsk_yKgJXZnWpUQThKaxRban...` din Groq Console — e compromisă (era în cod public).

### 2. Configurează domeniul redactai.ro în Vercel

1. Vercel Dashboard → Proiect → **Settings → Domains**
2. Adaugă `redactai.ro` și `www.redactai.ro`
3. La registratorul domeniului (unde ai cumpărat .ro), adaugă DNS:
   - `A record` → `76.76.21.21`
   - `CNAME www` → `cname.vercel-dns.com`

### 3. Configurează Stripe Webhook

1. Mergi la [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. URL: `https://redactai.ro/api/stripe-webhook`
4. Events de selectat:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copiază **Signing secret** → pune în Vercel ca `STRIPE_WEBHOOK_SECRET`

### 4. Deploy

```bash
git add .
git commit -m "Rebranding RedactAI + securitate + webhook Stripe"
git push origin main
```

Vercel face deploy automat.

### 5. Actualizează Google Search Console

1. Mergi la [search.google.com/search-console](https://search.google.com/search-console)
2. Adaugă proprietatea `redactai.ro`
3. Submite sitemap: `https://redactai.ro/sitemap.xml`

---

## 🔧 Landing page

Landing page-ul nou e la `/landing`. Ai 2 opțiuni:

**Opțiunea A** — Îl folosești ca pagină principală (recomandat pentru conversii):
- Mută conținutul din `app/landing/page.tsx` în `app/page.tsx`
- Mută app-ul actual (generatorul) la `/app`
- Actualizează link-urile din landing să pointeze la `/app`

**Opțiunea B** — Landing la `/landing`, generatorul la `/`:
- Actualizează link-urile din navbar să meargă la `/landing`
- Promovezi direct `redactai.ro/landing`

---

## 🔮 Următorii pași (după lansare)

### Bază de date (necesar pentru Stripe real)
Momentan, după o plată Stripe, webhook-ul doar loghează emailul.
Pentru a salva cine a plătit, ai nevoie de o DB:

**Recomandat: Supabase (gratuit)**
1. Creează cont la [supabase.com](https://supabase.com)
2. Creează tabel `subscribers(email, stripe_session_id, active, created_at)`
3. În webhook, inserează row când cineva plătește
4. La fiecare generare, verifică dacă emailul e în tabel cu `active = true`

### Marketing pentru primii clienți
- Post în grupurile Facebook: "Antreprenori Online Romania", "Marketing Digital Romania"
- Reddit: r/Romania, r/antreprenoriat
- LinkedIn personal cu demo video
- TikTok / Reels cu screen recording al generatorului

---

## ⚡ Rezumat fișiere modificate

| Fișier | Ce s-a schimbat |
|--------|----------------|
| `app/api/generate/route.ts` | Eliminat API key hardcodat, folosit `process.env.GROQ_API_KEY` |
| `app/api/login/route.ts` | JWT Secret din env, validare email |
| `app/api/stripe-webhook/route.ts` | **NOU** — Webhook Stripe real |
| `app/landing/page.tsx` | **NOU** — Landing page modern |
| `app/layout.tsx` | Rebranding, metadata SEO îmbunătățită |
| `app/page.tsx` | Logo "RedactAI", PDF filename, share text |
| `app/pricing/page.tsx` | "Planuri RedactAI" |
| `app/sitemap.ts` | URL-uri redactai.ro |
| `public/sitemap.xml` | URL-uri redactai.ro |
| `.env.example` | **NOU** — Template variabile de mediu |
