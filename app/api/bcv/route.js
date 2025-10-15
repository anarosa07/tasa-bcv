import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    const { data: html } = await axios.get("https://www.bcv.org.ve/", {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(html);
    let tasaUSD = null;
    let fecha = "";

    $(".recuadrotsmc").each((_, el) => {
      const nombre = $(el).find("span").first().text().trim();
      const valor = $(el).find("strong").text().trim();
      
      if (nombre.includes("USD") || nombre.includes("Dólar")) {
        const valorLimpio = valor.replace(/\./g, "").replace(",", ".");
        tasaUSD = parseFloat(valorLimpio);
      }
    });

    fecha = $(".pull-right.dinpro.center .date-display-single").text().trim();
    
    if (!fecha) {
      fecha = $(".date-display-single").first().text().trim();
    }

    if (!tasaUSD) {
      throw new Error("No se pudo encontrar la tasa USD");
    }

    return NextResponse.json({
      tasaUSD: parseFloat(tasaUSD.toFixed(2)),
      fecha: fecha || new Date().toLocaleDateString('es-ES')
    });

  } catch (err) {
    console.error("Error al obtener datos del BCV:", err.message);
    return NextResponse.json(
      { error: "Error al obtener datos del BCV: " + err.message },
      { status: 500 }
    );
  }
}
