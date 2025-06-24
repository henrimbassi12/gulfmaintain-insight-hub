
import React from 'react';

const alerts = [
  { label: 'Frigo TAG145', type: 'Température haute', severity: 'high', icon: '🌡️' },
  { label: 'Frigo TAG211', type: 'Tension basse', severity: 'medium', icon: '🔌' },
  { label: 'Frigo TAG087', type: 'Vibration anormale', severity: 'low', icon: '⚡' },
];

export function ActiveAlerts() {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Alertes actives</h2>
        <p className="text-sm text-gray-500">{alerts.length} alertes nécessitent une attention</p>
      </div>
      
      <ul className="space-y-3">
        {alerts.map((alert, i) => (
          <li key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${getSeverityStyles(alert.severity)}`}>
            <span className="text-lg flex-shrink-0">{alert.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{alert.label}</p>
              <p className="text-xs opacity-75">{alert.type}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
