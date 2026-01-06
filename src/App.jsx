import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoginPage from './components/LoginPage';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';   // 👈 Importa el hook
import { db } from './firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState([]);
  const { toast } = useToast();   // 👈 Inicializa el hook

  useEffect(() => {
    // Escuchar solicitudes en tiempo real desde Firestore
    const unsubscribe = onSnapshot(collection(db, "solicitudes"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSolicitudes(data);
    });

    setIsLoading(false);
    return () => unsubscribe();
  }, []);

  const handleLogin = async (employee) => {
    setCurrentUser(employee);

    // 🔥 Toast de login exitoso
    toast({
      title: "Bienvenido",
      description: `Has iniciado sesión como ${employee.name}`,
      variant: "success",
    });

    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);

    // 🔥 Toast de logout
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    });
  };

  const handleVacationRequest = async (fechaInicio, fechaFin) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "solicitudes"), {
        empleadoId: currentUser.id,
        nombre: currentUser.name,
        role: currentUser.role,
        fechaInicio,
        fechaFin,
        estado: "pendiente",
        createdAt: new Date()
      });

      // 🔥 Toast de éxito
      toast({
        title: "Solicitud enviada",
        description: "Tus vacaciones se han registrado correctamente",
        variant: "success",
      });

    } catch (e) {
      console.error("Error al guardar solicitud: ", e);

      // 🔥 Toast de error
      toast({
        title: "Error",
        description: "No se pudo guardar la solicitud",
        variant: "destructive",
      });
    }
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
        <Toaster /> {/* 👈 Siempre montado */}
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
        <AdminDashboard user={currentUser} solicitudes={solicitudes} onLogout={handleLogout} />
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
      <EmployeeDashboard
        user={currentUser}
        onLogout={handleLogout}
        onRequestVacation={handleVacationRequest}
        solicitudes={solicitudes}
      />
      <Toaster />
    </>
  );
}

export default App;
