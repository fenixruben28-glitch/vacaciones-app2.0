import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

export async function getVacations(currentUserId, sucursal) {
  let q;
  if (currentUserId === "admin001") {
    q = query(collection(db, "vacaciones")); // todas las solicitudes
  } else {
    q = query(collection(db, "vacaciones"), where("sucursal", "==", sucursal));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}
