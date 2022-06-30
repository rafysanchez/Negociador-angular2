import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AcordoService } from 'src/app/services/acordo.service';
import { LocalStorageUtils } from 'src/app/utils/localstorage';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-acordos',
  templateUrl: './acordos.component.html',
  styleUrls: ['./acordos.component.css']
})
export class AcordosComponent implements OnInit {
  public clienteId: number = 0;
  public administradoraId: number = 0;
  public mensagemSpinner: string = "";
  public loading: boolean = false;
  public listaConsorcios: any[] =[];
  public listaAcordos: any[] =[];
  public localStorage = new LocalStorageUtils();
  public erro: string = "";
  public cotaEscolhida: boolean = false;
  public dataHoraAtual: Date;
  public consorcioId: number;
  public qtdeAdministradoras: number;
  public administradoraSelecionada: boolean = false;

  constructor(private acordoService: AcordoService,
      private spinner: NgxSpinnerService,
      private router: Router) { }

  ngOnInit(): void {
    this.clienteId = this.localStorage.obterIdCliente();
    this.administradoraId = this.localStorage.obterIdAdministradora();
    this.qtdeAdministradoras = this.localStorage.obterQuantidadeAdministradoras();
    this.administradoraSelecionada = this.administradoraId > 0;

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
      
      let lista = [];
      this.listaConsorcios.forEach(c=>{        
        if (lista.findIndex(i=>i.consorcioID == c.consorcioID) < 0){
          lista.push(c);
        }
      });
      this.listaConsorcios = lista;

      this.obterAcordosRealizados();
      //this.listaConsorcios.forEach(c=>{        
      //});
    }
    else{
      this.erro = "Erro na consulta do cadastro";
    }
  }

  processarFalhaObterCotas(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta do cadastro";
  }
  
  obterAcordosRealizados(){
    this.mostrarSpinner(true, 'Aguarde, consultando os acordos realizados...');

    this.acordoService.GetBoletosParcela(this.clienteId, this.administradoraId)
    .subscribe(
      sucesso => {this.processarSucessoBoletosParcela(sucesso)},
      falha => this.processarFalhaBoletosParcela(falha)
    );
  }
  
  processarSucessoBoletosParcela(response: any){
    this.mostrarSpinner(false, '');
    this.dataHoraAtual = new Date();
    this.cotaEscolhida = true;
    
    //if (response.success){
      if (this.listaConsorcios.length == 0){
        this.router.navigate(['/login']);
        return;
      }

      this.listaConsorcios.forEach(c=>{
        c.acordos = [];
        response.acordos.forEach(a => {
          if (a.consorcioID == c.consorcioID){
            c.acordos.push(a);
          }
        });
      });
   // }
  }

  processarFalhaBoletosParcela(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta dos acordos";
  }

  realizarNovoAcordo(){
    this.router.navigate(['./novo-acordo']);
  }

  visualizarDebitos(){
    this.router.navigate(['/debitos']);
  }

  MudarTextoDetalheDebitosAcordo(nomeBotao: any){
    let botao = document.getElementById(nomeBotao);
    botao.innerHTML = botao.innerHTML == "Visualizar os débitos constantes nesta parcela" ? "Ocultar os débitos constantes nesta parcela" : "Visualizar os débitos constantes nesta parcela";
  }

  alterarAdministradora(){
    this.router.navigate(['/administradoras']);
  }
}