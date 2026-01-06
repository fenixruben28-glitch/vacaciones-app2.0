import { db } from './firebase.js';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * Agregar un nuevo empleado
 */
export const agregarEmpleado = async (empleado) => {
  try {
    await setDoc(doc(db, "empleados", empleado.id), empleado);
    console.log(`✅ Empleado ${empleado.id} agregado`);
  } catch (error) {
    console.error("❌ Error al agregar empleado:", error);
  }
};

/**
 * Actualizar datos de un empleado existente
 */
export const actualizarEmpleado = async (id, cambios) => {
  try {
    const ref = doc(db, "empleados", id);
    await updateDoc(ref, cambios);
    console.log(`✅ Empleado ${id} actualizado`);
  } catch (error) {
    console.error("❌ Error al actualizar empleado:", error);
  }
};

/**
 * Eliminar un empleado
 */
export const eliminarEmpleado = async (id) => {
  try {
    await deleteDoc(doc(db, "empleados", id));
    console.log(`🗑️ Empleado ${id} eliminado`);
  } catch (error) {
    console.error("❌ Error al eliminar empleado:", error);
  }
};

// Ejemplo de uso
const run = async () => {
  // 1. Agregar un nuevo empleado
  await agregarEmpleado({
    id: "emp010",
    nombre: "Nuevo Empleado",
    rol: "Analista",
    vacacionesDisponibles: 15
  });

  // 2. Actualizar un empleado existente
  await actualizarEmpleado("emp001", { rol: "Gerente", vacacionesDisponibles: 20 });

  // 3. Eliminar un empleado
  await eliminarEmpleado("emp002");

  console.log("✅ Operaciones de mantenimiento terminadas");
  process.exit(0);
};

run();
