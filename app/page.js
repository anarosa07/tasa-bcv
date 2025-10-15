"use client";
import { useState, useEffect } from "react";

export default function BCVCalculator() {
  const [tasaUSD, setTasaUSD] = useState(null);
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [unidades, setUnidades] = useState(30);

  // 🔹 Cargar datos BCV
  const cargarDatos = async (isInitial = false) => {
    if (!isInitial) setUpdating(true);
    try {
      const response = await fetch("/api/bcv");
      const data = await response.json();
      setTasaUSD(Number(data.tasaUSD) || 0);
      setFecha(data.fecha || "");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar datos del BCV");
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  useEffect(() => {
    cargarDatos(true);
  }, []);

  // 🔹 Imprimir sin encabezado/pie de navegador
  const handlePrint = () => {
    const style = document.createElement("style");
    style.media = "print";
    style.innerHTML = `
      @page {
        size: auto;
        margin: 8mm;
      }
      body::before, body::after {
        display: none !important;
        content: none !important;
      }
    `;
    document.head.appendChild(style);
    window.print();
  };

  const calcular = (i) => {
    if (!tasaUSD) return "-";
    return (i * tasaUSD).toFixed(2);
  };

  // 🔹 Crear 3 columnas verticales
  const columnas = 3;
  const filas = Math.ceil(unidades / columnas);
  const columnasDatos = Array.from({ length: columnas }, (_, col) =>
    Array.from({ length: filas }, (_, fila) => {
      const num = fila + 1 + col * filas;
      return num <= unidades ? num : null;
    }).filter(Boolean)
  );

  // 🔹 Mostrar spinner antes de renderizar contenido
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #4CAF50",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ marginTop: "20px", fontSize: "22px" }}>Cargando datos...</p>

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      {/* ENCABEZADO */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: "10px",
          marginBottom: "10px",
        }}
      >
        <p style={{ fontSize: "34px", margin: "10px 0" }}>
          <strong>Tasa BCV:</strong>{" "}
          <span style={{ fontWeight: "bold" }}>
            Bs. {tasaUSD ? tasaUSD.toFixed(2) : "—"}
          </span>
        </p>
        <p style={{ fontSize: "30px", margin: "10px 0" }}>
          <strong>Fecha:</strong> {fecha || "—"}
        </p>

        {/* BOTONES */}
        <div className="no-print" style={{ marginTop: "20px" }}>
          <button
            onClick={() => cargarDatos()}
            disabled={updating}
            style={{
              padding: "10px 20px",
              marginRight: "15px",
              cursor: updating ? "not-allowed" : "pointer",
              backgroundColor: updating ? "#e0e0e0" : "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "18px",
              color: "#000",
              transition: "all 0.3s ease",
            }}
          >
            {updating ? "Cargando..." : "Actualizar"}
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "18px",
            }}
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* CUERPO EN 3 COLUMNAS VERTICALES */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          fontSize: "34px",
          fontWeight: "bold",
          lineHeight: "1.8",
          pageBreakInside: "avoid",
          color: "#000",
        }}
      >
        {columnasDatos.map((col, colIndex) => (
          <div
            key={colIndex}
            style={{
              width: "32%",
              textAlign: "center",
              color: "#000",
            }}
          >
            {col.map((num) => (
              <div key={num}>
                {num} = {calcular(num)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ESTILOS IMPRESIÓN */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            margin: 8mm !important;
          }
        }
      `}</style>
    </div>
  );
}
