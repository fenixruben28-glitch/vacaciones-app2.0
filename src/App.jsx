import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoginPage from '@/components/LoginPage';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';
import { employeeData } from '@/data/employeeData';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- TEMPORARY: Clear all localStorage data as requested by user ---
    // This code will clear ALL data from localStorage for this domain.
    // Please remove this useEffect block after the data has been cleared and verified.
    console.log("Clearing all localStorage data...");
    localStorage.clear();
    console.log("localStorage cleared.");
    // --- END TEMPORARY CLEARING BLOCK ---

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []); // Empty dependency array ensures this runs once on mount

  const handleLogin = (employeeId) => {
    const employee = employeeData.find(emp => emp.id === employeeId);
    if (employee) {
      const userData = { ...employee };
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Helmet>
          <title>Sistema de Gestión de Vacaciones - Inicio de Sesión</title>
          <meta name="description" content="Sistema de gestión de vacaciones para empleados. Ingrese con su ID de empleado para solicitar y administrar sus vacaciones." />
        </Helmet>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <>
        <Helmet>
          <title>Panel de Administración - Gestión de Vacaciones</title>
          <meta name="description" content="Panel de administración para gestionar todas las solicitudes de vacaciones de empleados." />
        </Helmet>
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mi Panel de Vacaciones - {currentUser.name}</title>
        <meta name="description" content="Solicite y administre sus períodos de vacaciones de forma fácil y rápida." />
      </Helmet>
      <EmployeeDashboard user={currentUser} onLogout={handleLogout} />
      <Toaster />
    </>
  );
}

export default App;