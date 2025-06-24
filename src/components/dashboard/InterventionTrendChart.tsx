
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', préventif: 89, correctif: 67 },
  { month: 'Fév', préventif: 102, correctif: 87 },
  { month: 'Mar', préventif: 134, correctif: 100 },
  { month: 'Avr', préventif: 118, correctif: 80 },
  { month: 'Mai', préventif: 156, correctif: 111 },
  { month: 'Juin', préventif: 132, correctif: 91 }
];

export function InterventionTrendChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Tendances des interventions</h2>
        <p className="text-sm text-gray-500">Évolution sur 6 mois</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar 
            dataKey="préventif" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
            name="Préventif"
          />
          <Bar 
            dataKey="correctif" 
            fill="#9CA3AF" 
            radius={[4, 4, 0, 0]}
            name="Correctif"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
