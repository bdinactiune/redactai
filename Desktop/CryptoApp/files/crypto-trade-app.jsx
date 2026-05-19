import { useState, useEffect, useRef } from "react";

const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", color: "#F7931A", icon: "₿" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", color: "#627EEA", icon: "Ξ" },
  { id: "binancecoin", symbol: "BNB", name: "Binance", color: "#F3BA2F", icon: "B" },
  { id: "solana", symbol: "SOL", name: "Solana", color: "#9945FF", icon: "◎" },
  { id: "cardano", symbol: "ADA", name: "Cardano", color: "#0033AD", icon: "₳" },
  { id: "ripple", symbol: "XRP", name: "Ripple", color: "#346AA9", icon: "✕" },
];

const MOCK_PRICES = {
  bitcoin: 68420.5,
  ethereum: 3812.3,
  binancecoin: 598.7,
  solana: 182.4,
  cardano: 0.612,
  ripple: 0.587,
};

function generatePriceHistory(base, points = 30) {
  const history = [];
  let price = base * 0.85;
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.48) * 0.04);
    history.push(parseFloat(price.toFixed(2)));
  }
  history.push(base);
  return history;
}

function MiniChart({ data, color, up }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 40;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#g-${color.replace("#","")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatPrice(p) {
  if (p >= 1000) return "$" + p.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (p >= 1) return "$" + p.toFixed(3);
  return "$" + p.toFixed(4);
}

function formatUSD(v) {
  return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CryptoApp() {
  const [prices, setPrices] = useState(MOCK_PRICES);
  const [histories, setHistories] = useState({});
  const [portfolio, setPortfolio] = useState({
    bitcoin: 0.25,
    ethereum: 1.8,
    binancecoin: 5,
    solana: 12,
    cardano: 800,
    ripple: 1200,
  });
  const [tab, setTab] = useState("dashboard");
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [tradeType, setTradeType] = useState("buy");
  const [tradeAmount, setTradeAmount] = useState("");
  const [usdBalance, setUsdBalance] = useState(5000);
  const [trades, setTrades] = useState([]);
  const [botActive, setBotActive] = useState(false);
  const [botLog, setBotLog] = useState([]);
  const [notification, setNotification] = useState(null);
  const botRef = useRef(null);

  useEffect(() => {
    const h = {};
    COINS.forEach(c => { h[c.id] = generatePriceHistory(MOCK_PRICES[c.id]); });
    setHistories(h);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = {};
        COINS.forEach(c => {
          next[c.id] = parseFloat((prev[c.id] * (1 + (Math.random() - 0.5) * 0.006)).toFixed(6));
        });
        return next;
      });
      setHistories(prev => {
        const next = { ...prev };
        COINS.forEach(c => {
          if (next[c.id]) {
            const arr = [...next[c.id]];
            arr.shift();
            arr.push(prices[c.id]);
            next[c.id] = arr;
          }
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [prices]);

  useEffect(() => {
    if (botActive) {
      botRef.current = setInterval(() => {
        COINS.forEach(coin => {
          const hist = histories[coin.id];
          if (!hist || hist.length < 5) return;
          const recent = hist.slice(-5);
          const trend = recent[recent.length - 1] - recent[0];
          if (Math.random() < 0.3) {
            const action = trend > 0 ? "buy" : "sell";
            const qty = parseFloat((Math.random() * 0.01 + 0.001).toFixed(4));
            const price = prices[coin.id];
            const cost = qty * price;
            setBotLog(prev => [
              { time: new Date().toLocaleTimeString(), coin: coin.symbol, action, qty, price, cost },
              ...prev.slice(0, 19)
            ]);
          }
        });
      }, 3000);
    } else {
      clearInterval(botRef.current);
    }
    return () => clearInterval(botRef.current);
  }, [botActive, histories, prices]);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const totalPortfolioValue = COINS.reduce((sum, c) => sum + (portfolio[c.id] || 0) * (prices[c.id] || 0), 0);

  const handleTrade = () => {
    const amt = parseFloat(tradeAmount);
    if (!amt || amt <= 0) return showNotif("Introdu o sumă validă!", "error");
    const price = prices[selectedCoin];
    const cost = amt * price;
    if (tradeType === "buy") {
      if (cost > usdBalance) return showNotif("Fonduri insuficiente!", "error");
      setUsdBalance(b => b - cost);
      setPortfolio(p => ({ ...p, [selectedCoin]: (p[selectedCoin] || 0) + amt }));
      setTrades(t => [{ id: Date.now(), type: "buy", coin: selectedCoin, qty: amt, price, cost, time: new Date().toLocaleTimeString() }, ...t.slice(0, 29)]);
      showNotif(`✅ Cumpărat ${amt} ${COINS.find(c => c.id === selectedCoin)?.symbol}`);
    } else {
      if ((portfolio[selectedCoin] || 0) < amt) return showNotif("Nu ai suficient!", "error");
      setUsdBalance(b => b + cost);
      setPortfolio(p => ({ ...p, [selectedCoin]: p[selectedCoin] - amt }));
      setTrades(t => [{ id: Date.now(), type: "sell", coin: selectedCoin, qty: amt, price, cost, time: new Date().toLocaleTimeString() }, ...t.slice(0, 29)]);
      showNotif(`✅ Vândut ${amt} ${COINS.find(c => c.id === selectedCoin)?.symbol}`);
    }
    setTradeAmount("");
  };

  const coin = COINS.find(c => c.id === selectedCoin);
  const priceChange = histories[selectedCoin]
    ? ((prices[selectedCoin] - histories[selectedCoin][0]) / histories[selectedCoin][0] * 100).toFixed(2)
    : "0.00";
  const isUp = parseFloat(priceChange) >= 0;

  return (
    <div style={{
      fontFamily: "'Space Mono', 'Courier New', monospace",
      background: "#090E1A",
      minHeight: "100vh",
      color: "#E0E6FF",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0D1325; }
        ::-webkit-scrollbar-thumb { background: #2A3560; border-radius: 2px; }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; padding: 10px 20px; border-radius: 8px; transition: all 0.2s; }
        .tab-btn.active { background: #1A2240; color: #7AA2FF; }
        .tab-btn:not(.active) { color: #4A5580; }
        .tab-btn:hover:not(.active) { color: #8899CC; }
        .coin-row { cursor: pointer; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 14px; transition: background 0.15s; }
        .coin-row:hover { background: #131E36; }
        .coin-row.active { background: #1A2850; }
        .trade-btn { border: none; cursor: pointer; border-radius: 10px; padding: 14px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 0.05em; transition: all 0.15s; width: 100%; }
        .trade-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .trade-btn:active { transform: translateY(0); }
        .type-btn { flex: 1; border: none; cursor: pointer; padding: 10px; border-radius: 8px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; transition: all 0.2s; }
        .notif { position: fixed; top: 24px; right: 24px; z-index: 999; padding: 14px 22px; border-radius: 12px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        input[type=number] { -moz-appearance: textfield; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* BG grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(42,53,96,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(42,53,96,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(122,162,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(153,69,255,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      {notification && (
        <div className="notif" style={{ background: notification.type === "error" ? "#3D1A1A" : "#1A3D2A", color: notification.type === "error" ? "#FF7A7A" : "#7AFFC0", border: `1px solid ${notification.type === "error" ? "#7A2A2A" : "#2A7A5A"}` }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ position: "relative", zIndex: 10, borderBottom: "1px solid #1A2240", background: "rgba(9,14,26,0.95)", backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3A6AFF, #9945FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>◈</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.05em", color: "#E8EDFF" }}>CRYPTEX</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["dashboard", "trade", "portfolio", "bot"].map(t => (
              <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "dashboard" ? "📊 Dashboard" : t === "trade" ? "⚡ Trade" : t === "portfolio" ? "💼 Portofoliu" : "🤖 Bot"}
              </button>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#4A5580", letterSpacing: "0.1em" }}>SOLD USD</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#7AFFC0" }}>{formatUSD(usdBalance)}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "VALOARE PORTOFOLIU", value: formatUSD(totalPortfolioValue + usdBalance), color: "#7AA2FF", icon: "◈" },
                { label: "CRYPTO ASSETS", value: formatUSD(totalPortfolioValue), color: "#9945FF", icon: "⬡" },
                { label: "CASH DISPONIBIL", value: formatUSD(usdBalance), color: "#7AFFC0", icon: "$" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, padding: "22px 24px" }}>
                  <div style={{ fontSize: 11, color: "#4A5580", letterSpacing: "0.12em", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {COINS.map(c => {
                const hist = histories[c.id] || [];
                const change = hist.length ? ((prices[c.id] - hist[0]) / hist[0] * 100).toFixed(2) : "0.00";
                const up = parseFloat(change) >= 0;
                return (
                  <div key={c.id} onClick={() => { setSelectedCoin(c.id); setTab("trade"); }}
                    style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, padding: "18px 20px", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1A2240"; e.currentTarget.style.transform = ""; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: c.color + "22", border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: c.color }}>{c.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: "#4A5580" }}>{c.symbol}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      {hist.length > 0 && <MiniChart data={hist} color={c.color} up={up} />}
                      <div style={{ textAlign: "right", minWidth: 80 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{formatPrice(prices[c.id])}</div>
                        <div style={{ fontSize: 12, color: up ? "#7AFFC0" : "#FF7A7A" }}>{up ? "▲" : "▼"} {Math.abs(change)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRADE */}
        {tab === "trade" && (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
            <div style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, padding: "16px 12px" }}>
              <div style={{ fontSize: 11, color: "#4A5580", letterSpacing: "0.12em", marginBottom: 14, paddingLeft: 6 }}>MONEDE</div>
              {COINS.map(c => {
                const hist = histories[c.id] || [];
                const change = hist.length ? ((prices[c.id] - hist[0]) / hist[0] * 100).toFixed(2) : "0.00";
                const up = parseFloat(change) >= 0;
                return (
                  <div key={c.id} className={`coin-row ${selectedCoin === c.id ? "active" : ""}`} onClick={() => setSelectedCoin(c.id)}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: c.color }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>{c.symbol}</div>
                      <div style={{ fontSize: 11, color: up ? "#7AFFC0" : "#FF7A7A" }}>{up ? "▲" : "▼"} {Math.abs(change)}%</div>
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>{formatPrice(prices[c.id])}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Price card */}
              <div style={{ background: "#0D1325", border: `1px solid ${coin?.color}33`, borderRadius: 16, padding: "24px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: coin?.color + "22", border: `1px solid ${coin?.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: coin?.color }}>{coin?.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>{coin?.name}</div>
                        <div style={{ fontSize: 12, color: "#4A5580" }}>{coin?.symbol}/USD</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: "#E8EDFF" }}>{formatPrice(prices[selectedCoin])}</div>
                    <div style={{ fontSize: 14, color: isUp ? "#7AFFC0" : "#FF7A7A", marginTop: 4 }}>{isUp ? "▲" : "▼"} {Math.abs(priceChange)}% (30 puncte)</div>
                  </div>
                  {histories[selectedCoin] && (
                    <svg width={200} height={70} style={{ overflow: "visible" }}>
                      {(() => {
                        const data = histories[selectedCoin];
                        const max = Math.max(...data), min = Math.min(...data);
                        const range = max - min || 1;
                        const pts = data.map((v, i) => `${(i / (data.length - 1)) * 200},${70 - ((v - min) / range) * 70}`).join(" ");
                        return <>
                          <defs><linearGradient id="biggrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={coin?.color} stopOpacity="0.25" /><stop offset="100%" stopColor={coin?.color} stopOpacity="0" /></linearGradient></defs>
                          <polygon points={`0,70 ${pts} 200,70`} fill="url(#biggrad)" />
                          <polyline points={pts} fill="none" stroke={coin?.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </>;
                      })()}
                    </svg>
                  )}
                </div>
              </div>

              {/* Trade panel */}
              <div style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, padding: "24px 28px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  {["buy", "sell"].map(t => (
                    <button key={t} className="type-btn" onClick={() => setTradeType(t)}
                      style={{ background: tradeType === t ? (t === "buy" ? "#1A3D2A" : "#3D1A1A") : "#131E36", color: tradeType === t ? (t === "buy" ? "#7AFFC0" : "#FF7A7A") : "#4A5580", border: `1px solid ${tradeType === t ? (t === "buy" ? "#2A7A5A" : "#7A2A2A") : "#1A2240"}` }}>
                      {t === "buy" ? "▲ CUMPĂRĂ" : "▼ VINDE"}
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#4A5580", letterSpacing: "0.1em", marginBottom: 8 }}>CANTITATE ({coin?.symbol})</div>
                  <input type="number" value={tradeAmount} onChange={e => setTradeAmount(e.target.value)}
                    placeholder="0.00"
                    style={{ width: "100%", background: "#131E36", border: "1px solid #1A2240", borderRadius: 10, padding: "14px 16px", color: "#E8EDFF", fontFamily: "'Space Mono', monospace", fontSize: 18, outline: "none" }} />
                </div>
                {tradeAmount && parseFloat(tradeAmount) > 0 && (
                  <div style={{ background: "#131E36", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#4A5580" }}>Total</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#E8EDFF" }}>{formatUSD(parseFloat(tradeAmount) * prices[selectedCoin])}</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {[0.25, 0.5, 0.75, 1].map(frac => (
                    <button key={frac} onClick={() => {
                      if (tradeType === "buy") setTradeAmount(((usdBalance * frac) / prices[selectedCoin]).toFixed(6));
                      else setTradeAmount(((portfolio[selectedCoin] || 0) * frac).toFixed(6));
                    }} style={{ flex: 1, background: "#131E36", border: "1px solid #1A2240", borderRadius: 8, padding: "7px", color: "#7AA2FF", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12 }}>
                      {frac * 100}%
                    </button>
                  ))}
                </div>
                <button className="trade-btn" onClick={handleTrade}
                  style={{ background: tradeType === "buy" ? "linear-gradient(135deg, #1A7A4A, #2AFF8A22)" : "linear-gradient(135deg, #7A1A1A, #FF2A2A22)", color: tradeType === "buy" ? "#7AFFC0" : "#FF7A7A", border: `1px solid ${tradeType === "buy" ? "#2A7A5A" : "#7A2A2A"}` }}>
                  {tradeType === "buy" ? `▲ CUMPĂRĂ ${coin?.symbol}` : `▼ VINDE ${coin?.symbol}`}
                </button>
                <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4A5580" }}>
                  <span>Deții: {(portfolio[selectedCoin] || 0).toFixed(6)} {coin?.symbol}</span>
                  <span>Cash: {formatUSD(usdBalance)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PORTFOLIO */}
        {tab === "portfolio" && (
          <div>
            <div style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, padding: "28px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#4A5580", letterSpacing: "0.12em", marginBottom: 8 }}>VALOARE TOTALĂ</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 40, color: "#7AA2FF", marginBottom: 4 }}>{formatUSD(totalPortfolioValue + usdBalance)}</div>
              <div style={{ fontSize: 13, color: "#4A5580" }}>Crypto: {formatUSD(totalPortfolioValue)} · Cash: {formatUSD(usdBalance)}</div>
            </div>
            <div style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #1A2240", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#7AA2FF", letterSpacing: "0.08em" }}>ACTIVE CRYPTO</div>
              {COINS.map((c, i) => {
                const qty = portfolio[c.id] || 0;
                const val = qty * prices[c.id];
                const pct = totalPortfolioValue > 0 ? (val / totalPortfolioValue * 100).toFixed(1) : "0.0";
                if (qty === 0) return null;
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: i < COINS.length - 1 ? "1px solid #0D1325" : "none", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: c.color }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#4A5580" }}>{qty.toFixed(6)} {c.symbol}</div>
                    </div>
                    <div style={{ width: 120 }}>
                      <div style={{ height: 4, background: "#1A2240", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#4A5580", marginTop: 4, textAlign: "right" }}>{pct}%</div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 100 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{formatUSD(val)}</div>
                      <div style={{ fontSize: 12, color: "#4A5580" }}>{formatPrice(prices[c.id])}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {trades.length > 0 && (
              <div style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #1A2240", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#7AA2FF", letterSpacing: "0.08em" }}>ISTORIC TRANZACȚII</div>
                {trades.slice(0, 10).map(t => {
                  const c = COINS.find(x => x.id === t.coin);
                  return (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", padding: "13px 24px", borderBottom: "1px solid #0D1325", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: t.type === "buy" ? "#1A3D2A" : "#3D1A1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{t.type === "buy" ? "▲" : "▼"}</div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: t.type === "buy" ? "#7AFFC0" : "#FF7A7A" }}>{t.type === "buy" ? "CUMPĂRAT" : "VÂNDUT"}</span>
                        <span style={{ fontSize: 12, color: "#4A5580", marginLeft: 8 }}>{t.qty} {c?.symbol}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>{formatUSD(t.cost)}</div>
                        <div style={{ fontSize: 11, color: "#4A5580" }}>{t.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BOT */}
        {tab === "bot" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ background: "#0D1325", border: `1px solid ${botActive ? "#2A7A5A" : "#1A2240"}`, borderRadius: 16, padding: "28px", marginBottom: 16, transition: "border-color 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>🤖 Trading Bot</div>
                    <div style={{ fontSize: 13, color: "#4A5580", marginTop: 4 }}>Analiză trend automat</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {botActive && <div className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#7AFFC0" }} />}
                    <span style={{ fontSize: 13, color: botActive ? "#7AFFC0" : "#4A5580", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{botActive ? "ACTIV" : "OPRIT"}</span>
                  </div>
                </div>
                <button onClick={() => setBotActive(b => !b)}
                  style={{ width: "100%", border: "none", borderRadius: 12, padding: "16px", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "0.05em", background: botActive ? "linear-gradient(135deg, #7A1A1A, #FF2A2A22)" : "linear-gradient(135deg, #1A4A7A, #2A7AFF22)", color: botActive ? "#FF7A7A" : "#7AA2FF", border: `1px solid ${botActive ? "#7A2A2A" : "#2A5A7A"}`, transition: "all 0.2s" }}>
                  {botActive ? "⏹ OPREȘTE BOTUL" : "▶ PORNEȘTE BOTUL"}
                </button>
              </div>
              <div style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#7AA2FF", letterSpacing: "0.08em", marginBottom: 16 }}>STRATEGIE</div>
                {[
                  { label: "Strategie", value: "Trend Following" },
                  { label: "Interval analiză", value: "5 secunde" },
                  { label: "Monede active", value: "BTC, ETH, BNB, SOL, ADA, XRP" },
                  { label: "Risc per trade", value: "0.1 – 1%" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #0D1325" }}>
                    <span style={{ fontSize: 13, color: "#4A5580" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#0D1325", border: "1px solid #1A2240", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #1A2240", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#7AA2FF", letterSpacing: "0.08em" }}>LOG BOT</div>
                {botActive && <div className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#7AFFC0" }} />}
              </div>
              <div style={{ padding: "12px", height: 420, overflowY: "auto" }}>
                {botLog.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#4A5580", marginTop: 60, fontSize: 13 }}>
                    {botActive ? "Analizez piața..." : "Pornește botul pentru a vedea activitate"}
                  </div>
                ) : botLog.map((l, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "8px 8px", borderRadius: 8, marginBottom: 4, background: "#131E36" }}>
                    <span style={{ color: l.action === "buy" ? "#7AFFC0" : "#FF7A7A", fontWeight: 700, fontSize: 11 }}>{l.action === "buy" ? "▲" : "▼"}</span>
                    <span style={{ fontSize: 11, color: "#7AA2FF", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{l.coin}</span>
                    <span style={{ fontSize: 11, color: "#E0E6FF" }}>{l.action === "buy" ? "cumpărat" : "vândut"} {l.qty}</span>
                    <span style={{ fontSize: 11, color: "#4A5580", marginLeft: "auto" }}>{l.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
