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
 */
export async function getVacations(currentUserId, sucursal) {
  let q;
  if (currentUserId === "ADMIN001") {
    q = query(collection(db, "vacationRequests")); // todas las solicitudes
  } else {
    q = query(collection(db, "vacationRequests"), where("branch", "==", sucursal));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

/**
 * Guardar una nueva solicitud de vacaciones
 */
export async function requestVacation(userId, sucursal, startDate, endDate) {
  const requestedDays = getDateRange(startDate, endDate);

  await addDoc(collection(db, "vacationRequests"), {
    employeeId: userId,
    sucursal,
    days: requestedDays,
    createdAt: new Date(),
    status: "approved",
  });

  await updateRemainingDays(userId, requestedDays.length);
}

/**
 * Actualizar los días restantes de un empleado
 */
export async function updateRemainingDays(userId, requestedDaysCount) {
  const userRef = doc(db, "empleados", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    const diasRestantesActuales = data.diasRestantes ?? 10;
    const nuevosDiasRestantes = diasRestantesActuales - requestedDaysCount;

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
