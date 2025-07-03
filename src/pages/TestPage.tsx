
import React from 'react';
import { AuthTester } from '@/components/auth/AuthTester';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Page de Tests - GulfMaintain
          </h1>
          <p className="text-gray-600">
            Tests systématiques des fonctionnalités de l'application
          </p>
        </div>
        
        <AuthTester />
      </div>
    </div>
  );
}

export default TestPage;
