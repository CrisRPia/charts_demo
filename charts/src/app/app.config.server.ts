import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideCharts(withDefaultRegisterables())
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
