import { AcordoService } from './services/acordo.service';
import { LoaderInterceptor } from './services/loader.interceptor';

import { routes } from './app-routing';

import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar.component';
import localePt from '@angular/common/locales/pt';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AcessoLayoutComponent } from './layout/acesso-layout/acesso-layout.component';
import { ToastrModule } from "ngx-toastr";
import { LayoutLogadoComponent } from './layout/layout-logado/layout-logado.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Permissao } from './guard/permissao';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion'

import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { AcessoLayoutModule } from './layout/acesso-layout/acesso-layout.module';
import { LayoutLogadoModule } from './layout//layout-logado/layout-logado.module';

registerLocaleData(ptBr);

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LayoutLogadoComponent,
    AcessoLayoutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
      
    }),
    NgbModule,
    NgxMaskModule.forRoot(maskConfig),
    ToastrModule.forRoot(),
    HttpClientModule, BrowserAnimationsModule,
    AccordionModule.forRoot(),
    AcessoLayoutModule,
    LayoutLogadoModule
  ],
  providers: [
    AcordoService,
    Permissao,
    {provide: LOCALE_ID, useValue: 'pt'},
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    {provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
