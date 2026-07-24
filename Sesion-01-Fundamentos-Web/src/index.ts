/**
 * Estructura que representa las partes desglosadas de una URL analizada.
 */
export interface UrlParts {
  /** Protocolo de la URL (ej. "https:", "http:") */
  protocol: string;
  /** Host o dominio de la URL (ej. "api.ejemplo.com") */
  host: string;
  /** Ruta o pathname de la URL (ej. "/users") */
  pathname: string;
  /** Cadena completa de parámetros de búsqueda (ej. "?id=1&name=Ana") */
  search: string;
  /** Arreglo bidimensional que contiene las llaves y valores de los parámetros query */
  query: Array<[string, string]>;
}

/**
 * Categorías estándar para clasificar los códigos de estado HTTP.
 */
export type StatusCategory =
  | "1xx Informativo"
  | "2xx Éxito"
  | "3xx Redirección"
  | "4xx Error del cliente"
  | "5xx Error del servidor"
  | "Desconocido";

/**
 * Objeto que representa las cabeceras HTTP en formato clave-valor.
 */
export type Headers = Record<string, string>;

/**
 * Analiza una URL y extrae sus componentes principales utilizando la API nativa de JavaScript.
 * 
 * @param url - La cadena de texto de la URL que se desea analizar.
 * @returns Un objeto de tipo {@link UrlParts} con las partes desglosadas de la URL.
 * @throws Lanzará un error si la cadena proporcionada no es una URL válida.
 * 
 * @example
 * ```ts
 * const parts = parseUrl("[https://api.ejemplo.com/users?id=1](https://api.ejemplo.com/users?id=1)");
 * ```
 */
export function parseUrl(url: string): UrlParts {
  const u = new URL(url);
  const query: Array<[string, string]> = [];
  u.searchParams.forEach((value, key) => query.push([key, value]));

  return {
    protocol: u.protocol,
    host: u.host,
    pathname: u.pathname,
    search: u.search,
    query: query,
  };
}

/**
 * Clasifica un código de estado numérico HTTP en su categoría descriptiva correspondiente.
 * 
 * @param status - El código de estado numérico de la respuesta HTTP (ej. 200, 404, 500).
 * @returns Una cadena de tipo {@link StatusCategory} que describe el rango del código.
 * 
 * @example
 * ```ts
 * const categoria = classifyStatus(404); // Retorna "4xx Error del cliente"
 * ```
 */
export function classifyStatus(status: number): StatusCategory {
  if (status >= 100 && status < 200) return "1xx Informativo";
  if (status >= 200 && status < 300) return "2xx Éxito";
  if (status >= 300 && status < 400) return "3xx Redirección";
  if (status >= 400 && status < 500) return "4xx Error del cliente";
  if (status >= 500 && status < 600) return "5xx Error del servidor";
  return "Desconocido";
}

/**
 * Parsea un texto plano que contiene líneas de cabeceras HTTP a un objeto estructurado.
 * 
 * @param text - Las líneas de cabeceras en formato "Nombre: valor" separadas por saltos de línea o comas.
 * @returns Un objeto de tipo {@link Headers} con las cabeceras limpias.
 * 
 * @example
 * ```ts
 * const headers = parseHeaders("Content-Type: application/json\nAuthorization: Bearer abc");
 * ```
 */
export function parseHeaders(text: string): Headers {
  const headers: Headers = {};
  if (!text) return headers;
  
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\n/g, ",");

  normalizedText.split(",").forEach((line) => {
    const [key, ...value] = line.split(":");
    if (key && value.length > 0) {
      headers[key.trim()] = value.join(":").trim();
    }
  });
  return headers;
}

/**
 * Combina las funciones de análisis de URL, clasificación de estado y parseo de cabeceras 
 * para generar un resumen textual legible de una petición HTTP.
 * 
 * @param url - La URL a la que se realizó la petición.
 * @param status - El código de estado numérico obtenido.
 * @param headersText - El texto plano de las cabeceras devueltas.
 * @returns Un texto formateado con el resumen de la petición.
 * 
 * @example
 * ```ts
 * const resumen = summarizeRequest("[https://api.ejemplo.com/users](https://api.ejemplo.com/users)", 200, "Content-Type: application/json");
 * ```
 */
export function summarizeRequest(url: string, status: number, headersText: string): string {
  const parts = parseUrl(url);
  const cat = classifyStatus(status);
  const headers = parseHeaders(headersText);
  
  return `Petición a ${parts.host}${parts.pathname} resultó en ${status} (${cat}) con ${Object.keys(headers).length} headers.`;
}