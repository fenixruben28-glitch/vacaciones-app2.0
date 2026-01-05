// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que vas a usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export { serverTimestamp };

// Función opcional para iniciar sesión con ID de empleado
export async function loginWithEmployeeId(employeeId, fetchEmployee) {
  await signInAnonymously(auth);
  const user = await fetchEmployee(employeeId); // busca en la colección "employees"
  return user || null;
}
