import { Component, OnInit } from '@angular/core';
import { AcordoService } from '../../services/acordo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageUtils } from '../../../../src/app/utils/localstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debitos2',
  templateUrl: './debitos2.component.html',
  styleUrls: ['./debitos2.component.css']
})
export class Debitos2Component implements OnInit {
  public clienteId: number = 0;
  public administradoraId: number = 0;
  public mensagemSpinner: string = "";
  public loading: boolean = false;
  public listaConsorcios: any[] =[];
  public listaDebitos: any[] =[];
  public localStorage = new LocalStorageUtils();
  public erro: string = "";
  public cotaEscolhida: boolean = false;
  public dataHoraAtual: Date;
  public consorcioId: number;
  public listaContatos: any[] = [];
  public qtdeAdministradoras: number;
  public administradoraSelecionada: boolean = false;

  constructor(private acordoService: AcordoService,
      private spinner: NgxSpinnerService,
      private router: Router) { }

  ngOnInit(): void {
    this.clienteId = this.localStorage.obterIdCliente();
    this.administradoraId = this.localStorage.obterIdAdministradora();
    this.qtdeAdministradoras = this.localStorage.obterQuantidadeAdministradoras();
    this.administradoraSelecionada = this.administradoraId >0;
    
    this.obterCotas();
  }

  mostrarSpinner(mostrar: boolean, mensagem: string){
    if (mostrar){
      this.mensagemSpinner = mensagem;
      this.spinner.show();
    }
    else
      this.spinner.hide();

    this.loading = mostrar;
  }

  obterCotas(){
    this.mostrarSpinner(true, 'Aguarde, consultando suas cotas...');

    this.acordoService.GetClienteConsorcios(this.clienteId, this.administradoraId)
    .subscribe(
      sucesso => {this.processarSucessoObterCotas(sucesso)},
      falha => this.processarFalhaObterCotas(falha)
    );
  }
  
  processarSucessoObterCotas(response: any){
    this.mostrarSpinner(false, '');

    if (response.success){
      this.listaConsorcios = response.data.cliente.listaConsorcio;
      this.listaContatos = response.data.cliente.contatos;

      if (this.listaConsorcios.length == 0){
        this.router.navigate(['/login']);
        return;
      }
      
      let lista = [];
      this.listaConsorcios.forEach(c=>{        
        if (lista.findIndex(i=>i.consorcioID == c.consorcioID) < 0){
          lista.push(c);
        }
      });
      this.listaConsorcios = lista;
      
      if(this.listaConsorcios.length <= 5){
        this.listaConsorcios.forEach(c=>{        
          this.obterDebitosAtualizados(c.consorcioID);
        });
      }
      else{
        this.erro = "Prezado(a) Cliente, temos uma negociação especial separada para Sr(a). exclusivamente por meio do nosso " + this.obterTelefone() + ". Nossos analistas estão te aguardando."
      }
    }
    else{
      this.erro = "Erro na consulta do cadastro";
    }
  }

  obterTelefone(){
    let telefone="";
    if (this.listaContatos != null && this.listaContatos.length>0){
      this.listaContatos.forEach(c=>{
        if (c.tipo != "WhatsApp"){
          telefone += "<b>" + c.valor + "</b>";
          if(this.listaContatos.length>2)
            telefone+=", ";
        }
        else{
          telefone += "ou se preferir clique nesse <a href='https://api.whatsapp.com/send?phone=" + c.valor + "&text=Ol%C3%A1!%20Quero%20atualizar%20o%20meu%20cadastro.' target='_blank'>link</a> e fale por meio do WhatsApp ";
        }
      });
    }
    else
      telefone="(11) 3508-3000";

    return telefone;
  }

  processarFalhaObterCotas(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta do cadastro";
  }
  
  obterDebitosAtualizados(consorcioId: number){
    this.mostrarSpinner(true, 'Aguarde, consultando os débitos...');

    this.acordoService.GerarOpcoesAcordo(consorcioId, this.administradoraId)
    .subscribe(
      sucesso => {this.processarSucessoObterDebitos(sucesso)},
      falha => this.processarFalhaObterDebitos(falha)
    );
  }
  
  processarSucessoObterDebitos(response: any){
    this.mostrarSpinner(false, '');
    this.dataHoraAtual = new Date();
    this.cotaEscolhida = true;
    
    if (response.success){
      if (this.listaConsorcios.length == 0){
        this.router.navigate(['/login']);
        return;
      }

      this.listaConsorcios.forEach(c=>{
        if (c.consorcioID == response.data.consorcio.consorcioID){
          c.debitosAtualizados = response.data.debitosAtualizados;
        }
      });

    }
    else{
      //debugger;
      this.erro = "Erro na consulta dos débitos";
    }
  }

  processarFalhaObterDebitos(response: any){
    //debugger;
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta dos débitos";
  }

  alterarAdministradora(){
    this.router.navigate(['/administradoras']);
  }

  realizarNovoAcordo(){
    this.router.navigate(['./novo-acordo']);
  }

  visualizarAcordos(){
    this.router.navigate(['/acordos']);
  }
}
