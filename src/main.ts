import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);


bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
}).catch((err) => console.error(err));
