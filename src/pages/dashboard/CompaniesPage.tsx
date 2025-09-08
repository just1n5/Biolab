import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompaniesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Empresas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Módulo de gestión de empresas en desarrollo...</p>
        </CardContent>
      </Card>
    </div>
  );
}