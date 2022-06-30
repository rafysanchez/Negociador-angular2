import { Component, OnInit } from '@angular/core';
import { AcordoService } from '../../services/acordo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageUtils } from '../../../../src/app/utils/localstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debitos',
  templateUrl: './debitos.component.html',
  styleUrls: ['./debitos.component.css']
})
export class DebitosComponent implements OnInit {
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

  constructor(private acordoService: AcordoService,
      private spinner: NgxSpinnerService,
      private router: Router) { }

  ngOnInit(): void {
    this.clienteId = this.localStorage.obterIdCliente();
    this.administradoraId = this.localStorage.obterIdAdministradora();

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
      
      if (this.listaConsorcios.length == 0){
        this.router.navigate(['/login']);
        return;
      }
      
      this.listaConsorcios.forEach(c=>{        
        this.obterDebitosAtualizados(c.consorcioID);
      });
    }
    else{
      this.erro = "Erro na consulta do cadastro";
    }
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
