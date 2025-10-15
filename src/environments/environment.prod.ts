// Este archivo se usa para producción
export const environment = {
  production: true,
  geminiApiKey: '${VERCEL_GEMINI_API_KEY}' // Esta variable será reemplazada en build time
};