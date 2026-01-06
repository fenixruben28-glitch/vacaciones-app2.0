import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Calendar, User, Building2, Briefcase, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import VacationCalendar from '../components/VacationCalendar';
import VacationRequestForm from '../components/VacationRequestForm';
import { useToast } from '../components/ui/use-toast';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

// Función auxiliar para calcular días entre dos fechas
const calcularDias = (inicio, fin) => {
  const start = new Date(inicio);
  const end = new Date(fin);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const EmployeeDashboard = ({ user, onLogout }) => {
  const [vacationRequest, setVacationRequest] = useState(null);
  const [daysUsed, setDaysUsed] = useState(0);
  const maxDays = 10;
  const { toast } = useToast();

  useEffect(() => {
    // Escuchar solicitudes del empleado en tiempo real
    const q = query(collection(db, "solicitudes"), where("empleadoId", "==", user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) {
        const req = data[0];
        setVacationRequest(req);
        setDaysUsed(calcularDias(req.fechaInicio, req.fechaFin));
      } else {
        setVacationRequest(null);
        setDaysUsed(0);
      }
    });

    return () => unsubscribe();
  }, [user.id]);

  const handleRequestSubmit = async (request) => {
    try {
      await addDoc(collection(db, "solicitudes"), {
        empleadoId: user.id,
        nombre: user.name,
        puesto: user.position,
        sucursal: user.branch,
        departamento: user.department,
        fechaInicio: request.fechaInicio,
        fechaFin: request.fechaFin,
        estado: "pendiente",
        createdAt: new Date()
      });

      toast({
        title: 'Solicitud enviada',
        description: 'Su solicitud de vacaciones ha sido registrada exitosamente.',
      });
    } catch (e) {
      console.error("Error al guardar solicitud: ", e);
    }
  };

  const remainingDays = maxDays - daysUsed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Sistema de Vacaciones
              </h1>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
             <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Información del Empleado
            </h2>
            <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
               <Clock className="w-4 h-4 text-indigo-600" />
               <span className="text-sm font-medium text-indigo-800">
                 Días Disponibles: <span className="font-bold text-lg">{remainingDays}</span> / {maxDays}
               </span>
            </div>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Nombre</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-600">Puesto</p>
                <p className="font-semibold text-gray-800">{user.position}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Sucursal</p>
                <p className="font-semibold text-gray-800">{user.branch}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
              <Calendar className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-xs text-gray-600">Departamento</p>
                <p className="font-semibold text-gray-800">{user.department}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VacationCalendar user={user} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <VacationRequestForm
            user={user}
            onSubmit={handleRequestSubmit}
            existingRequest={vacationRequest}
            remainingDays={remainingDays}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
