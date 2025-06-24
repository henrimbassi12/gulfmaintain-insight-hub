
import React from 'react';

export function AIPredictionBlock() {
  const predictions = [
    { icon: '📌', label: 'Panne probable', value: 'Oui', color: 'text-red-600' },
    { icon: '🧊', label: 'Équipements à risque', value: 'TAG123, TAG087, TAG201', color: 'text-orange-600' },
    { icon: '🧰', label: 'Technicien recommandé', value: 'D. Ngangue', color: 'text-blue-600' },
    { icon: '📉', label: 'Estimation panne', value: '75%', color: 'text-red-600' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Supervision IA</h2>
        <p className="text-sm text-gray-500">Analyse prédictive en temps réel</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <p className={`font-medium text-sm ${item.color}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Recommandation :</span> Programmer une maintenance préventive pour les équipements à risque dans les 48h.
        </p>
      </div>
    </div>
  );
}
