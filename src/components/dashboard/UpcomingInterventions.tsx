
import React from 'react';

const upcoming = [
  { date: '24 Juin', tag: 'TAG145', type: 'Préventive', technicien: 'D. Ngangue' },
  { date: '25 Juin', tag: 'TAG211', type: 'Corrective', technicien: 'M. Diko' },
  { date: '26 Juin', tag: 'TAG078', type: 'Préventive', technicien: 'J. Tamo' },
];

export function UpcomingInterventions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Prochaines interventions</h2>
        <p className="text-sm text-gray-500">Planning des 3 prochains jours</p>
      </div>
      
      <ul className="divide-y divide-gray-100">
        {upcoming.map((item, i) => (
          <li key={i} className="py-3 flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">{item.date}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === 'Préventive' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {item.type}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {item.tag} • {item.technicien}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
