import { useEffect, useState } from "react";
import { getVacations } from "@/services/vacaciones";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

function AdminPage({ currentUserId, sucursal }) {
  const [vacaciones, setVacaciones] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // 🔥 Obtener solicitudes desde vacationRequests
        const data = await getVacations(currentUserId, sucursal);

        // 🔥 Enriquecer cada solicitud con los días restantes del empleado
        const enrichedData = await Promise.all(
          data.map(async v => {
            const empleadoRef = doc(db, "empleados", v.employeeId);
            const empleadoSnap = await getDoc(empleadoRef);
            const diasRestantes = empleadoSnap.exists()
              ? empleadoSnap.data().diasRestantes
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
              <th>Empleado</th>
              <th>Sucursal</th>
              <th>Departamento</th>
              <th>Días solicitados</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Estado</th>
              <th>Días restantes</th>
            </tr>
          </thead>
          <tbody>
            {vacaciones.map((v, i) => (
              <tr key={i}>
                <td>{v.employeeName}</td>
                <td>{v.branch}</td>
                <td>{v.department}</td>
                <td>{v.dates?.join(", ")}</td>
                <td>{v.startDate}</td>
                <td>{v.endDate}</td>
                <td>{v.status}</td>
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
