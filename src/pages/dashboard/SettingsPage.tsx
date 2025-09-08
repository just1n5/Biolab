import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Configuración del Sistema</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Módulo de configuración en desarrollo...</p>
        </CardContent>
      </Card>
    </div>
  );
}