import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import localeEsAr from '@angular/common/locales/es-AR';

registerLocaleData(localeEsAr, 'es-AR');

@NgModule({
  imports: [QuillModule.forRoot()],
  providers: [{ provide: LOCALE_ID, useValue: 'es-AR' }],
})
export class AppModule {}
