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

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
    const saved = localStorage.getItem('generationsLeft');
    if (saved) setGenerationsLeft(parseInt(saved));
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedSubscription = localStorage.getItem('hasSubscription');
    if (savedSubscription === 'true') setHasSubscription(true);
  }, []);

  const handleLogin = async () => {
    if (!email) {
      alert('Introdu un email');
      return;
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err) {
      alert('Eroare la login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleSubscribe = () => {
    window.location.href = 'https://buy.stripe.com/dRm8wR5JsaZbfejau72Ry00';
  };

  const exportToPDF = async () => {
    const element = document.getElementById('content-to-export');
    if (!element) return;
    
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf(element, {
      margin: 0.5,
      filename: `writeflow-${topic || 'articol'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    });
  };

  const handleSendEmail = async () => {
    if (!sendEmail) {
      alert('Introdu o adresă de email');
      return;
    }
    if (!output || output === 'Your generated content will appear here.' || output === 'A apărut o eroare.') {
      alert('Generează mai întâi un articol');
      return;
    }
    
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sendEmail,
          topic: topic,
          content: output
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Email trimis cu succes!');
        setSendEmail('');
      } else {
        alert('Eroare la trimitere');
      }
    } catch (err) {
      alert('Eroare la trimitere');
    }
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Am generat un articol cu WriteFlow: ${topic}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(topic);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiat în clipboard!');
  };

  const handleGenerate = async () => {
    if (!token && generationsLeft <= 0) {
      alert('Ai epuizat generările gratuite. Autentifică-te pentru mai multe!');
      return;
    }
    
    if (token && !hasSubscription && generationsLeft <= 0) {
      alert('Ai epuizat generările gratuite. Fă upgrade la Premium!');
      return;
    }

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
        const newEntry = {
          topic: topic,
          content: data.text,
          date: new Date().toLocaleString()
        };
        const newHistory = [newEntry, ...history];
        setHistory(newHistory);
        localStorage.setItem('history', JSON.stringify(newHistory));
      }
      
      if (!token || (token && !hasSubscription)) {
        const newCount = generationsLeft - 1;
        setGenerationsLeft(newCount);
        localStorage.setItem('generationsLeft', newCount.toString());
      }
    } catch (err) {
      setOutput('A apărut o eroare.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6" style={{ color: 'black' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'black' }}>WriteFlow</h1>
        <div className="flex items-center gap-4">
          {!token && (
            <span className="text-sm bg-yellow-100 px-3 py-1 rounded" style={{ color: 'black' }}>
              🎁 Generări gratuite: {generationsLeft}
            </span>
          )}
          {token && !hasSubscription && (
            <span className="text-sm bg-yellow-100 px-3 py-1 rounded" style={{ color: 'black' }}>
              🎁 Generări gratuite: {generationsLeft}
            </span>
          )}
          {token && hasSubscription && (
            <span className="text-sm bg-green-100 px-3 py-1 rounded" style={{ color: 'green' }}>
              ⭐ Premium - Nelimitat
            </span>
          )}
          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-green-600" style={{ color: 'green' }}>✅ Autentificat</span>
              <button
                onClick={handleSubscribe}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                💳 Abonament Premium - $9.99/lună
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Email pentru login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded p-2"
                style={{ color: 'black', backgroundColor: 'white' }}
              />
              <button
                onClick={handleLogin}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block font-medium" style={{ color: 'black' }}>Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full border rounded p-2"
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              <option>Blog Post</option>
              <option>Social Media Post</option>
              <option>Professional Email</option>
              <option>Product Description</option>
              <option>Ad Copy</option>
            </select>
          </div>
          <div>
            <label className="block font-medium" style={{ color: 'black' }}>Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The future of remote work"
              className="w-full border rounded p-2"
              style={{ color: 'black', backgroundColor: 'white' }}
            />
          </div>
          <div>
            <label className="block font-medium" style={{ color: 'black' }}>Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border rounded p-2"
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Enthusiastic</option>
            </select>
          </div>
          <div>
            <label className="block font-medium" style={{ color: 'black' }}>Additional Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="w-full border rounded p-2"
              style={{ color: 'black', backgroundColor: 'white' }}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || (!token && generationsLeft === 0) || (token && !hasSubscription && generationsLeft === 0) ? true : false}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700"
          >
            {loading ? 'Generare...' : 'Generează'}
          </button>
        </div>
        <div className="border rounded p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold" style={{ color: 'black' }}>Output</h2>
            {output && output !== 'Your generated content will appear here.' && output !== 'A apărut o eroare.' && (
              <button
                onClick={exportToPDF}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                📄 Export PDF
              </button>
            )}
          </div>
          <div id="content-to-export" className="whitespace-pre-wrap" style={{ color: 'black' }}>
            {output || 'Your generated content will appear here.'}
          </div>
          {output && output !== 'Your generated content will appear here.' && output !== 'A apărut o eroare.' && (
            <>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="Email pentru primire articol"
                  value={sendEmail}
                  onChange={(e) => setSendEmail(e.target.value)}
                  className="border rounded p-2 flex-1"
                  style={{ color: 'black', backgroundColor: 'white' }}
                />
                <button
                  onClick={handleSendEmail}
                  className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  ✉️ Trimite pe email
                </button>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={shareOnFacebook}
                  className="bg-blue-700 text-white px-3 py-2 rounded text-sm hover:bg-blue-800"
                >
                  📘 Facebook
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="bg-sky-500 text-white px-3 py-2 rounded text-sm hover:bg-sky-600"
                >
                  🐦 Twitter
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="bg-blue-800 text-white px-3 py-2 rounded text-sm hover:bg-blue-900"
                >
                  🔗 LinkedIn
                </button>
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                >
                  📋 Copiază link
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'black' }}>📜 Istoric generări</h2>
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="border rounded p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.topic}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                    <p className="text-gray-700 mt-2 line-clamp-2">{item.content.substring(0, 150)}...</p>
                  </div>
                  <button
                    onClick={() => setOutput(item.content)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 ml-4"
                  >
                    Vezi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}