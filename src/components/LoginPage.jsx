import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LoginPage = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese su ID de empleado',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Buscar empleado en Firestore
      const q = query(collection(db, "empleados"), where("id", "==", employeeId.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast({
          title: 'Error de autenticación',
          description: 'ID de empleado no encontrado. Verifique e intente nuevamente.',
          variant: 'destructive'
        });
        return;
      }

      // Tomamos el primer documento encontrado
      const empleado = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

      // Pasamos el objeto empleado al App.jsx
      onLogin(empleado);

      toast({
        title: 'Bienvenido',
        description: `Ingreso exitoso como ${empleado.name}`,
      });

    } catch (error) {
      console.error("Error al validar empleado:", error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al validar el ID. Intente más tarde.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4"
            >
              <Calendar className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800">
              Sistema de Vacaciones
            </h1>
            <p className="text-gray-600">
              Ingrese con su ID de empleado
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-gray-700">
                ID de Empleado
              </Label>
              <Input
                id="employeeId"
                type="text"
                placeholder="Ej: 1001-01 o ADMIN001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              💡 IDs de ejemplo:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• ADMIN001 (Gerente General)</li>
              <li>• GE001 (Gerencia Estatal)</li>
              <li>• 1001-01 (Sucursal)</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
