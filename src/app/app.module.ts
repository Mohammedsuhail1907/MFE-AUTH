import { inject, NgModule, provideAppInitializer  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { InitService } from './core/services/init.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { provideNgxWebstorage, withSessionStorage } from 'ngx-webstorage';

declare let __webpack_public_path__: string;

export function init_app(): Promise<void>{
    const appInitService = inject(InitService);
    return appInitService.init();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `${__webpack_public_path__}assets/i18n/`, '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    })
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    provideAppInitializer(init_app),
    provideHttpClient(),
    provideNgxWebstorage(
      withSessionStorage()
    ),
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
