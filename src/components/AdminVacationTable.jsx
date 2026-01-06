import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';

const AdminVacationTable = ({ requests, onApprove, onReject, readOnly = false }) => {
  const getStatusBadge = (status) => {
    const mapEstado = {
      pending: 'pendiente',
      approved: 'aprobado',
      rejected: 'rechazado'
    };
    const estado = mapEstado[status] || status;

    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      aprobado: 'bg-green-100 text-green-800 border-green-300',
      rechazado: 'bg-red-100 text-red-800 border-red-300',
    };

    const icons = {
      pendiente: <Clock className="w-4 h-4" />,
      aprobado: <CheckCircle className="w-4 h-4" />,
      rechazado: <XCircle className="w-4 h-4" />,
    };

    const labels = {
      pendiente: 'Pendiente',
      aprobado: 'Aprobada',
      rechazado: 'Rechazada',
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[estado]}`}>
        {icons[estado]}
        <span>{labels[estado]}</span>
      </span>
    );
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay solicitudes para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Empleado</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Sucursal</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Fechas</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
              {!readOnly && <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request, index) => {
              const totalDias = request.dates?.length || 0;
              return (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                         <div className="font-medium text-gray-800">{request.employeeName}</div>
                         <div className="text-xs text-gray-500">{request.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{request.branch}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-700">{new Date(request.startDate).toLocaleDateString('es-ES')}</div>
                      <div className="text-gray-500 text-xs">al</div>
                      <div className="text-gray-700">{new Date(request.endDate).toLocaleDateString('es-ES')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800">{totalDias}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  {!readOnly && (
                  <td className="px-6 py-4">
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => onApprove(request.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => onReject(request.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </td>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVacationTable;

