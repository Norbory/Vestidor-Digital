// Este archivo se usa para producción
declare const process: any;

export const environment = {
  production: true,
  geminiApiKey: (typeof process !== 'undefined' && process.env) ? process.env['NG_APP_GEMINI_API_KEY'] || '' : ''
};