import { useEffect, useState } from "react";
import { getVacations } from "@/services/vacaciones";

function AdminPage({ currentUserId, sucursal }) {
  const [vacaciones, setVacaciones] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getVacations(currentUserId, sucursal);
        setVacaciones(data);
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
      }
    }
    fetchData();
  }, [currentUserId, sucursal]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Solicitudes de vacaciones</h2>
      {vacaciones.length === 0 ? (
        <p>No hay solicitudes registradas.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Sucursal</th>
              <th>Días solicitados</th>
              <th>Fecha de solicitud</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;
