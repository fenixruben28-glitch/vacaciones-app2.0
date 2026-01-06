import { db } from '../firebase.js';
import { employeeData } from '../data/employeeData.js';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Inserta todos los empleados de employeeData en la colección "empleados".
 * Se recomienda ejecutar esta función solo una vez para poblar Firestore.
 */
export const seedEmployees = async () => {
  try {
    for (const emp of employeeData) {
      await setDoc(doc(db, "empleados", emp.id), emp);
    }
    console.log("✅ Empleados insertados correctamente en Firestore");
  } catch (error) {
    console.error("❌ Error al insertar empleados:", error);
  }
};

