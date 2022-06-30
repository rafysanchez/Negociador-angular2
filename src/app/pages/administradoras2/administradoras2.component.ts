import { Component, OnInit } from '@angular/core';
import { AcordoService } from '../../services/acordo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageUtils } from '../../../../src/app/utils/localstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administradoras2',
  templateUrl: './administradoras2.component.html',
  styleUrls: ['./administradoras2.component.css']
})
export class Administradoras2Component implements OnInit  {
  public clienteId: number = 0;
  public localStorage = new LocalStorageUtils();
  public mensagemSpinner: string = '';
  public loading: boolean = false;
  public administradoraSelecionada: number = 0;
  public erro: string = "";
  public listaAdministradoras: any[] = [];
  public nomeAdministradoraSelecionada: string = "";
  public administradoraJaEscolhida: boolean = false;
  public dataHoraAtual: Date;
  public administradoraId: number = 0;

  constructor(private acordoService: AcordoService,
      private spinner: NgxSpinnerService,
      private router: Router) {
  }

  ngOnInit(): void {
    this.clienteId = this.localStorage.obterIdCliente();
    this.administradoraId = this.localStorage.obterIdAdministradora();
    this.dataHoraAtual = new Date();

    if (this.clienteId == null){
      this.router.navigate(['/login']);
      return;
    }

    this.obterAdministradoras();
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

  obterAdministradoras(){
    this.mostrarSpinner(true, 'Aguarde, consultando seu cadastro...');

    this.acordoService.GetAdministradoras(this.clienteId)
    .subscribe(
      sucesso => {this.processarSucessoObterAdministradoras(sucesso)},
      falha => this.processarFalhaObterAdministradoras(falha)
    );
  }
  
  processarSucessoObterAdministradoras(response: any){
    this.mostrarSpinner(false, '');
    
    if (response.success){
      this.listaAdministradoras = response.data;
      this.localStorage.salvarQuantidadeAdministradoras(this.listaAdministradoras.length);

      if (this.listaAdministradoras.length == 0){
        this.router.navigate(['/login']);
      }
      else if (this.listaAdministradoras.length == 1){
        this.administradoraEscolhida(this.listaAdministradoras[0].pessoaID, this.listaAdministradoras[0].nomeFantasia);
      }
    }
    else{
      this.erro = "Erro na consulta do cadastro";
    }
  }

  administradoraAlterada(pessoaId: number, nomeAdministradora: string){
    this.administradoraEscolhida(pessoaId, nomeAdministradora);
  }

  administradoraEscolhida(pessoaId: number, nomeAdministradora: string){
    this.localStorage.salvarAdministradora(nomeAdministradora, pessoaId);
    this.administradoraId = pessoaId;

    this.administradoraSelecionada = pessoaId;
    this.nomeAdministradoraSelecionada = nomeAdministradora;
    this.administradoraJaEscolhida = true;
  }
  
  processarFalhaObterAdministradoras(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta do cadastro";
  }

  avancar(){
    if (isNaN(this.administradoraId) || this.administradoraId == 0)
      this.erro = "Favor selecionar a Administradora";
    else
      this.administradoraJaEscolhida = true;
  }

  verDebitos(){
    this.router.navigate(['/debitos']);
  }

  realizarNovoAcordo(){
    this.router.navigate(['/novo-acordo']);
  }

  visualizarAcordos(){
    this.router.navigate(['/acordos']);
  }
}
