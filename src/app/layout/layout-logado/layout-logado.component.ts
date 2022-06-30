 
import { Component, OnInit } from '@angular/core';
import { LocalStorageUtils } from '../../../app/utils/localstorage';
import { EventEmitterService } from "./../../services/event-emitter.service";

@Component({
  selector: 'app-layout-logado',
  templateUrl: './layout-logado.component.html',
  styleUrls: ['../../pages/css/styles-logged.css']
})
export class LayoutLogadoComponent implements OnInit {
  public nomeCliente: string = "";
  public localStorage = new LocalStorageUtils();
  public nomeAdministradora: string = "";
  public grupo: string = "";
  public cota: string = "";
  public eventoAdministradora: any;
  public eventoCota: any;
  
    constructor(){
      this.nomeCliente = this.localStorage.obterNomeCliente();
      this.nomeAdministradora = this.localStorage.obterNomeAdministradora();
      this.grupo = this.localStorage.obterCota();
      this.cota = this.localStorage.obterCota();
      
      this.eventoAdministradora = EventEmitterService.get('nomeAdministradoraChange').subscribe(data => this.nomeAdministradora = data);
      
      this.eventoCota = EventEmitterService.get('consorcioChange').subscribe(data => {
        this.grupo = data.grupo,
        this.cota = data.cota
      });
    }

    ngOnDestroy(){
      this.eventoAdministradora.unsubscribe();
      this.eventoCota.unsubscribe();
    }

    ngOnInit() {
    }

    logoff(){
      this.localStorage.clear();
    }
}