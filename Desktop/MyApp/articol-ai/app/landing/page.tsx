import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RedactAI — Scrie mai repede cu AI | Generator de conținut în română',
  description: 'Generează articole de blog, postări social media, emailuri profesionale și texte publicitare în română — în câteva secunde. Încearcă gratuit.',
};

export default function LandingPage() {
  return (
    <main style={{
      fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      background: '#0a0a0f',
      color: '#f0eee8',
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.7s ease forwards;
        }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.3s; }
        .fade-up-4 { animation-delay: 0.45s; }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .glow-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .glow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
        }
        .glow-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .feature-card {
          background: #13131f;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          border-color: rgba(139, 92, 246, 0.4);
          transform: translateY(-4px);
        }

        .testimonial-card {
          background: #13131f;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 24px;
        }

        .price-card {
          border-radius: 20px;
          padding: 32px;
          transition: transform 0.2s;
        }
        .price-card:hover { transform: translateY(-4px); }

        .noise {
          position: fixed;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .mesh {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .cta-title { font-size: 28px !important; }
        }
      `}</style>

      {/* Noise overlay */}
      <div className="noise" />

      {/* ====== NAVBAR ====== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, fontFamily: 'Sora' }}>R</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#f0eee8', letterSpacing: '-0.02em' }}>RedactAI</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/pricing" style={{ color: '#999', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Prețuri</Link>
          <Link href="/blog" style={{ color: '#999', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
          <Link href="/app" className="glow-btn" style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: '#fff', textDecoration: 'none',
            padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          }}>
            Încearcă gratuit
          </Link>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        overflow: 'hidden',
      }}>
        {/* Gradient meshes */}
        <div className="mesh" style={{ width: 500, height: 500, background: 'rgba(109,40,217,0.25)', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="mesh" style={{ width: 300, height: 300, background: 'rgba(139,92,246,0.15)', top: '30%', left: '10%' }} />
        <div className="mesh" style={{ width: 250, height: 250, background: 'rgba(76,29,149,0.2)', top: '20%', right: '5%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780 }}>
          {/* Badge */}
          <div className="fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, background: '#8b5cf6', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 500 }}>Generator AI în limba română</span>
          </div>

          <h1 className="fade-up fade-up-2 hero-title" style={{
            fontSize: 64, fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 24,
          }}>
            Scrie mai repede.<br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Publică mai mult.
            </span>
          </h1>

          <p className="fade-up fade-up-3" style={{
            fontSize: 19, color: '#9ca3af', lineHeight: 1.7,
            marginBottom: 40, maxWidth: 560, margin: '0 auto 40px',
            fontWeight: 300,
          }}>
            RedactAI generează articole de blog, postări sociale, emailuri și reclame
            în română — în câteva secunde, cu AI de ultimă generație.
          </p>

          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/app" className="glow-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: '#fff', textDecoration: 'none',
              padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 700,
            }}>
              Începe gratuit — 5 generări
              <span style={{ fontSize: 18 }}>→</span>
            </Link>
            <Link href="/pricing" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#d1d5db', textDecoration: 'none',
              padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 500,
              transition: 'border-color 0.2s',
            }}>
              Vezi prețuri
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 48, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { num: '500+', label: 'utilizatori activi' },
              { num: '12,000+', label: 'articole generate' },
              { num: '4.9★', label: 'rating mediu' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f0eee8', letterSpacing: '-0.02em' }}>{num}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Tot ce ai nevoie pentru<br />
            <span style={{ color: '#8b5cf6' }}>content de calitate</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: 17, maxWidth: 480, margin: '0 auto', fontWeight: 300 }}>
            De la idee la text publicabil — fără blocaje creative, fără ore pierdute.
          </p>
        </div>

        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              icon: '✍️',
              title: 'Articole de blog',
              desc: 'Articole SEO-optimizate, structurate cu titluri și subtitluri, gata de publicat pe orice platformă.',
            },
            {
              icon: '📱',
              title: 'Postări social media',
              desc: 'Facebook, Instagram, LinkedIn, TikTok — texte adaptate fiecărui canal, cu hashtag-uri incluse.',
            },
            {
              icon: '📧',
              title: 'Emailuri profesionale',
              desc: 'De la emailuri de vânzare la follow-up-uri și newslettere — ton corect, mesaj clar.',
            },
            {
              icon: '🛍️',
              title: 'Descrieri de produse',
              desc: 'Texte care vând: beneficii clare, ton persuasiv, adaptate categoriei de produs.',
            },
            {
              icon: '📣',
              title: 'Texte publicitare',
              desc: 'Ad copy pentru Google Ads, Meta Ads, bannere — concis, direct, cu CTA puternic.',
            },
            {
              icon: '🌐',
              title: 'Bilingv RO + EN',
              desc: 'Generezi conținut atât în română cât și în engleză — ideal pentru afaceri cu audiență internațională.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#f0eee8' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(109,40,217,0.05) 50%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 56 }}>
            3 pași. 30 de secunde.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative' }}>
            {[
              { step: '01', title: 'Alegi tipul de conținut', desc: 'Blog, social media, email sau reclamă — tu decizi.' },
              { step: '02', title: 'Descrii subiectul', desc: 'Câteva cuvinte sau o frază. AI-ul face restul.' },
              { step: '03', title: 'Copiezi și publici', desc: 'Textul e gata. Export PDF sau trimite pe email.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} style={{ position: 'relative' }}>
                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: 20, left: '60%', right: '-40%',
                    height: 1, background: 'linear-gradient(90deg, rgba(139,92,246,0.4), transparent)',
                  }} />
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: 13, fontWeight: 700, color: '#fff',
                }}>
                  {step}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 48 }}>
          Ce spun utilizatorii
        </h2>
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { name: 'Andrei M.', role: 'Blogger', text: 'Am redus timpul de scriere a unui articol de la 3 ore la 20 de minute. RedactAI e indispensabil acum.' },
            { name: 'Maria P.', role: 'Social Media Manager', text: 'Generez postările pentru toți clienții mei în jumătate din timp. Calitatea textelor e surprinzător de bună.' },
            { name: 'Radu C.', role: 'Antreprenor online', text: 'Descrierile de produse generate convertesc mai bine decât ce scriam eu manual. Recomand cu încredere.' },
          ].map(({ name, role, text }) => (
            <div key={name} className="testimonial-card">
              <div style={{ color: '#8b5cf6', fontSize: 20, marginBottom: 12 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7, marginBottom: 20, fontWeight: 300 }}>"{text}"</p>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#f0eee8' }}>{name}</div>
                <div style={{ fontSize: 12, color: '#4b5563' }}>{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Prețuri simple</h2>
          <p style={{ color: '#6b7280', fontSize: 17, fontWeight: 300 }}>Fără taxe ascunse. Anulare oricând.</p>
        </div>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {/* Free */}
          <div className="price-card" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Gratuit</div>
            <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 4 }}>0 RON</div>
            <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 28 }}>pentru totdeauna</div>
            <ul style={{ listStyle: 'none', marginBottom: 32 }}>
              {['5 generări gratuite', 'Toate tipurile de conținut', 'Export PDF', 'Fără card de credit'].map(f => (
                <li key={f} style={{ fontSize: 14, color: '#9ca3af', marginBottom: 10, display: 'flex', gap: 8 }}>
                  <span style={{ color: '#8b5cf6' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/app" style={{
              display: 'block', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#d1d5db', textDecoration: 'none',
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            }}>
              Începe gratuit
            </Link>
          </div>

          {/* Premium — highlighted */}
          <div className="price-card" style={{
            background: 'linear-gradient(135deg, rgba(109,40,217,0.3), rgba(139,92,246,0.1))',
            border: '1px solid rgba(139,92,246,0.5)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px',
              borderRadius: 100, whiteSpace: 'nowrap',
            }}>
              ⭐ RECOMANDAT
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Premium</div>
            <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 4 }}>49.99 <span style={{ fontSize: 18, color: '#6b7280' }}>RON</span></div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>pe lună · 1.67 RON/zi</div>
            <ul style={{ listStyle: 'none', marginBottom: 32 }}>
              {['Generări nelimitate', 'Toate tipurile de conținut', 'Export PDF', 'Trimitere pe email', 'Suport prioritar'].map(f => (
                <li key={f} style={{ fontSize: 14, color: '#d1d5db', marginBottom: 10, display: 'flex', gap: 8 }}>
                  <span style={{ color: '#a78bfa' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="https://buy.stripe.com/bJeaEZ4Fod7jd6bdGj2Ry01" className="glow-btn" style={{
              display: 'block', textAlign: 'center',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: '#fff', textDecoration: 'none',
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            }}>
              Alege Premium
            </Link>
          </div>

          {/* Anual */}
          <div className="price-card" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Anual</span>
              <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>-17%</span>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 4 }}>499 <span style={{ fontSize: 18, color: '#6b7280' }}>RON</span></div>
            <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 28 }}>pe an · 41.58 RON/lună</div>
            <ul style={{ listStyle: 'none', marginBottom: 32 }}>
              {['Generări nelimitate', 'Toate tipurile de conținut', 'Export PDF', 'Trimitere pe email', 'Factură anuală', 'Suport prioritar'].map(f => (
                <li key={f} style={{ fontSize: 14, color: '#9ca3af', marginBottom: 10, display: 'flex', gap: 8 }}>
                  <span style={{ color: '#8b5cf6' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="https://buy.stripe.com/bJeaEZ4Fod7jd6bdGj2Ry01" style={{
              display: 'block', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#d1d5db', textDecoration: 'none',
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            }}>
              Alege anual
            </Link>
          </div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section style={{
        padding: '80px 24px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="mesh" style={{ width: 400, height: 400, background: 'rgba(109,40,217,0.2)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-title" style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Gata să scrii mai repede?
          </h2>
          <p style={{ color: '#6b7280', fontSize: 18, marginBottom: 36, fontWeight: 300 }}>
            Încearcă RedactAI gratuit. Fără card de credit.
          </p>
          <Link href="/app" className="glow-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: '#fff', textDecoration: 'none',
            padding: '16px 36px', borderRadius: 14, fontSize: 18, fontWeight: 700,
          }}>
            Generează primul tău articol →
          </Link>
        </div>
      </section>
    </main>
  );
}
