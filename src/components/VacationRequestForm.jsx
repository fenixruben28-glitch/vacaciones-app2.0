import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Info, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/firebase';
import { collection, setDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { updateRemainingDays } from '@/services/vacaciones'; // 👈 Importamos la función

const VacationRequestForm = ({ user, onSubmit, existingRequest, remainingDays }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (existingRequest?.dates?.length > 0) {
      setStartDate(existingRequest.dates[0]);
      setEndDate(existingRequest.dates[existingRequest.dates.length - 1]);
    }
  }, [existingRequest]);

  const getDatesBetween = (start, end) => {
    const dates = [];
    const startD = new Date(start);
    const endD = new Date(end);
    for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const validateRequest = async (dates) => {
    const validationErrors = [];

    // Rule 0: Available Days Limit
    if (dates.length > 10) {
      validationErrors.push('No puede exceder el límite de 10 días anuales.');
    }

    // Rule 1: Maximum 5 consecutive days
    if (dates.length > 5) {
      validationErrors.push('No puede solicitar más de 5 días consecutivos.');
    }

    // Rule 2: Date Range Validity
    const validStart = new Date('2026-01-16');
    const validEnd = new Date('2027-01-15');
    const isRangeValid = dates.every(date => {
      const d = new Date(date);
      return d >= validStart && d <= validEnd;
    });
    if (!isRangeValid) {
      validationErrors.push('Las fechas deben estar dentro del periodo: 16 Ene 2026 - 15 Ene 2027');
    }

    // Rule 3: Branch overlap check (consultando Firestore)
    const q = query(collection(db, 'vacationRequests'), where('branch', '==', user.branch));
    const snapshot = await getDocs(q);
    const sameBranchRequests = snapshot.docs.map(doc => doc.data());

    const hasBranchOverlap = sameBranchRequests.some(req =>
      req.employeeId !== user.id &&
      req.status === 'approved' &&
      req.dates.some(bookedDate => dates.includes(bookedDate))
    );
    if (hasBranchOverlap) {
      validationErrors.push('Error: Las fechas coinciden con otro empleado de su sucursal.');
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({ title: 'Error', description: 'Seleccione fechas de inicio y fin', variant: 'destructive' });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast({ title: 'Error', description: 'La fecha de inicio debe ser anterior a la de fin', variant: 'destructive' });
      return;
    }

    const dates = getDatesBetween(startDate, endDate);
    const validationErrors = await validateRequest(dates);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast({ title: 'Validación fallida', description: 'Revise los errores indicados', variant: 'destructive' });
      return;
    }

    setErrors([]);
    const request = {
      id: existingRequest?.id || `req-${Date.now()}`,
      employeeId: user.id,
      employeeName: user.name,
      branch: user.branch,
      department: user.department,
      dates,
      startDate,
      endDate,
      status: 'approved',
      submittedAt: new Date().toISOString()
    };

    // 🔥 Guardar en Firestore
    await setDoc(doc(collection(db, "vacationRequests"), request.id), request);

    // 🔥 Actualizar días restantes del usuario
    await updateRemainingDays(user.id, dates.length);

    toast({ title: 'Solicitud enviada', description: 'Tus vacaciones se han registrado correctamente', variant: 'success' });

    onSubmit?.(request);
  };

  if (remainingDays <= 0 && (!existingRequest || existingRequest.dates.length === 0)) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-6 text-center">
        <Ban className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-gray-800">Sin días disponibles</h3>
        <p className="text-red-600 font-medium">Ya gastó sus días de vacaciones</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
        <Send className="w-6 h-6 mr-2 text-blue-600" /> Solicitud de Vacaciones
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <input id="startDate" type="date" min="2026-01-16" max="2027-01-15"
              value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="endDate">Fecha de Fin</Label>
            <input id="endDate" type="date" min="2026-01-16" max="2027-01-15"
              value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="font-semibold text-red-800 mb-2">Errores:</p>
            <ul>{errors.map((err, i) => <li key={i} className="text-sm text-red-700">{err}</li>)}</ul>
          </div>
        )}
        <Button type="submit" className="w-full bg-blue-600 text-white">Enviar Solicitud</Button>
      </form>
    </motion.div>
  );
};

export default VacationRequestForm;
