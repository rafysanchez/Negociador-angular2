import { NegociadorComponent } from './../../pages/negociador/negociador.component';
 

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AcessoRoutes } from './acesso-layout.routing';
 
import { NgxSpinnerModule } from 'ngx-spinner';
import { IdentificadorComponent } from '../../pages/identificador/identificador.component';
import { ComunicacaoComponent } from '../../pages/comunicacao/comunicacao.component';
import { ClipboardModule } from 'ngx-clipboard';
  
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(AcessoRoutes),
      NgxMaskModule.forChild(),
      ReactiveFormsModule, 
      FormsModule, 
      NgbModule ,
      NgxSpinnerModule,
      ClipboardModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
      IdentificadorComponent,
      ComunicacaoComponent,
      NegociadorComponent
    ]
})

export class AcessoLayoutModule {}