import { Component, OnInit } from '@angular/core';
import { AcordoService } from '../../services/acordo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageUtils } from '../../../../src/app/utils/localstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administradoras',
  templateUrl: './administradoras.component.html',
  styleUrls: ['./administradoras.component.css']
})
export class AdministradorasComponent implements OnInit  {
  public clienteId: number = 0;
  public localStorage = new LocalStorageUtils();
  public mensagemSpinner: string = '';
  public loading: boolean = false;
  public administradoraSelecionada: number = 0;
  public erro: string = "";
  public listaAdministradoras: any[] = [];
  public nomeAdministradoraSelecionada: string = "";
  public administradoraJaEscolhida: boolean = false;

  constructor(private acordoService: AcordoService,
      private spinner: NgxSpinnerService,
      private router: Router) {
  }

  ngOnInit(): void {
    this.clienteId = this.localStorage.obterIdCliente();
    
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
  
  processarFalhaObterAdministradoras(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta do cadastro";
  }

  avancar(){
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
