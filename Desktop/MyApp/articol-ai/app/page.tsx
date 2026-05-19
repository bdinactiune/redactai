'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [contentType, setContentType] = useState('Blog Post');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [instructions, setInstructions] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(5);
  const [history, setHistory] = useState<Array<{topic: string, content: string, date: string}>>([]);
  const [sendEmail, setSendEmail] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
    
    if (savedToken === 'bdinactiune@gmail.com') {
      setGenerationsLeft(999);
      localStorage.setItem('generationsLeft', '999');
    } else {
      const saved = localStorage.getItem('generationsLeft');
      if (saved) setGenerationsLeft(parseInt(saved));
    }
    
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedSubscription = localStorage.getItem('hasSubscription');
    if (savedSubscription === 'true') setHasSubscription(true);
  }, []);

  const handleLogin = async () => {
    if (!email) { alert('Introdu un email'); return; }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setShowLoginModal(false);
      
      if (email === 'bdinactiune@gmail.com') {
        setGenerationsLeft(999);
        localStorage.setItem('generationsLeft', '999');
      }
    } catch {
      alert('Eroare la login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setShowUserMenu(false);
  };

  const handleSubscribe = () => {
    window.location.href = 'https://buy.stripe.com/bJeaEZ4Fod7jd6bdGj2Ry01';
  };

  const exportToPDF = async () => {
    const element = document.getElementById('content-to-export');
    if (!element) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf(element, {
      margin: 0.5,
      filename: `redactai-${topic || 'continut'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    });
  };

  const handleSendEmail = async () => {
    if (!sendEmail) { alert('Introdu o adresă de email'); return; }
    if (!output || output === 'A apărut o eroare.') { alert('Generează mai întâi un articol'); return; }
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sendEmail, topic, content: output }),
      });
      const data = await res.json();
      if (data.success) { alert('Email trimis cu succes!'); setSendEmail(''); }
      else alert('Eroare la trimitere');
    } catch { alert('Eroare la trimitere'); }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Am generat un articol cu RedactAI: ${topic}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(topic)}`, '_blank');
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Conținut copiat!');
  };

  const handleGenerate = async () => {
    if (!token && generationsLeft <= 0) { alert('Ai epuizat generările gratuite. Autentifică-te pentru mai multe!'); return; }
    if (token && !hasSubscription && generationsLeft <= 0) { alert('Ai epuizat generările gratuite. Fă upgrade la Premium!'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, topic, tone, instructions }),
      });
      const data = await res.json();
      setOutput(data.text || 'Eroare');
      if (data.text && data.text !== 'Eroare') {
        const newEntry = { topic, content: data.text, date: new Date().toLocaleString() };
        const newHistory = [newEntry, ...history];
        setHistory(newHistory);
        localStorage.setItem('history', JSON.stringify(newHistory));
      }
      
      if (token !== 'bdinactiune@gmail.com' && (!token || (token && !hasSubscription))) {
        const newCount = generationsLeft - 1;
        setGenerationsLeft(newCount);
        localStorage.setItem('generationsLeft', newCount.toString());
      }
    } catch { setOutput('A apărut o eroare.'); }
    finally { setLoading(false); }
  };

  const tones = ['Professional', 'Casual', 'Enthusiastic'];
  const toneLabels: Record<string, string> = { Professional: 'Profesional', Casual: 'Casual', Enthusiastic: 'Entuziast' };
  const contentTypes = ['Blog Post', 'Social Media Post', 'Professional Email', 'Product Description', 'Ad Copy'];
  const contentTypeLabels: Record<string, string> = {
    'Blog Post': 'Articol de blog',
    'Social Media Post': 'Postare social media',
    'Professional Email': 'Email profesional',
    'Product Description': 'Descriere produs',
    'Ad Copy': 'Text publicitar',
  };

  const hasOutput = output && output !== 'A apărut o eroare.';
  const isLoggedIn = !!token;
  const isDisabled = !!(loading || (!token && generationsLeft === 0) || (token && !hasSubscription && generationsLeft === 0));

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', backgroundColor: '#f8f8f8', color: '#1a1a1a' }}>

      {/* NAVBAR - Responsive */}
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #ebebeb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px' }}>
          
          {/* Rândul 1: Logo + butoane principale */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            
            {/* Logo */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>A</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a' }}>RedactAI</span>
            </a>

            {/* Buton login / cont */}
            {!isLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Intră în cont
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {hasSubscription ? (
                  <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                    Premium
                  </span>
                ) : (
                  <span style={{ fontSize: 11, background: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: 20, fontWeight: 500 }}>
                    {generationsLeft} gen.
                  </span>
                )}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                  >
                    Cont ▾
                  </button>
                  {showUserMenu && (
                    <div style={{ position: 'absolute', right: 0, top: 35, background: '#fff', border: '1px solid #ebebeb', borderRadius: 10, padding: 8, minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', zIndex: 100 }}>
                      {!hasSubscription && (
                        <button
                          onClick={handleSubscribe}
                          style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#7C3AED', background: '#EDE9FE', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 4 }}
                        >
                          Upgrade la Premium
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#666', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                      >
                        Deconectare
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rândul 2: Link-uri navigare (Prețuri, Blog, Limbă) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: '10px', flexWrap: 'wrap' }}>
            <a href="/pricing" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Prețuri</a>
            <a href="/blog" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Blog</a>
            <div style={{ display: 'flex', gap: 6, fontSize: 13 }}>
              <a href="/" style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>RO</a>
              <span style={{ color: '#ccc' }}>/</span>
              <a href="/en" style={{ color: '#aaa', textDecoration: 'none' }}>EN</a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb', padding: '48px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.2 }}>
          Generează conținut de calitate<br />
          <span style={{ color: '#7C3AED' }}>în câteva secunde</span>
        </h1>
        <p style={{ fontSize: 16, color: '#666', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          Articole de blog, postări social media, emailuri și mai mult — cu ajutorul inteligenței artificiale.
        </p>
        {!isLoggedIn && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 20, padding: '8px 18px' }}>
            <span style={{ fontSize: 16 }}>🎁</span>
            <span style={{ fontSize: 14, color: '#6D28D9', fontWeight: 500 }}>{generationsLeft} generări gratuite disponibile</span>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — Form */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#1a1a1a' }}>Configurează conținutul</h2>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tip conținut</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', backgroundColor: '#fff', appearance: 'none', cursor: 'pointer' }}
              >
                {contentTypes.map(t => <option key={t} value={t}>{contentTypeLabels[t]}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subiect</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Despre ce vrei să scrii?"
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', backgroundColor: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ton</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tones.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    style={{
                      padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
                      background: tone === t ? '#7C3AED' : '#f3f4f6',
                      color: tone === t ? '#fff' : '#555',
                      transition: 'all 0.15s'
                    }}
                  >
                    {toneLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instrucțiuni suplimentare</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="Orice detalii suplimentare..."
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', backgroundColor: '#fff', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isDisabled}
              style={{
                width: '100%', background: loading ? '#a78bfa' : '#7C3AED', color: '#fff', border: 'none',
                borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s'
              }}
            >
              {loading ? 'Se generează...' : 'Generează conținut'}
            </button>
          </div>

          {/* RIGHT — Output */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Rezultat</h2>
              {hasOutput && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={copyToClipboard} style={{ fontSize: 12, padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: 7, background: '#fff', color: '#555', cursor: 'pointer', fontWeight: 500 }}>
                    Copiază
                  </button>
                  <button onClick={exportToPDF} style={{ fontSize: 12, padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: 7, background: '#fff', color: '#555', cursor: 'pointer', fontWeight: 500 }}>
                    Export PDF
                  </button>
                </div>
              )}
            </div>

            <div
              id="content-to-export"
              style={{
                flex: 1, background: '#fafafa', borderRadius: 10, padding: 16, minHeight: 200,
                fontSize: 14, lineHeight: 1.7, color: hasOutput ? '#1a1a1a' : '#aaa',
                whiteSpace: 'pre-wrap', overflowY: 'auto'
              }}
            >
              {output || 'Conținutul generat va apărea aici.'}
            </div>

            {hasOutput && (
              <>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <input
                    type="email"
                    placeholder="Trimite pe email..."
                    value={sendEmail}
                    onChange={(e) => setSendEmail(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                  />
                  <button onClick={handleSendEmail} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
                    Trimite
                  </button>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={shareOnFacebook} style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', fontSize: 12, color: '#1877F2', fontWeight: 600, cursor: 'pointer' }}>Facebook</button>
                  <button onClick={shareOnTwitter} style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', fontSize: 12, color: '#0EA5E9', fontWeight: 600, cursor: 'pointer' }}>Twitter</button>
                  <button onClick={shareOnLinkedIn} style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', fontSize: 12, color: '#0A66C2', fontWeight: 600, cursor: 'pointer' }}>LinkedIn</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* HISTORY */}
        {history.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1a1a1a' }}>Istoric generări</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {history.map((item, index) => (
                <div key={index} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '16px 20px' }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.topic}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.content.substring(0, 120)}...</p>
                    </div>
                    <button
                      onClick={() => setOutput(item.content)}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200 transition"
                    >
                      Vezi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div
          onClick={() => setShowLoginModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '0 16px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a' }}>Intră în cont</h2>
            <p style={{ fontSize: 14, color: '#888', margin: '0 0 24px' }}>Autentifică-te pentru a accesa mai multe generări.</p>
            <input
              type="email"
              placeholder="adresa@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#1a1a1a', boxSizing: 'border-box', marginBottom: 12 }}
            />
            <button
              onClick={handleLogin}
              style={{ width: '100%', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Continuă
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{ width: '100%', background: 'none', border: 'none', marginTop: 12, fontSize: 13, color: '#aaa', cursor: 'pointer' }}
            >
              Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}