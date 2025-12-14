import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function HealthCheck() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await api.get('/');
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="p-4 bg-gray-100 rounded border-4 border-blue-500">
        Probando conexión al backend...
      </div>
    );

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded border-4 border-red-500">
        <h3 className="font-bold">Error de Conexión</h3>
        <p>No se pudo conectar al backend.</p>
        <pre className="text-xs mt-2 overflow-auto bg-red-50 p-2">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 text-green-700 rounded border-4 border-green-500">
      <h3 className="font-bold">¡Conexión Exitosa!</h3>
      <p>Respuesta del servidor:</p>
      <code className="bg-green-50 px-2 py-1 rounded font-mono text-lg font-bold">
        {JSON.stringify(data)}
      </code>
    </div>
  );
}
