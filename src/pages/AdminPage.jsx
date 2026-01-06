import { useEffect, useState } from "react";
import { getVacations } from "@/services/vacaciones";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

function AdminPage({ currentUserId, sucursal }) {
  const [vacaciones, setVacaciones] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getVacations(currentUserId, sucursal);

        // Enriquecer cada solicitud con los días restantes del usuario
        const enrichedData = await Promise.all(
          data.map(async v => {
            const userRef = doc(db, "usuarios", v.userId);
            const userSnap = await getDoc(userRef);
            const diasRestantes = userSnap.exists()
              ? userSnap.data().diasRestantes
              : "N/A";
            return { ...v, diasRestantes };
          })
        );

        setVacaciones(enrichedData);
      } catch (error) {
        console.error("❌ Error al cargar solicitudes:", error);
      }
    }
    fetchData();
  }, [currentUserId, sucursal]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Solicitudes de vacaciones</h2>
      {vacaciones.length === 0 ? (
        <p>No hay solicitudes registradas.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "10px", width: "100%" }}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Sucursal</th>
              <th>Días solicitados</th>
              <th>Fecha de solicitud</th>
              <th>Días restantes</th>
            </tr>
          </thead>
          <tbody>
            {vacaciones.map((v, i) => (
              <tr key={i}>
                <td>{v.userId}</td>
                <td>{v.sucursal}</td>
                <td>{v.days?.join(", ")}</td>
                <td>
                  {v.createdAt
                    ? new Date(v.createdAt.seconds * 1000).toLocaleDateString()
                    : "-"}
                </td>
                <td>{v.diasRestantes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;
