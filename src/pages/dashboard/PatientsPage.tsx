import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Pacientes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Módulo de gestión de pacientes en desarrollo...</p>
        </CardContent>
      </Card>
    </div>
  );
}