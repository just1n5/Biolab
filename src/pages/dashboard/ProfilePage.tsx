import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthStore from '@/store/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
              <p className="text-lg">{user?.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Rol</label>
              <p className="text-lg">{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}