import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const VacationCalendar = ({ user }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [branchRequests, setBranchRequests] = useState([]);

  // Rango válido: 16 Ene 2026 – 15 Ene 2027
  const monthsData = [
    { name: 'Enero', year: 2026, days: 31, validStart: 16 },
    { name: 'Febrero', year: 2026, days: 28 },
    { name: 'Marzo', year: 2026, days: 31 },
    { name: 'Abril', year: 2026, days: 30 },
    { name: 'Mayo', year: 2026, days: 31 },
    { name: 'Junio', year: 2026, days: 30 },
    { name: 'Julio', year: 2026, days: 31 },
    { name: 'Agosto', year: 2026, days: 31 },
    { name: 'Septiembre', year: 2026, days: 30 },
    { name: 'Octubre', year: 2026, days: 31 },
    { name: 'Noviembre', year: 2026, days: 30 },
    { name: 'Diciembre', year: 2026, days: 31 },
    { name: 'Enero', year: 2027, days: 15, validEnd: 15 }
  ];

  // 🔎 Escuchar solicitudes en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, 'vacationRequests'), where('branch', '==', user.branch));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => doc.data());
      setBranchRequests(requests);

      const userRequest = requests.find(req => req.employeeId === user.id);
      if (userRequest) setSelectedDates(userRequest.dates);
    });

    return () => unsubscribe(); // limpiar listener al desmontar
  }, [user.id, user.branch]);

  const isDateUnavailable = (date) => {
    return branchRequests.some(req =>
      req.employeeId !== user.id &&
      req.status === 'approved' &&
      req.dates.includes(date)
    );
  };

  const getDaysInMonth = (monthIndex) => {
    const days = [];
    const month = monthsData[monthIndex];
    const realMonth = monthIndex + 1; // simplificado

    for (let i = 1; i <= month.days; i++) {
      let isValidDay = true;
      if (monthIndex === 0 && i < 16) isValidDay = false; // antes del 16 Ene 2026
      if (monthIndex === 12 && i > 15) isValidDay = false; // después del 15 Ene 2027

      const formattedDateStr = `${month.year}-${String(realMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

      days.push({
        day: i,
        date: formattedDateStr,
        isSelected: selectedDates.includes(formattedDateStr),
        isUnavailable: isDateUnavailable(formattedDateStr),
        isValid: isValidDay
      });
    }
    return days;
  };

  const nextMonth = () => {
    if (currentMonthIndex < monthsData.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const days = getDaysInMonth(currentMonthIndex);
  const currentMonthData = monthsData[currentMonthIndex];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Calendario de Vacaciones
          </h2>
          <div className="text-sm text-gray-500 mt-1 space-x-2">
            <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">P1: 16 Ene 26 - 15 Jun 26</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-purple-700">P2: 16 Jun 26 - 15 Ene 27</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
        <Button onClick={prevMonth} disabled={currentMonthIndex === 0} variant="outline" size="sm">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-xl font-bold text-gray-800">
          {currentMonthData.name} <span className="text-blue-600">{currentMonthData.year}</span>
        </h3>
        <Button onClick={nextMonth} disabled={currentMonthIndex === monthsData.length - 1} variant="outline" size="sm">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-bold text-gray-400 text-xs uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
        {days.map((dayInfo, index) => (
          <motion.div
            key={`${dayInfo.date}-${index}`}
            whileHover={dayInfo.isValid ? { scale: 1.05 } : {}}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-sm font-medium
              transition-all duration-200 cursor-default border
              ${!dayInfo.isValid 
                ? 'bg-gray-100 text-gray-300 border-transparent' 
                : dayInfo.isSelected 
                  ? 'bg-green-500 text-white shadow-md border-green-600' 
                  : dayInfo.isUnavailable
                    ? 'bg-red-50 text-red-400 border-red-100 relative overflow-hidden'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-100'
              }
            `}
          >
            {dayInfo.isUnavailable && dayInfo.isValid && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-full h-0.5 bg-red-400 rotate-45 transform"></div>
              </div>
            )}
            {dayInfo.day}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-gray-600">Mis fechas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-50 border border-red-100 rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-full h-0.5 bg-red-400 rotate-45 transform"></div>
            </div>
          </div>
          <span className="text-gray-600">Ocupado (Mi Sucursal)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white border border-gray-200 rounded-sm"></div>
          <span className="text-gray-600">Disponible</span>
        </div>
      </div>
    </div>
  );
};

export default VacationCalendar;
