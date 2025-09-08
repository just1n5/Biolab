import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InvoicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Facturación</h1>
      <Card>
        <CardHeader>
          <CardTitle>Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Módulo de facturación en desarrollo...</p>
        </CardContent>
      </Card>
    </div>
  );
}