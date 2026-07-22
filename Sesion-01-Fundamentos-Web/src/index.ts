export interface UrlParts {
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  query: Array<[string, string]>;
}

export type StatusCategory =
  | "1xx Informativo"
  | "2xx Éxito"
  | "3xx Redirección"
  | "4xx Error del cliente"
  | "5xx Error del servidor"
  | "Desconocido";

export type Headers = Record<string, string>;

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

export function classifyStatus(status: number): StatusCategory {
  if (status >= 100 && status < 200) return "1xx Informativo";
  if (status >= 200 && status < 300) return "2xx Éxito";
  if (status >= 300 && status < 400) return "3xx Redirección";
  if (status >= 400 && status < 500) return "4xx Error del cliente";
  if (status >= 500 && status < 600) return "5xx Error del servidor";
  return "Desconocido";
}

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

export function summarizeRequest(url: string, status: number, headersText: string): string {
  const parts = parseUrl(url);
  const cat = classifyStatus(status);
  const headers = parseHeaders(headersText);
  
  return `Petición a ${parts.host}${parts.pathname} resultó en ${status} (${cat}) con ${Object.keys(headers).length} headers.`;
}