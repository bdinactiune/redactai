import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Animated, Dimensions, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';

const { width: SCREEN_W } = Dimensions.get('window');

const COINS = [
  { id: 'bitcoin',      symbol: 'BTC', name: 'Bitcoin',  color: '#F7931A', icon: '₿' },
  { id: 'ethereum',     symbol: 'ETH', name: 'Ethereum', color: '#627EEA', icon: 'Ξ' },
  { id: 'binancecoin',  symbol: 'BNB', name: 'Binance',  color: '#F3BA2F', icon: 'B' },
  { id: 'solana',       symbol: 'SOL', name: 'Solana',   color: '#9945FF', icon: '◎' },
  { id: 'cardano',      symbol: 'ADA', name: 'Cardano',  color: '#0D9BDA', icon: '₳' },
  { id: 'ripple',       symbol: 'XRP', name: 'Ripple',   color: '#346AA9', icon: '✕' },
];

const BASE_PRICES = {
  bitcoin: 68420.5, ethereum: 3812.3, binancecoin: 598.7,
  solana: 182.4, cardano: 0.612, ripple: 0.587,
};

function genHistory(base, n = 20) {
  let p = base * 0.88;
  const arr = [];
  for (let i = 0; i < n; i++) {
    p *= 1 + (Math.random() - 0.48) * 0.04;
    arr.push(parseFloat(p.toFixed(6)));
  }
  arr.push(base);
  return arr;
}

function fmtPrice(p) {
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (p >= 1)    return '$' + p.toFixed(3);
  return '$' + p.toFixed(4);
}
function fmtUSD(v) {
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Mini SVG-style chart using Views
function MiniChart({ data, color }) {
  if (!data || data.length < 2) return null;
  const W = 80, H = 32;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H,
  }));
  return (
    <View style={{ width: W, height: H }}>
      {pts.slice(0, -1).map((pt, i) => {
        const next = pts[i + 1];
        const dx = next.x - pt.x;
        const dy = next.y - pt.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <View key={i} style={{
            position: 'absolute',
            left: pt.x,
            top: pt.y - 1,
            width: len,
            height: 2,
            backgroundColor: color,
            borderRadius: 1,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: '0 50%',
          }} />
        );
      })}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ SpaceMono_400Regular, SpaceMono_700Bold });

  const [tab, setTab] = useState('dashboard');
  const [prices, setPrices] = useState({ ...BASE_PRICES });
  const [histories, setHistories] = useState(() => {
    const h = {};
    COINS.forEach(c => { h[c.id] = genHistory(BASE_PRICES[c.id]); });
    return h;
  });
  const [portfolio, setPortfolio] = useState({
    bitcoin: 0.25, ethereum: 1.8, binancecoin: 5,
    solana: 12, cardano: 800, ripple: 1200,
  });
  const [usdBalance, setUsdBalance] = useState(5000);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [tradeType, setTradeType] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [trades, setTrades] = useState([]);
  const [botActive, setBotActive] = useState(false);
  const [botLog, setBotLog] = useState([]);
  const [notif, setNotif] = useState(null);
  const notifAnim = useRef(new Animated.Value(-80)).current;
  const botRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Price ticker
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => {
        const next = {};
        COINS.forEach(c => {
          next[c.id] = parseFloat((prev[c.id] * (1 + (Math.random() - 0.5) * 0.005)).toFixed(6));
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Bot pulse animation
  useEffect(() => {
    if (botActive) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [botActive]);

  // Bot logic
  useEffect(() => {
    if (botActive) {
      botRef.current = setInterval(() => {
        COINS.forEach(coin => {
          if (Math.random() < 0.25) {
            const action = Math.random() > 0.5 ? 'buy' : 'sell';
            const qty = parseFloat((Math.random() * 0.01 + 0.001).toFixed(5));
            const price = prices[coin.id];
            setBotLog(prev => [
              { id: Date.now() + coin.id, time: new Date().toLocaleTimeString(), coin: coin.symbol, action, qty, price },
              ...prev.slice(0, 29),
            ]);
          }
        });
      }, 3000);
    } else {
      clearInterval(botRef.current);
    }
    return () => clearInterval(botRef.current);
  }, [botActive, prices]);

  const showNotif = (msg, type = 'ok') => {
    setNotif({ msg, type });
    Animated.sequence([
      Animated.timing(notifAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(notifAnim, { toValue: -80, duration: 300, useNativeDriver: true }),
    ]).start(() => setNotif(null));
  };

  const totalCrypto = COINS.reduce((s, c) => s + (portfolio[c.id] || 0) * (prices[c.id] || 0), 0);
  const totalAll = totalCrypto + usdBalance;

  const coin = COINS.find(c => c.id === selectedCoin);
  const hist = histories[selectedCoin] || [];
  const priceDiff = hist.length ? ((prices[selectedCoin] - hist[0]) / hist[0] * 100).toFixed(2) : '0.00';
  const isUp = parseFloat(priceDiff) >= 0;

  const handleTrade = () => {
    const amt = parseFloat(tradeAmount);
    if (!amt || amt <= 0) return showNotif('Introdu o cantitate validă!', 'err');
    const price = prices[selectedCoin];
    const cost = amt * price;
    if (tradeType === 'buy') {
      if (cost > usdBalance) return showNotif('Fonduri insuficiente!', 'err');
      setUsdBalance(b => b - cost);
      setPortfolio(p => ({ ...p, [selectedCoin]: (p[selectedCoin] || 0) + amt }));
      setTrades(t => [{ id: Date.now(), type: 'buy', coin: selectedCoin, qty: amt, price, cost, time: new Date().toLocaleTimeString() }, ...t.slice(0, 29)]);
      showNotif(`✅ Cumpărat ${amt} ${coin?.symbol}`);
    } else {
      if ((portfolio[selectedCoin] || 0) < amt) return showNotif('Nu ai suficient!', 'err');
      setUsdBalance(b => b + cost);
      setPortfolio(p => ({ ...p, [selectedCoin]: p[selectedCoin] - amt }));
      setTrades(t => [{ id: Date.now(), type: 'sell', coin: selectedCoin, qty: amt, price, cost, time: new Date().toLocaleTimeString() }, ...t.slice(0, 29)]);
      showNotif(`✅ Vândut ${amt} ${coin?.symbol}`);
    }
    setTradeAmount('');
  };

  if (!fontsLoaded) return null;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#090E1A" />
      <LinearGradient colors={['#090E1A', '#0D1325', '#090E1A']} style={StyleSheet.absoluteFill} />

      {/* Notification */}
      {notif && (
        <Animated.View style={[s.notif, { transform: [{ translateY: notifAnim }], backgroundColor: notif.type === 'err' ? '#3D1A1A' : '#1A3D2A', borderColor: notif.type === 'err' ? '#7A2A2A' : '#2A7A5A' }]}>
          <Text style={[s.notifText, { color: notif.type === 'err' ? '#FF7A7A' : '#7AFFC0' }]}>{notif.msg}</Text>
        </Animated.View>
      )}

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLogo}>
          <LinearGradient colors={['#3A6AFF', '#9945FF']} style={s.logoBox}>
            <Text style={s.logoIcon}>◈</Text>
          </LinearGradient>
          <Text style={s.logoText}>CRYPTEX</Text>
        </View>
        <View style={s.headerBalance}>
          <Text style={s.balanceLabel}>SOLD</Text>
          <Text style={s.balanceValue}>{fmtUSD(usdBalance)}</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={s.tabBar}>
        {[
          { key: 'dashboard', label: '📊 Piață' },
          { key: 'trade',     label: '⚡ Trade' },
          { key: 'portfolio', label: '💼 Portofoliu' },
          { key: 'bot',       label: '🤖 Bot' },
        ].map(t => (
          <TouchableOpacity key={t.key} style={[s.tabBtn, tab === t.key && s.tabBtnActive]} onPress={() => setTab(t.key)}>
            <Text style={[s.tabLabel, tab === t.key && s.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DASHBOARD */}
      {tab === 'dashboard' && (
        <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Total card */}
          <LinearGradient colors={['#1A2850', '#0D1630']} style={s.totalCard}>
            <Text style={s.totalLabel}>VALOARE TOTALĂ</Text>
            <Text style={s.totalValue}>{fmtUSD(totalAll)}</Text>
            <View style={s.totalRow}>
              <Text style={s.totalSub}>Crypto: {fmtUSD(totalCrypto)}</Text>
              <Text style={s.totalSub}>  ·  Cash: {fmtUSD(usdBalance)}</Text>
            </View>
          </LinearGradient>

          <Text style={s.sectionTitle}>MONEDE</Text>
          {COINS.map(c => {
            const h = histories[c.id] || [];
            const chg = h.length ? ((prices[c.id] - h[0]) / h[0] * 100).toFixed(2) : '0.00';
            const up = parseFloat(chg) >= 0;
            return (
              <TouchableOpacity key={c.id} style={s.coinCard} onPress={() => { setSelectedCoin(c.id); setTab('trade'); }}>
                <View style={[s.coinIcon, { backgroundColor: c.color + '22' }]}>
                  <Text style={[s.coinIconText, { color: c.color }]}>{c.icon}</Text>
                </View>
                <View style={s.coinInfo}>
                  <Text style={s.coinName}>{c.name}</Text>
                  <Text style={[s.coinChange, { color: up ? '#7AFFC0' : '#FF7A7A' }]}>{up ? '▲' : '▼'} {Math.abs(chg)}%</Text>
                </View>
                <MiniChart data={h} color={c.color} />
                <View style={s.coinPriceBox}>
                  <Text style={s.coinPrice}>{fmtPrice(prices[c.id])}</Text>
                  <Text style={s.coinSymbol}>{c.symbol}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* TRADE */}
      {tab === 'trade' && (
        <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Coin selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {COINS.map(c => (
              <TouchableOpacity key={c.id} onPress={() => setSelectedCoin(c.id)}
                style={[s.coinPill, selectedCoin === c.id && { borderColor: c.color, backgroundColor: c.color + '22' }]}>
                <Text style={[s.coinPillText, { color: selectedCoin === c.id ? c.color : '#4A5580' }]}>{c.symbol}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price display */}
          <View style={s.priceCard}>
            <View style={[s.coinIconLg, { backgroundColor: coin?.color + '22' }]}>
              <Text style={[s.coinIconLgText, { color: coin?.color }]}>{coin?.icon}</Text>
            </View>
            <Text style={s.priceName}>{coin?.name}</Text>
            <Text style={s.priceMain}>{fmtPrice(prices[selectedCoin])}</Text>
            <Text style={[s.priceChange, { color: isUp ? '#7AFFC0' : '#FF7A7A' }]}>{isUp ? '▲' : '▼'} {Math.abs(priceDiff)}%</Text>
            <View style={{ marginTop: 12, alignSelf: 'stretch' }}>
              <MiniChart data={hist} color={coin?.color || '#7AA2FF'} />
            </View>
          </View>

          {/* Trade panel */}
          <View style={s.card}>
            <View style={s.typeRow}>
              {['buy', 'sell'].map(t => (
                <TouchableOpacity key={t} style={[s.typeBtn, tradeType === t && {
                  backgroundColor: t === 'buy' ? '#1A3D2A' : '#3D1A1A',
                  borderColor: t === 'buy' ? '#2A7A5A' : '#7A2A2A',
                }]} onPress={() => setTradeType(t)}>
                  <Text style={[s.typeBtnText, { color: tradeType === t ? (t === 'buy' ? '#7AFFC0' : '#FF7A7A') : '#4A5580' }]}>
                    {t === 'buy' ? '▲ CUMPĂRĂ' : '▼ VINDE'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.inputLabel}>CANTITATE ({coin?.symbol})</Text>
            <TextInput
              style={s.input}
              value={tradeAmount}
              onChangeText={setTradeAmount}
              placeholder="0.00"
              placeholderTextColor="#2A3560"
              keyboardType="decimal-pad"
            />

            {tradeAmount && parseFloat(tradeAmount) > 0 && (
              <View style={s.totalRow2}>
                <Text style={s.totalRow2Label}>Total</Text>
                <Text style={s.totalRow2Value}>{fmtUSD(parseFloat(tradeAmount) * prices[selectedCoin])}</Text>
              </View>
            )}

            <View style={s.fracRow}>
              {[0.25, 0.5, 0.75, 1].map(f => (
                <TouchableOpacity key={f} style={s.fracBtn} onPress={() => {
                  if (tradeType === 'buy') setTradeAmount(((usdBalance * f) / prices[selectedCoin]).toFixed(6));
                  else setTradeAmount(((portfolio[selectedCoin] || 0) * f).toFixed(6));
                }}>
                  <Text style={s.fracBtnText}>{f * 100}%</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleTrade}>
              <LinearGradient
                colors={tradeType === 'buy' ? ['#1A5A3A', '#0D3A22'] : ['#5A1A1A', '#3A0D0D']}
                style={s.tradeBtn}>
                <Text style={[s.tradeBtnText, { color: tradeType === 'buy' ? '#7AFFC0' : '#FF7A7A' }]}>
                  {tradeType === 'buy' ? `▲ CUMPĂRĂ ${coin?.symbol}` : `▼ VINDE ${coin?.symbol}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={s.tradeInfo}>
              <Text style={s.tradeInfoText}>Deții: {(portfolio[selectedCoin] || 0).toFixed(5)} {coin?.symbol}</Text>
              <Text style={s.tradeInfoText}>Cash: {fmtUSD(usdBalance)}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* PORTFOLIO */}
      {tab === 'portfolio' && (
        <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
          <LinearGradient colors={['#1A2850', '#0D1630']} style={s.totalCard}>
            <Text style={s.totalLabel}>TOTAL PORTOFOLIU</Text>
            <Text style={s.totalValue}>{fmtUSD(totalAll)}</Text>
            <View style={s.totalRow}>
              <Text style={s.totalSub}>Crypto: {fmtUSD(totalCrypto)}</Text>
              <Text style={s.totalSub}>  ·  Cash: {fmtUSD(usdBalance)}</Text>
            </View>
          </LinearGradient>

          <Text style={s.sectionTitle}>ACTIVE</Text>
          {COINS.map(c => {
            const qty = portfolio[c.id] || 0;
            if (qty === 0) return null;
            const val = qty * prices[c.id];
            const pct = totalCrypto > 0 ? (val / totalCrypto * 100).toFixed(1) : '0.0';
            return (
              <View key={c.id} style={s.coinCard}>
                <View style={[s.coinIcon, { backgroundColor: c.color + '22' }]}>
                  <Text style={[s.coinIconText, { color: c.color }]}>{c.icon}</Text>
                </View>
                <View style={s.coinInfo}>
                  <Text style={s.coinName}>{c.name}</Text>
                  <Text style={s.coinSymbol2}>{qty.toFixed(5)} {c.symbol}</Text>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${pct}%`, backgroundColor: c.color }]} />
                  </View>
                </View>
                <View style={s.coinPriceBox}>
                  <Text style={s.coinPrice}>{fmtUSD(val)}</Text>
                  <Text style={s.coinSymbol}>{pct}%</Text>
                </View>
              </View>
            );
          })}

          {trades.length > 0 && <>
            <Text style={s.sectionTitle}>TRANZACȚII</Text>
            {trades.slice(0, 15).map(t => {
              const c = COINS.find(x => x.id === t.coin);
              return (
                <View key={t.id} style={s.tradeRow}>
                  <View style={[s.tradeDot, { backgroundColor: t.type === 'buy' ? '#1A3D2A' : '#3D1A1A' }]}>
                    <Text style={{ color: t.type === 'buy' ? '#7AFFC0' : '#FF7A7A', fontSize: 12 }}>{t.type === 'buy' ? '▲' : '▼'}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.coinName}>{t.type === 'buy' ? 'CUMPĂRAT' : 'VÂNDUT'} {c?.symbol}</Text>
                    <Text style={s.tradeInfoText}>{t.qty.toFixed(5)} · {t.time}</Text>
                  </View>
                  <Text style={s.coinPrice}>{fmtUSD(t.cost)}</Text>
                </View>
              );
            })}
          </>}
        </ScrollView>
      )}

      {/* BOT */}
      {tab === 'bot' && (
        <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={[s.card, { borderColor: botActive ? '#2A7A5A' : '#1A2240' }]}>
            <View style={s.botHeader}>
              <View>
                <Text style={s.botTitle}>🤖 Trading Bot</Text>
                <Text style={s.botSub}>Analiză trend automat</Text>
              </View>
              <View style={s.botStatus}>
                {botActive && (
                  <Animated.View style={[s.botDot, { opacity: pulseAnim }]} />
                )}
                <Text style={[s.botStatusText, { color: botActive ? '#7AFFC0' : '#4A5580' }]}>
                  {botActive ? 'ACTIV' : 'OPRIT'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setBotActive(b => !b)}>
              <LinearGradient
                colors={botActive ? ['#5A1A1A', '#3A0D0D'] : ['#1A3A5A', '#0D2A3A']}
                style={s.tradeBtn}>
                <Text style={[s.tradeBtnText, { color: botActive ? '#FF7A7A' : '#7AA2FF' }]}>
                  {botActive ? '⏹ OPREȘTE BOTUL' : '▶ PORNEȘTE BOTUL'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {[
              { label: 'Strategie', value: 'Trend Following' },
              { label: 'Interval', value: '3 secunde' },
              { label: 'Monede', value: 'BTC, ETH, BNB, SOL, ADA, XRP' },
              { label: 'Risc per trade', value: '0.1 – 1%' },
            ].map(r => (
              <View key={r.label} style={s.botRow}>
                <Text style={s.botRowLabel}>{r.label}</Text>
                <Text style={s.botRowValue}>{r.value}</Text>
              </View>
            ))}
          </View>

          <Text style={s.sectionTitle}>LOG BOT</Text>
          <View style={s.card}>
            {botLog.length === 0 ? (
              <Text style={{ color: '#4A5580', textAlign: 'center', padding: 24, fontSize: 13 }}>
                {botActive ? 'Analizez piața...' : 'Pornește botul pentru activitate'}
              </Text>
            ) : botLog.map(l => (
              <View key={l.id} style={s.botLogRow}>
                <Text style={{ color: l.action === 'buy' ? '#7AFFC0' : '#FF7A7A', fontWeight: '700', width: 16 }}>
                  {l.action === 'buy' ? '▲' : '▼'}
                </Text>
                <Text style={[s.coinName, { color: '#7AA2FF', width: 40 }]}>{l.coin}</Text>
                <Text style={[s.tradeInfoText, { flex: 1 }]}>{l.action === 'buy' ? 'cumpărat' : 'vândut'} {l.qty}</Text>
                <Text style={s.tradeInfoText}>{l.time}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#090E1A' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#1A2240' },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 18, color: '#fff' },
  logoText: { fontSize: 18, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF', letterSpacing: 2 },
  headerBalance: { alignItems: 'flex-end' },
  balanceLabel: { fontSize: 10, color: '#4A5580', letterSpacing: 1.5 },
  balanceValue: { fontSize: 17, fontFamily: 'SpaceMono_700Bold', color: '#7AFFC0' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1A2240', paddingHorizontal: 8 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#7AA2FF' },
  tabLabel: { fontSize: 10, color: '#4A5580', fontFamily: 'SpaceMono_400Regular' },
  tabLabelActive: { color: '#7AA2FF', fontFamily: 'SpaceMono_700Bold' },
  totalCard: { borderRadius: 18, padding: 24, marginTop: 20, marginBottom: 8 },
  totalLabel: { fontSize: 11, color: '#7AA2FF', letterSpacing: 1.5, marginBottom: 6 },
  totalValue: { fontSize: 34, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF' },
  totalRow: { flexDirection: 'row', marginTop: 6 },
  totalSub: { fontSize: 12, color: '#4A5580' },
  sectionTitle: { fontSize: 11, color: '#4A5580', letterSpacing: 1.5, marginTop: 20, marginBottom: 10, fontFamily: 'SpaceMono_700Bold' },
  coinCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D1325', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1A2240', gap: 12 },
  coinIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  coinIconText: { fontSize: 20 },
  coinInfo: { flex: 1 },
  coinName: { fontSize: 14, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF' },
  coinChange: { fontSize: 12, marginTop: 2 },
  coinSymbol: { fontSize: 11, color: '#4A5580', marginTop: 2 },
  coinSymbol2: { fontSize: 11, color: '#4A5580', marginTop: 1 },
  coinPriceBox: { alignItems: 'flex-end' },
  coinPrice: { fontSize: 14, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF' },
  card: { backgroundColor: '#0D1325', borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#1A2240' },
  coinPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#1A2240', marginRight: 8, backgroundColor: '#0D1325' },
  coinPillText: { fontSize: 13, fontFamily: 'SpaceMono_700Bold' },
  priceCard: { backgroundColor: '#0D1325', borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#1A2240', alignItems: 'center' },
  coinIconLg: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  coinIconLgText: { fontSize: 30 },
  priceName: { fontSize: 16, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF' },
  priceMain: { fontSize: 32, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF', marginTop: 6 },
  priceChange: { fontSize: 14, marginTop: 4 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#131E36', borderWidth: 1, borderColor: '#1A2240' },
  typeBtnText: { fontSize: 13, fontFamily: 'SpaceMono_700Bold' },
  inputLabel: { fontSize: 11, color: '#4A5580', letterSpacing: 1.2, marginBottom: 8 },
  input: { backgroundColor: '#131E36', borderWidth: 1, borderColor: '#1A2240', borderRadius: 12, padding: 14, color: '#E8EDFF', fontSize: 18, fontFamily: 'SpaceMono_400Regular', marginBottom: 12 },
  totalRow2: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#131E36', borderRadius: 10, padding: 12, marginBottom: 12 },
  totalRow2Label: { fontSize: 13, color: '#4A5580' },
  totalRow2Value: { fontSize: 13, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF' },
  fracRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  fracBtn: { flex: 1, paddingVertical: 8, backgroundColor: '#131E36', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#1A2240' },
  fracBtnText: { fontSize: 12, color: '#7AA2FF', fontFamily: 'SpaceMono_700Bold' },
  tradeBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  tradeBtnText: { fontSize: 15, fontFamily: 'SpaceMono_700Bold', letterSpacing: 1 },
  tradeInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  tradeInfoText: { fontSize: 11, color: '#4A5580' },
  barBg: { height: 4, backgroundColor: '#1A2240', borderRadius: 2, marginTop: 6, width: '100%' },
  barFill: { height: 4, borderRadius: 2 },
  tradeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D1325', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1A2240' },
  tradeDot: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  botHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  botTitle: { fontSize: 18, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF' },
  botSub: { fontSize: 12, color: '#4A5580', marginTop: 4 },
  botStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  botDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7AFFC0' },
  botStatusText: { fontSize: 12, fontFamily: 'SpaceMono_700Bold' },
  botRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#131E36', marginTop: 4 },
  botRowLabel: { fontSize: 13, color: '#4A5580' },
  botRowValue: { fontSize: 12, fontFamily: 'SpaceMono_700Bold', color: '#E8EDFF', textAlign: 'right', maxWidth: '60%' },
  botLogRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#131E36' },
  notif: { position: 'absolute', top: 0, left: 20, right: 20, zIndex: 999, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  notifText: { fontFamily: 'SpaceMono_700Bold', fontSize: 14 },
});
