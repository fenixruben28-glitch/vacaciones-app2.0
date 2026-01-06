import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckCircle, TrendingUp } from 'lucide-react';

// Función auxiliar para calcular días entre dos fechas
const calcularDias = (inicio, fin) => {
  const start = new Date(inicio);
  const end = new Date(fin);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // incluye el día inicial
};

const AdminStatistics = ({ requests, employees }) => {
  const totalEmployees = employees.filter(emp => emp.role === 'employee').length;
  const employeesWithRequests = new Set(requests.map(req => req.empleadoId)).size;
  const approvedRequests = requests.filter(req => req.estado === 'aprobado').length;
  const totalDaysRequested = requests
    .filter(req => req.estado === 'aprobado')
    .reduce((sum, req) => sum + calcularDias(req.fechaInicio, req.fechaFin), 0);

  const stats = [
    {
      title: 'Total de Empleados',
      value: totalEmployees,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Empleados con Solicitudes',
      value: employeesWithRequests,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Solicitudes Aprobadas',
      value: approvedRequests,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Días Utilizados',
      value: totalDaysRequested,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
          <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStatistics;
