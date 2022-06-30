 
import { Routes, RouterModule } from '@angular/router';
import { AcessoLayoutComponent } from './layout/acesso-layout/acesso-layout.component';
import { IdentificadorComponent } from './pages/identificador/identificador.component' ;
import { Administradoras2Component } from './pages/administradoras2/administradoras2.component';
import { LayoutLogadoComponent } from './layout/layout-logado/layout-logado.component';
import { Debitos2Component } from './pages/debitos2/debitos2.component';
import { NovoAcordoComponent } from './pages/novo-acordo/novo-acordo.component';
import { AcordosComponent } from './pages/acordos/acordos.component';

export const routes = [
  {path : '', redirectTo: 'login', pathMatch: 'full' } ,
  {path : 'login', component: AcessoLayoutComponent, children: [{ path: '', component: IdentificadorComponent }] } ,
  {path : 'administradoras', component: LayoutLogadoComponent, children: [{ path: '', component: Administradoras2Component }] } ,
  {path : 'debitos', component: LayoutLogadoComponent, children: [{ path: '', component: Debitos2Component }] } ,
  {path : 'novo-acordo', component: LayoutLogadoComponent, children: [{ path: '', component: NovoAcordoComponent }] } ,
  {path : 'acordos', component: LayoutLogadoComponent, children: [{ path: '', component: AcordosComponent }] } ,
 ]