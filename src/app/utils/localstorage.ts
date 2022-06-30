import { Component, Injectable, OnDestroy } from "@angular/core";
import { EventEmitterService } from "../services/event-emitter.service";

@Injectable()
export class LocalStorageUtils implements OnDestroy{
    public eventoAdministradoraChange: any = null;
    public eventoCotaChange: any = null;
    
    constructor(){
        this.eventoAdministradoraChange = EventEmitterService.get("nomeAdministradoraChange");
        this.eventoCotaChange = EventEmitterService.get("consorcioChange");
    }

    ngOnDestroy(){
        this.eventoAdministradoraChange.unsubscribe();
        this.eventoCotaChange.unsubscribe();
    }

    public salvarCliente(nome: string, clienteID: number)
    {
        localStorage.setItem('nome',nome);
        localStorage.setItem('id',clienteID.toString());
    }
    public obterNomeCliente(){
       
        return localStorage.getItem('nome');
     }
     public obterIdCliente(){
       
        return parseInt(localStorage.getItem('id'));
     }  

     public salvarAdministradora(nome: string, AdministradoraId: number){
         localStorage.setItem('nomeAdministradora', nome);
         localStorage.setItem('idAdministradora', AdministradoraId.toString());
         
         this.eventoAdministradoraChange.emit(nome);
     }
     public obterNomeAdministradora(){
         return localStorage.getItem("nomeAdministradora");
     }
    public obterIdAdministradora(){
        return parseInt(localStorage.getItem("idAdministradora"));
    }

    public salvarCota(consorcioId: number, grupo: string, cota: string){
        localStorage.setItem('consorcioId', consorcioId.toString());
        localStorage.setItem('grupo', grupo);
        localStorage.setItem('cota', cota);
         
        this.eventoCotaChange.emit({consorcioId: consorcioId, grupo: grupo, cota: cota});
    }
    public obterConsorcioId(){
        return localStorage.getItem('consorcioId');
    }
    public obterGrupo(){
        return localStorage.getItem('grupo');
    }
    public obterCota(){
        return localStorage.getItem('cota');
    }

    public obterusuario()
    {
        return JSON.parse(localStorage.getItem('usuario'));
    }
    public salvarTokenUsuario(token: string)
    {
        localStorage.setItem('tokem',token);
    }
    public obterTokenUsuario(){
       
       return localStorage.getItem('tokem');
    }
    public salvarDadosLocaisUsuario(usuario:any)
    {        
        localStorage.setItem('usuario',JSON.stringify(usuario));
    } 
    public salvarQuantidadeAdministradoras(quantidade: number){
        localStorage.setItem('qtdeAdministradoras', quantidade.toString());
    }
    public obterQuantidadeAdministradoras(){
       
       return parseInt(localStorage.getItem('qtdeAdministradoras'));
    }

    public clear(){
        localStorage.clear();
    }
}