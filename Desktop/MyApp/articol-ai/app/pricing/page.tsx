export default function PricingPage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Planuri RedactAI</h1>

      {/* Ofertă specială banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-6 mb-10 text-center shadow-lg">
        <span className="inline-block bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full mb-2">🔥 OFERTĂ SPECIALĂ DE LANSARE 🔥</span>
        <h2 className="text-2xl font-bold mb-2">Primele 3 luni la doar 29.99 RON/lună</h2>
        <p className="mb-4">Apoi 49.99 RON/lună. Anulare oricând. Reducere disponibilă pentru primele 100 de înscrieri.</p>
        <a href="/" className="inline-block bg-white text-purple-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
          Activează oferta
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Plan Basic */}
        <div className="border rounded-2xl p-6 text-center bg-white shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold mb-2">Basic</h2>
          <p className="text-4xl font-bold text-gray-800 mb-1">24.99 RON</p>
          <p className="text-sm text-gray-500 mb-4">pe lună</p>
          <ul className="mb-6 space-y-2 text-gray-700">
            <li>✅ 100 generări / lună</li>
            <li>✅ Istoric generări</li>
            <li>✅ Export PDF</li>
          </ul>
          <a
            href="/"
            className="inline-block border border-purple-500 text-purple-700 px-6 py-2 rounded-full hover:bg-purple-50 transition"
          >
            Începe acum
          </a>
        </div>

        {/* Plan Premium (recomandat) */}
        <div className="border-2 border-purple-500 rounded-2xl p-6 text-center bg-purple-50 shadow-md relative hover:shadow-lg transition">
          <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
            Recomandat
          </span>
          <h2 className="text-2xl font-bold mb-2">Premium</h2>
          <p className="text-5xl font-extrabold text-purple-800 mb-1">49.99 RON</p>
          <p className="text-sm text-purple-600 mb-4">doar 1.67 RON/zi</p>
          <ul className="mb-6 space-y-2 text-gray-800">
            <li>✅ Generări nelimitate</li>
            <li>✅ Istoric generări</li>
            <li>✅ Export PDF</li>
            <li>✅ Prioritate suport</li>
          </ul>
          <a
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition font-semibold"
          >
            Alege Premium
          </a>
          <p className="text-xs text-gray-500 mt-4">Fără taxe ascunse. Anulare oricând.</p>
        </div>

        {/* Plan Anual */}
        <div className="border rounded-2xl p-6 text-center bg-white shadow-sm hover:shadow-md transition">
          <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-2">Economisește 2 luni</div>
          <h2 className="text-2xl font-bold mb-2">Anual</h2>
          <p className="text-4xl font-bold text-gray-800 mb-1">499 RON</p>
          <p className="text-sm text-gray-500 mb-4">pe an (41.58 RON/lună)</p>
          <ul className="mb-6 space-y-2 text-gray-700">
            <li>✅ Generări nelimitate</li>
            <li>✅ Istoric generări</li>
            <li>✅ Export PDF</li>
            <li>✅ Prioritate suport</li>
            <li>✅ Factură anuală</li>
          </ul>
          <a
            href="/"
            className="inline-block bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-900 transition"
          >
            Alege anual
          </a>
        </div>
      </div>
    </main>
  );
}