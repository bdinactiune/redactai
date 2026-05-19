'use client';

import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    localStorage.setItem('hasSubscription', 'true');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Plată reușită!</h1>
      <p className="mb-4">Abonamentul tău Premium a fost activat. Ai generări nelimitate!</p>
      <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
        Înapoi la aplicație
      </a>
    </div>
  );
}