import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Calendar, User, Building2, Briefcase, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import VacationCalendar from '../components/VacationCalendar';
import VacationRequestForm from '../components/VacationRequestForm';
import { useToast } from '../components/ui/use-toast';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [vacationRequests, setVacationRequests] = useState([]);
  const [remainingDays, setRemainingDays] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    // 🔥 Escuchar solicitudes del empleado en tiempo real (colección unificada)
    const q = query(collection(db, "vacationRequests"), where("employeeId", "==", user.id));
    const unsubscribeReqs = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setVacationRequests(data);
    });

    // 🔥 Escuchar días restantes en tiempo real desde empleados
    const userRef = doc(db, "empleados", user.id);
    const unsubscribeUser = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const val = snap.data().diasRestantes;
        if (typeof val === 'number') setRemainingDays(val);
      }
    });

    return () => {
      unsubscribeReqs();
      unsubscribeUser();
    };
  }, [user.id]);

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
                 Días Disponibles: <span className="font-bold text-lg">{remainingDays}</span> / 10
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
          <VacationRequestForm user={user} />
        </motion.div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
