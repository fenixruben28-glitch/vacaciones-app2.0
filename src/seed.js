import { db } from "./firebaseNode.js";
import { collection, addDoc } from "firebase/firestore";

async function seedEmployees() {
  await addDoc(collection(db, "empleados"), {
    nombre: "Juan Pérez",
    diasRestantes: 10,
  });
  console.log("Empleado insertado");
}

seedEmployees();

