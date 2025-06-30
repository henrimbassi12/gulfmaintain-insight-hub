
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
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'medium':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-700';
      case 'low':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Alertes actives</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{alerts.length} alertes nécessitent une attention</p>
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
