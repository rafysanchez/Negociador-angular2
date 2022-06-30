import { LogadoRoutes } from './layout-logado.routing';
 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
  
import { NgxSpinnerModule } from 'ngx-spinner'; 

import { Administradoras2Component } from '../../pages/administradoras2/administradoras2.component';
import { TabsComponent } from '../../shared/tabs/tabs.component';
import { TabComponent } from '../../shared/tabs/tab.component';
import { NovoAcordoComponent } from '../../pages/novo-acordo/novo-acordo.component';
import { Debitos2Component } from '../../pages/debitos2/debitos2.component';
import { DebitosDetalhes2Component } from '../../pages/debitos2/debitos-detalhes2/debitos-detalhes2.component';
import { PropostasComponent } from '../../pages/novo-acordo/propostas/propostas.component';
import { AcordosComponent } from '../../pages/acordos/acordos.component';
import { AcordoDetalhesComponent } from '../../pages/acordos/acordo-detalhes/acordo-detalhes.component';
  
@NgModule({
  declarations: [     
    PropostasComponent,
    Administradoras2Component,
    TabsComponent,
    TabComponent,
    NovoAcordoComponent,
    Debitos2Component,
    DebitosDetalhes2Component,
    PropostasComponent,
    AcordosComponent,
    AcordoDetalhesComponent
  ],
    imports: [
      CommonModule,
      RouterModule.forChild(LogadoRoutes),
      NgxMaskModule.forChild(),
      ReactiveFormsModule, 
      FormsModule, 
      NgbModule ,
      NgxSpinnerModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
      DebitosDetalhes2Component
    ]
})

export class LayoutLogadoModule {}