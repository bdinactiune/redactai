'use client';

import { useState, useEffect } from 'react';

export default function EnglishHome() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [contentType, setContentType] = useState('Blog Post');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [instructions, setInstructions] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(10);
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
    if (!email) { alert('Please enter an email'); return; }
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
      alert('Login error');
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
      filename: `redactai-${topic || 'article'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    });
  };

  const handleSendEmail = async () => {
    if (!sendEmail) { alert('Please enter an email address'); return; }
    if (!output || output === 'An error occurred.') { alert('Please generate an article first'); return; }
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sendEmail, topic, content: output }),
      });
      const data = await res.json();
      if (data.success) { alert('Email sent successfully!'); setSendEmail(''); }
      else alert('Error sending email');
    } catch { alert('Error sending email'); }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I generated an article with RedactAI: ${topic}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(topic)}`, '_blank');
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Content copied!');
  };

  const convertMarkdown = (text: string): string => {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (const line of lines) {
      if (/^## (.+)/.test(line)) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 style="font-size:17px;font-weight:700;margin:20px 0 8px;color:#1a1a1a;">${line.replace(/^## /, '')}</h2>`;
      } else if (/^# (.+)/.test(line)) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h1 style="font-size:20px;font-weight:800;margin:24px 0 10px;color:#1a1a1a;">${line.replace(/^# /, '')}</h1>`;
      } else if (/^- (.+)/.test(line)) {
        if (!inList) { html += '<ul style="margin:8px 0 8px 20px;list-style:disc;">'; inList = true; }
        html += `<li style="margin:6px 0;">${line.replace(/^- /, '')}</li>`;
      } else if (/^\* (.+)/.test(line)) {
        if (!inList) { html += '<ul style="margin:8px 0 8px 20px;list-style:disc;">'; inList = true; }
        html += `<li style="margin:6px 0;">${line.replace(/^\* /, '')}</li>`;
      } else if (line.trim() === '') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<br/>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p style="margin:6px 0;">${line}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ contentType, topic, tone, instructions, language: 'en' }),
      });
      const data = await res.json();
      if (typeof data.remaining === 'number') {
        setGenerationsLeft(data.remaining);
        localStorage.setItem('generationsLeft', data.remaining.toString());
      }
      if (!res.ok) {
        setOutput(data.error || 'An error occurred.');
        setLoading(false);
        return;
      }
      setOutput(data.text || 'Error');
      if (data.text && data.text !== 'Error') {
        const newEntry = { topic, content: data.text, date: new Date().toLocaleString() };
        const newHistory = [newEntry, ...history];
        setHistory(newHistory);
        localStorage.setItem('history', JSON.stringify(newHistory));
      }
    } catch { setOutput('An error occurred.'); }
    finally { setLoading(false); }
  };

  const tones = ['Professional', 'Casual', 'Enthusiastic'];
  const contentTypes = ['Blog Post', 'Social Media Post', 'Professional Email', 'Product Description', 'Ad Copy'];

  const hasOutput = output && output !== 'An error occurred.';
  const isLoggedIn = !!token;
  const isDisabled = !!(loading || (!token && generationsLeft === 0) || (token && !hasSubscription && generationsLeft === 0));

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', backgroundColor: '#f8f8f8', color: '#1a1a1a' }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #ebebeb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <a href="/en" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>A</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a' }}>RedactAI</span>
            </a>
            {!isLoggedIn ? (
              <button onClick={() => setShowLoginModal(true)} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Sign in
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {hasSubscription ? (
                  <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>Premium</span>
                ) : (
                  <span style={{ fontSize: 11, background: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: 20, fontWeight: 500 }}>{generationsLeft} left</span>
                )}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowUserMenu(!showUserMenu)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                    Account ▾
                  </button>
                  {showUserMenu && (
                    <div style={{ position: 'absolute', right: 0, top: 35, background: '#fff', border: '1px solid #ebebeb', borderRadius: 10, padding: 8, minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', zIndex: 100 }}>
                      {!hasSubscription && (
                        <button onClick={handleSubscribe} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#7C3AED', background: '#EDE9FE', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 4 }}>
                          Upgrade to Premium
                        </button>
                      )}
                      <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#666', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: '10px', flexWrap: 'wrap' }}>
            <a href="/pricing" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
            <a href="/blog" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Blog</a>
            <div style={{ display: 'flex', gap: 6, fontSize: 13 }}>
              <a href="/" style={{ color: '#aaa', textDecoration: 'none' }}>RO</a>
              <span style={{ color: '#ccc' }}>/</span>
              <a href="/en" style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>EN</a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb', padding: '48px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.2 }}>
          Generate quality content<br />
          <span style={{ color: '#7C3AED' }}>in seconds</span>
        </h1>
        <p style={{ fontSize: 16, color: '#666', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          Blog posts, social media content, emails and more — with the power of artificial intelligence.
        </p>
        {!isLoggedIn && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 20, padding: '8px 18px' }}>
            <span style={{ fontSize: 16 }}>🎁</span>
            <span style={{ fontSize: 14, color: '#6D28D9', fontWeight: 500 }}>{generationsLeft} free generations available</span>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — Form */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#1a1a1a' }}>Configure your content</h2>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Content Type</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', backgroundColor: '#fff', appearance: 'none', cursor: 'pointer' }}>
                {contentTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topic</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What do you want to write about?" style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', backgroundColor: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tone</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tones.map(t => (
                  <button key={t} onClick={() => setTone(t)} style={{ padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: tone === t ? '#7C3AED' : '#f3f4f6', color: tone === t ? '#fff' : '#555', transition: 'all 0.15s' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Additional Instructions</label>
              <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Any extra details..." style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', backgroundColor: '#fff', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleGenerate} disabled={isDisabled} style={{ width: '100%', background: loading ? '#a78bfa' : '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}>
              {loading ? 'Generating...' : 'Generate content'}
            </button>
          </div>

          {/* RIGHT — Output */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Output</h2>
              {hasOutput && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={copyToClipboard} style={{ fontSize: 12, padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: 7, background: '#fff', color: '#555', cursor: 'pointer', fontWeight: 500 }}>Copy</button>
                  <button onClick={exportToPDF} style={{ fontSize: 12, padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: 7, background: '#fff', color: '#555', cursor: 'pointer', fontWeight: 500 }}>Export PDF</button>
                </div>
              )}
            </div>
            <div
              id="content-to-export"
              style={{ flex: 1, background: '#fafafa', borderRadius: 10, padding: 16, minHeight: 200, fontSize: 14, lineHeight: 1.7, color: hasOutput ? '#1a1a1a' : '#aaa', overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: hasOutput ? convertMarkdown(output) : 'Generated content will appear here.' }}
            />
            {hasOutput && (
              <>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <input type="email" placeholder="Send to email..." value={sendEmail} onChange={(e) => setSendEmail(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm" />
                  <button onClick={handleSendEmail} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">Send</button>
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
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1a1a1a' }}>Generation History</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {history.map((item, index) => (
                <div key={index} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '16px 20px' }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.topic}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.content.substring(0, 120)}...</p>
                    </div>
                    <button onClick={() => setOutput(item.content)} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200 transition">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div onClick={() => setShowLoginModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '0 16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a' }}>Sign in</h2>
            <p style={{ fontSize: 14, color: '#888', margin: '0 0 24px' }}>Sign in to access more generations.</p>
            <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#1a1a1a', boxSizing: 'border-box', marginBottom: 12 }} />
            <button onClick={handleLogin} style={{ width: '100%', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Continue</button>
            <button onClick={() => setShowLoginModal(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: 12, fontSize: 13, color: '#aaa', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
