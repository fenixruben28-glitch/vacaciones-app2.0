import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Users, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { employeeData } from '../data/employeeData';
import AdminVacationTable from '../components/AdminVacationTable';
import AdminStatistics from '../components/AdminStatistics';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const AdminDashboard = ({ user, onLogout }) => {
  const [vacationRequests, setVacationRequests] = useState([]);

  useEffect(() => {
    // Escuchar solicitudes en tiempo real desde Firestore
    const unsubscribe = onSnapshot(collection(db, "solicitudes"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Requirement: mostrar solo aprobadas
      const approvedOnly = data.filter(req => req.estado === 'aprobado');
      setVacationRequests(approvedOnly);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
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
        >
          <AdminStatistics requests={vacationRequests} employees={employeeData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Solicitudes Aprobadas
                </h2>
             </div>
             
             <AdminVacationTable
                requests={vacationRequests}
                readOnly={true} // Prop para ocultar acciones
              />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
