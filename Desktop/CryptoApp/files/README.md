# 📱 Cryptex Trading App

Aplicație crypto trading completă pentru Android, construită cu Expo React Native.

## 🚀 Instalare pe Android (pas cu pas)

### 1. Instalează Node.js
Descarcă de la: https://nodejs.org (versiunea LTS)

### 2. Instalează Expo și EAS CLI
```bash
npm install -g expo-cli eas-cli
```

### 3. Creează un cont Expo (gratuit)
https://expo.dev/signup

### 4. Copiază fișierele proiectului
Pune folderul `CryptoApp` unde vrei pe PC.

### 5. Instalează dependențele
```bash
cd CryptoApp
npm install
```

### 6. Loghează-te în EAS
```bash
eas login
```

### 7. Configurează proiectul
```bash
eas build:configure
```

### 8. Buildează APK-ul (gratuit, în cloud)
```bash
eas build --platform android --profile preview
```
⏳ Durează ~10-15 minute. La final primești un link.

### 9. Instalează pe telefon
- Descarcă APK-ul de la link-ul primit
- Pe telefon: Setări → Securitate → Surse necunoscute (activează)
- Instalează APK-ul

## 📲 Testare rapidă (fără build)
```bash
npm install -g expo-go
expo start
```
Scanează QR code-ul cu aplicația **Expo Go** de pe Play Store.

## ✨ Funcții
- 📊 Dashboard cu prețuri live BTC, ETH, BNB, SOL, ADA, XRP
- ⚡ Trading: cumpără/vinde cu sold virtual
- 💼 Portofoliu cu distribuție și istoric
- 🤖 Bot automat de trading cu log în timp real
