import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context?: any) => {
  if (context) {
    // Para SSR con contexto
    return bootstrapApplication(AppComponent, {
      ...config,
      providers: [
        ...config.providers || [],
      ]
    });
  }
  return bootstrapApplication(AppComponent, config);
};

export default bootstrap;
