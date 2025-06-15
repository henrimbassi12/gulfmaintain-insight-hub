
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ReportForm {
  id: string;
  title: string;
  description: string;
  action: () => void;
}

interface AvailableFormsProps {
  reportForms: ReportForm[];
}

export function AvailableForms({ reportForms }: AvailableFormsProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="text-lg">Fiches de maintenance disponibles</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportForms.map((form) => (
            <div
              key={form.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer flex flex-col"
              onClick={form.action}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{form.title}</h3>
              <p className="text-sm text-gray-600 flex-grow">{form.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
