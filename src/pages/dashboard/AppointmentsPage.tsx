import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Citas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Módulo de gestión de citas en desarrollo...</p>
        </CardContent>
      </Card>
    </div>
  );
}