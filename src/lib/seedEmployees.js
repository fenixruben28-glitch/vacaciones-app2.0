import { db } from '../firebase.js';
import { employeeData } from '../data/employeeData.js';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Inserta todos los empleados de employeeData en la colección "empleados".
 * Inicializa diasRestantes = 10.
 * Ejecutar una sola vez para poblar Firestore.
 */
export const seedEmployees = async () => {
  try {
    for (const emp of employeeData) {
      await setDoc(doc(db, "empleados", emp.id), {
        ...emp,
        diasRestantes: 10 // 👈 campo unificado
      });
    }
    console.log("✅ Empleados insertados correctamente en Firestore con diasRestantes=10");
  } catch (error) {
    console.error("❌ Error al insertar empleados:", error);
  }
};

