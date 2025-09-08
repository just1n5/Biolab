import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CertificatesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Certificados</h1>
      <Card>
        <CardHeader>
          <CardTitle>Certificados de Aptitud</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Módulo de certificados en desarrollo...</p>
        </CardContent>
      </Card>
    </div>
  );
}