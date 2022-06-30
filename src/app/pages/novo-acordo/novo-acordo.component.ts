import { Component, OnInit } from '@angular/core';
import { AcordoService } from '../../services/acordo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageUtils } from '../../../../src/app/utils/localstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novo-acordo',
  templateUrl: './novo-acordo.component.html',
  styleUrls: ['./novo-acordo.component.css']
})
export class NovoAcordoComponent implements OnInit {
  public clienteId: number = 0;
  public administradoraId: number = 0;
  public mensagemSpinner: string = "";
  public loading: boolean = false;
  public listaPropostaAcordo: any[] =[];
  public localStorage = new LocalStorageUtils();
  public erro: string = "";
  public listaConsorcios: any[] = [];
  public listaContatos: any[] = [];
  public administradoraSelecionada: boolean = false;
  public dataHoraAtual: Date;

  constructor(private acordoService: AcordoService,
      private spinner: NgxSpinnerService,
      private router: Router) { }

  ngOnInit(): void {
    this.clienteId = this.localStorage.obterIdCliente();
    this.administradoraId = this.localStorage.obterIdAdministradora();
    this.administradoraSelecionada = this.administradoraId > 0;
    this.dataHoraAtual = new Date();
    
    this.obterCotas();
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
    //debugger;
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
        var posicao = lista.findIndex(i=>i.consorcioID == c.consorcioID);
        if (posicao < 0){
          lista.push(c);
        }
      });
      this.listaConsorcios = lista;
      
      this.listaConsorcios.forEach(c=>{        
        this.obterPropostasAcordo(c.consorcioID);
      });
    }
    else{
      this.erro = "Erro na consulta do cadastro";
    }
  }

  processarFalhaObterCotas(response: any){
    //debugger;
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta do cadastro";
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

  obterPropostasAcordo(consorcioId: number){
    this.mostrarSpinner(true, 'Aguarde, consultando as propostas de acordo disponíveis...');

    this.acordoService.GerarOpcoesAcordo(consorcioId, this.administradoraId)
    .subscribe(
      sucesso => {this.processarOpcoesAcordo(sucesso)},
      falha => this.processarFalhaOpcoesAcordo(falha)
    );
  }
  
  processarOpcoesAcordo(response: any){
    this.mostrarSpinner(false, '');

    if (response.success){
      this.listaPropostaAcordo = response.data.propostasAcordo;
      
      if (this.listaPropostaAcordo.length == 0){
        //debugger;
        //this.router.navigate(['/login']);
        return;
      }
      
      this.listaConsorcios.forEach(p=>{
        if (p.consorcioID == response.data.consorcio.consorcioID){
          p.propostasAcordo = response.data.propostasAcordo;
        }
      });
    }
    else{
      this.erro = "Erro na consulta das propostas de acordo";
    }
  }

  processarFalhaOpcoesAcordo(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta das propostas de acordo";
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
