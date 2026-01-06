import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

/**
 * Obtener solicitudes de vacaciones
 * - Admin ve todas las solicitudes
 * - Empleado ve solo las de su sucursal
 */
export async function getVacations(currentUserId, sucursal) {
  let q;
  if (currentUserId === "ADMIN001") {
    q = query(collection(db, "vacationRequests")); // Admin ve todas
  } else {
    q = query(collection(db, "vacationRequests"), where("branch", "==", sucursal));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Guardar una nueva solicitud de vacaciones
 * Recomendado: usar VacationRequestForm.jsx para crear solicitudes,
 * pero esta función sirve si quieres hacerlo desde servicios.
 */
export async function requestVacation(user, startDate, endDate) {
  const dates = getDateRange(startDate, endDate);

  await addDoc(collection(db, "vacationRequests"), {
    employeeId: user.id,
    employeeName: user.name,
    position: user.position,
    branch: user.branch,
    department: user.department,
    dates,
    startDate,
    endDate,
    status: "pending", // 👈 por defecto pendiente, luego admin aprueba/rechaza
    createdAt: new Date().toISOString(),
  });

  // Actualizar días restantes
  await updateRemainingDays(user.id, dates.length);
}

/**
 * Actualizar los días restantes de un empleado
 * - Nunca baja de 0
 */
export async function updateRemainingDays(userId, requestedDaysCount) {
  const userRef = doc(db, "empleados", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    const diasRestantesActuales = typeof data.diasRestantes === 'number' ? data.diasRestantes : 10;
    const nuevosDiasRestantes = Math.max(0, diasRestantesActuales - requestedDaysCount);

    await updateDoc(userRef, {
      diasRestantes: nuevosDiasRestantes,
    });
  } else {
    console.error("❌ El documento del empleado no existe en Firestore");
  }
}

/**
 * Utilidad: generar todas las fechas entre inicio y fin
 */
function getDateRange(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
