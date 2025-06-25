
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, XCircle, Loader2, Network, Bug } from 'lucide-react';

export function CORSDebugger() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState('');

  const API_BASE_URL = 'https://web-production-c2b6a.up.railway.app';

  const runCORSTests = async () => {
    setIsLoading(true);
    setResults([]);
    const testResults: any[] = [];
    let diagnosticText = `=== DIAGNOSTIC CORS AVANCÉ ===\nHeure: ${new Date().toLocaleString()}\nAPI: ${API_BASE_URL}\n\n`;

    // Test 1: Requête GET simple (pas de preflight)
    try {
      console.log('🧪 Test 1: GET simple');
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
      const duration = Date.now() - start;
      
      testResults.push({
        test: 'GET /',
        status: response.status,
        success: response.ok,
        duration,
        headers: Object.fromEntries(response.headers.entries())
      });

      diagnosticText += `✅ Test 1 - GET /: ${response.status} (${duration}ms)\n`;
    } catch (err) {
      testResults.push({
        test: 'GET /',
        success: false,
        error: err instanceof Error ? err.message : 'Erreur inconnue'
      });
      diagnosticText += `❌ Test 1 - GET /: ${err}\n`;
    }

    // Test 2: Requête OPTIONS manuelle
    try {
      console.log('🧪 Test 2: OPTIONS manual');
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/`, { 
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      const duration = Date.now() - start;
      
      testResults.push({
        test: 'OPTIONS /',
        status: response.status,
        success: response.ok,
        duration,
        headers: Object.fromEntries(response.headers.entries())
      });

      diagnosticText += `${response.ok ? '✅' : '❌'} Test 2 - OPTIONS /: ${response.status} (${duration}ms)\n`;
    } catch (err) {
      testResults.push({
        test: 'OPTIONS /',
        success: false,
        error: err instanceof Error ? err.message : 'Erreur inconnue'
      });
      diagnosticText += `❌ Test 2 - OPTIONS /: ${err}\n`;
    }

    // Test 3: POST avec Content-Type simple (pas de preflight)
    try {
      console.log('🧪 Test 3: POST simple');
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain' // Évite preflight
        },
        body: 'test'
      });
      const duration = Date.now() - start;
      
      testResults.push({
        test: 'POST /predict/ (text/plain)',
        status: response.status,
        success: response.ok,
        duration,
        headers: Object.fromEntries(response.headers.entries())
      });

      diagnosticText += `${response.ok ? '✅' : '⚠️'} Test 3 - POST simple: ${response.status} (${duration}ms)\n`;
    } catch (err) {
      testResults.push({
        test: 'POST /predict/ (text/plain)',
        success: false,
        error: err instanceof Error ? err.message : 'Erreur inconnue'
      });
      diagnosticText += `❌ Test 3 - POST simple: ${err}\n`;
    }

    // Test 4: POST avec JSON (déclenche preflight)
    try {
      console.log('🧪 Test 4: POST JSON (preflight)');
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      });
      const duration = Date.now() - start;
      
      testResults.push({
        test: 'POST /predict/ (application/json)',
        status: response.status,
        success: response.ok,
        duration,
        headers: Object.fromEntries(response.headers.entries())
      });

      diagnosticText += `${response.ok ? '✅' : '❌'} Test 4 - POST JSON: ${response.status} (${duration}ms)\n`;
    } catch (err) {
      testResults.push({
        test: 'POST /predict/ (application/json)',
        success: false,
        error: err instanceof Error ? err.message : 'Erreur inconnue'
      });
      diagnosticText += `❌ Test 4 - POST JSON: ${err}\n`;
    }

    diagnosticText += `\n=== ANALYSE ===\n`;
    const failedTests = testResults.filter(r => !r.success);
    if (failedTests.length === 0) {
      diagnosticText += `🎉 Tous les tests CORS ont réussi !\n`;
    } else {
      diagnosticText += `⚠️ ${failedTests.length} test(s) ont échoué:\n`;
      failedTests.forEach(test => {
        diagnosticText += `- ${test.test}: ${test.error || `HTTP ${test.status}`}\n`;
      });
    }

    diagnosticText += `\n=== RECOMMANDATIONS ===\n`;
    const optionsTest = testResults.find(r => r.test === 'OPTIONS /');
    if (optionsTest && !optionsTest.success) {
      diagnosticText += `🔧 Votre API doit gérer les requêtes OPTIONS\n`;
      diagnosticText += `📝 Ajoutez ceci à votre API FastAPI:\n`;
      diagnosticText += `@app.options("/{path:path}")\nasync def handle_options():\n    return {"status": "ok"}\n\n`;
    }

    setResults(testResults);
    setDiagnostics(diagnosticText);
    setIsLoading(false);
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
            <Bug className="w-5 h-5 text-white" />
          </div>
          Diagnostic CORS Avancé
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Ce diagnostic teste différents types de requêtes pour identifier précisément le problème CORS.
          </p>
          <Button 
            onClick={runCORSTests}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Network className="w-4 h-4" />
            )}
            Lancer le diagnostic CORS
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Résultats des Tests</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium text-sm">{result.test}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.status && (
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.status}
                      </Badge>
                    )}
                    {result.duration && (
                      <span className="text-xs text-gray-500">{result.duration}ms</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {diagnostics && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Rapport Détaillé</h3>
            <Textarea
              value={diagnostics}
              readOnly
              rows={12}
              className="bg-gray-50 font-mono text-xs"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
