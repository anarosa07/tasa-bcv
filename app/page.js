"use client";
import { useState, useEffect } from "react";

export default function BCVCalculator() {
  const [tasaUSD, setTasaUSD] = useState(null);
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [unidades, setUnidades] = useState(30);

  
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

  const handlePrint = () => {
    window.print();
  };

  const calcular = (i) => {
    if (!tasaUSD) return "-";
    return (i * tasaUSD).toFixed(2);
  };

  
  const columnas = 3;
  const filas = Math.ceil(unidades / columnas);
  const columnasDatos = Array.from({ length: columnas }, (_, col) =>
    Array.from({ length: filas }, (_, fila) => {
      const num = fila + 1 + col * filas;
      return num <= unidades ? num : null;
    }).filter(Boolean)
  );

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
      className="print-container"
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        color: "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {/* ENCABEZADO */}
      <div
        className="print-header"
        style={{
          textAlign: "center",
          paddingBottom: "10px",
          marginBottom: "10px",
          width: "100%",
          maxWidth: "1000px",
          boxSizing: "border-box",
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

        {/* BOTONES (no se imprimen) */}
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

      {/* CUERPO EN 3 COLUMNAS */}
      <div
        className="print-columns"
        style={{
          display: "flex",
          gap: "24px", 
          justifyContent: "center",
          alignItems: "flex-start",
          fontSize: "34px",
          fontWeight: "bold",
          lineHeight: "1.8",
          color: "#000",
          width: "100%",
          boxSizing: "border-box",
          maxWidth: "1000px",
        }}
      >
        {columnasDatos.map((col, colIndex) => (
          <div
            key={colIndex}
            style={{
              flex: "1 1 0",
              minWidth: "120px", 
              textAlign: "center",
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

      {/* ESTILOS DE IMPRESIÓN */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }

         
          @page {
            size: auto;
            margin: 8mm;
          }

         
          .print-container {
            min-height: 100vh;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 8mm !important;
            box-sizing: border-box;
            background: #fff;
          }

         
          .print-header {
            width: 100%;
            max-width: 1000px;
            box-sizing: border-box;
            text-align: center;
            margin-bottom: 8mm;
          }

         
          .print-columns {
            display: flex;
            gap: 18mm;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            max-width: 1000px;
            box-sizing: border-box;
            font-size: 32px;
            line-height: 1.6;
          }
          .print-columns > div {
            flex: 1 1 0;
            min-width: 110px;
            box-sizing: border-box;
          }

         
          html,
          body {
            background: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }

         
          .print-columns > div {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
