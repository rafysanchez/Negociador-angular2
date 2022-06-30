import { ParcelaAcordo } from './../../models/parcelasAcordo';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcordoService } from './../../services/acordo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { SimulacaoAcordo } from '../../../app/models/simulacaoAcordo';
import { LocalStorageUtils } from '../../../app/utils/localstorage';
import { clienteCpfRequest } from '../../../app/requests/clientecpfRequest';
import { Pessoa } from './../../models/pessoa';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

@Component({
  selector: 'negociador-cmp',
  templateUrl: './negociador.component.html',
  styleUrls: ['./negociador.component.css']
})

export class NegociadorComponent  implements OnInit {

  title = 'funchal-cobrancas';

  public hide:boolean = true;
  public showStep1:boolean = true;
  public showStep2:boolean = false;
  public showStep3:boolean = false;
  public showStep4:boolean = false;
  public showStep5:boolean = false;
  public showStep6:boolean = false;
  public showStep7:boolean = false;
  public showLinkAcordo:boolean = false;
  public showBotaoVoltar: boolean = false;
  public showMensagemNaoReconhece: boolean = false;
  public mensagemNaoReconheceContato: string = "";
  public respostaAutenticacao: any;
  public acordoEscolhido: number=-1;
  public parcelaEscolhida: number=-1;
  public qtdeCotasSemAcordo: number=0;
  public administradoraSelecionada: number=0;
  public listaComunicacao = [];
  public mensagemCota: string="";

  public possuiDPJ: boolean;
  public possuiDPC: boolean;
  public valorTotal: number=0;

  nomecliente:string = "";
  mostrarlogin:string="";
  mostrarpropostas:string="";
  mostrarparcelas:string="";
  mostrarcontratos:string="";
  erro:string="";
  erroValidarChave:string="";
  autenticado:boolean=false;
  consorcioAcordoID:number = 0;
  consorcioID:number;
  pessoaID:number;
  clienteID:number;
  listaConsorcio: [] = null;
  listaParcelas: ParcelaAcordo;
  listaParcelasdisponivel: ParcelaAcordo[] = [];
  listaPropostaAcordo: SimulacaoAcordo;
  public localStorage = new LocalStorageUtils();
  listaPessoas: [];
  dataHoraAtual: Date;

  opcaocomunicacao1:string = "";
  opcaocomunicacao2:string = "";

  opcaoComunicacaoEscolhida:string = "";
  tipoContatoEscolhido:string = "e-mail";

  email:string= "";
  celular:string = "";

  constructor(
    private router:Router,
    private spinner: NgxSpinnerService,
    private acordoService: AcordoService,
     private fb: FormBuilder,
    private toastr: ToastrService,
    private _clipboardService:  ClipboardService
  ) { }

  ngOnInit(): void {
    //debugger;
    this.nomecliente = this.localStorage.obterNomeCliente();
    this.mostrarlogin="ok";
    this.buildForm();

  }

  buildForm() {
    this.chaveForm = this.fb.group({
      chave: [null, Validators.required]
    });

    this.userForm = this.fb.group({
      cpfcnpj: [null, Validators.required]
     });
   }

   validationMessages = {
    chave: {
       required: 'Chave de acesso obrigatório'
     } ,
     cpfcnpj: {
      required: 'CPF/CNPJ obrigatório'
    }
   };

   //===================  step 1 ===========================

   userForm: FormGroup;
   formErrors = {
     cpfcnpj: ''
    };



  step1() {

    this.buscarCliente();
  }

  buscarCliente(){
    //debugger;
    this.erro="";
    this.spinner.show();
     let request = new clienteCpfRequest();
     request.cpf= this.userForm.get('cpfcnpj').value;
    this.acordoService.buscaCliente(request)
    .subscribe(
      sucesso => {this.processarSucesso(sucesso)},
      falha => this.processarFalha(falha)
    );
  }

  processarSucesso(response: any)
  {
    if(response.data.mensagem == null || response.data.mensagem == ""){
      this.showStep1 = false;
      this.showStep2 = true;
      this.hide = true;

      this.clienteID = response.data.cliente.clienteID;
      this.listaComunicacao = response.data.cliente.listaComunicacao;
      /*
      this.opcaocomunicacao1=response.data.cliente.listaComunicacao[0].contatoID;
      this.email=response.data.cliente.listaComunicacao[1].valor;
      this.opcaoComunicacaoEscolhida=response.data.cliente.listaComunicacao[1].contatoID;
      //var index = this.email .indexOf( "@" );
      this.email = this.email;//.substr(0,3) + '**********' + this.email.substr(index,this.email.length)

      this.opcaocomunicacao2=response.data.cliente.listaComunicacao[1].contatoID;
      this.celular=response.data.cliente.listaComunicacao[0].valor;


      this.celular = this.celular;//.substr(0,6) + '*******' + this.celular.substr(11,this.celular.length)
      */

      this.nomecliente=response.data.cliente.nome;
      this.localStorage.salvarCliente(response.data.cliente.nome,response.data.cliente.clienteID);
      this.spinner.hide();

      this.mensagemNaoReconheceContato = response.data.mensagemNaoReconheceContatos;
    }
    else{
      this.spinner.hide();
      this.erro = response.data.mensagem;
    }
  }
  processarFalha(response: any){
    this.spinner.hide();
    this.erro="erro";
  }


  //=================== step 2 ===============================
  chaveForm: FormGroup;
    chaveFormErrors = {
    chave: ''
   };

  step2() {
    this.EnviarChaveAcesso();
  }

  EnviarChaveAcesso(){

    //debugger;
    this.spinner.show();

    this.acordoService.GerarChaveAcesso(this.opcaoComunicacaoEscolhida)
    .subscribe(
      sucesso => {this.processarSucessoGerarChave(sucesso)},
      falha => this.processarFalhaGerarChave(falha)
    );

  }
  processarSucessoGerarChave(response: any){
    this.spinner.hide();
    this.showStep2 = false;
    this.showStep3 = true;
    this.hide = true;
  }

  backStep1() {
    this.showStep4 = false;
    this.showStep6 = true;
    this.hide = false;
  }

  backStep2() {
    this.showStep4 = false;
    this.showStep5 = false;
    this.showStep6 = true;
    this.hide = false;

    this.processarSucessoObterAdministradoras(null);
  }

  backStep7() {
    this.showStep4 = false;
    this.showStep5 = false;
    this.showStep6 = true;
    this.hide = false;

    this.processarSucessoObterAdministradoras(this.listaPessoas);
  }

  obterConsorcios(){
    this.acordoService.GetClienteConsorcios(this.clienteID, this.administradoraSelecionada)
    .subscribe(
      sucesso => {this.mostrarCotas(sucesso)},
      falha => this.processarFalhaValidarChave(falha)
    );
  }

  processarFalhaGerarChave(response: any){}

  escolheContato(contato: any, tipo: number){
    this.opcaoComunicacaoEscolhida = contato;
    if (tipo == 6)
      this.tipoContatoEscolhido = "e-mail";
    else
      this.tipoContatoEscolhido = "SMS";
  }

  administradoraAlterada(event){
    this.administradoraSelecionada = parseInt(event.target.value);
  }


  //=================== step 3 ===============================
  step3() {
    this.validarChave();
  }

  validarChave(){
    this.spinner.show();
    let chave = this.chaveForm.get('chave').value;
    this.acordoService.ValidarChaveAcesso(chave, this.clienteID)
    .subscribe(
      sucesso => {this.processarSucessoValidarChave(sucesso)},
      falha => this.processarFalhaValidarChave(falha)
    );

  }

  processarSucessoValidarChave(response: any){
    this.respostaAutenticacao = response;

    this.acordoService.GetAdministradoras(this.clienteID)
    .subscribe(
      sucesso => {this.processarSucessoObterAdministradoras(sucesso.data)},
      falha => this.processarFalhaObterAdministradoras(falha)
    );
  }
  
  processarSucessoObterAdministradoras(data: any){
    if (data.length == 0){

    }
    else if (data.length == 1){
      this.administradoraSelecionada = data[0].pessoaID;
    
      this.obterConsorcios();
    }
    else{
      this.listaPessoas = data;
      this.showStep7 = true;
      this.showStep1 = false;
      this.showStep2 = false;
      this.showStep3 = false;
      this.hide = false;

      this.spinner.hide();
    }
  }
  
  processarFalhaObterAdministradoras(response: any){
    this.erroValidarChave="erro";
    this.spinner.hide();
  }

 mostrarCotas(response:any){
   
   if (response.data.authenticated){
    this.listaConsorcio = response.data.cliente.listaConsorcio;
    this.clienteID =  response.data.cliente.clienteID;

    if (response.data.cliente.listaConsorcio != null){
      //debugger;
      if (response.data.cliente.listaConsorcio.length == 0){
        //Exibe mensagem de que não há débitos em aberto
        this.listaConsorcio = [];
        this.dataHoraAtual = new Date();
      }
      else if (response.data.cliente.listaConsorcio.length == 1){
        this.showStep7 = false;
        this.showStep4 = true;

        this.consorcioAcordoID = response.data.cliente.listaConsorcio[0].consorcioAcordoID;
        this.consorcioID =  response.data.cliente.listaConsorcio[0].consorcioID;
        this.pessoaID = response.data.cliente.listaConsorcio[0].pessoaID;

        this.clienteID =  response.data.cliente.clienteID;
        if (response.data.cliente.listaConsorcio[0].permiteNegociacaoOnline){
          if (this.consorcioAcordoID == 0) {
            this.gerarAcordo(response.data.cliente.listaConsorcio[0]);
          }
          else{
            this.showBotaoVoltar = false;
            this.buscaParcelasAcordo();
          }
        }
        else if (!response.data.cliente.listaConsorcio[0].permiteNegociacaoOnline){
          if(this.consorcioAcordoID > 0) {
            this.showBotaoVoltar = false;
            this.buscaParcelasAcordo();
          }
        }
      }
      else{
        this.showStep7 = false;
        this.showStep6 = true;

        response.data.cliente.listaConsorcio.forEach(c => {
          if (c.consorcioAcordoID == 0)
          this.qtdeCotasSemAcordo++;
        });

          let exibirCotas = false;
          response.data.cliente.listaConsorcio.forEach(c => {
            if (c.consorcioAcordoID == 0){
              this.showBotaoVoltar = true;
              exibirCotas=true;
            }
            else
                this.showLinkAcordo = true;
          });

          if (exibirCotas){
              this.listaConsorcio = response.data.cliente.listaConsorcio;
              this.showStep6=true;
              this.showStep3=false;
              this.hide = false;
              this.spinner.hide();
          }
          else{
              this.showLinkAcordo = true;
              this.buscaParcelasAcordo();
          }
      }
    }
  }
 }
    processarFalhaValidarChave(response: any){
      this.erroValidarChave="erro";
      this.spinner.hide();
    }
    buscaParcelasAcordo(){
      this.spinner.show();
      this.acordoService.GetBoletosParcela(this.clienteID, this.administradoraSelecionada)
      .subscribe(
        sucesso => {this.processarSucessoGetParcela(sucesso)},
        falha => this.processarFalhaGetParcela(falha)
      );
    }
    processarSucessoGetParcela(response: any){
    this.showStep4 = false;
    this.showStep6 = false;
    this.showStep5 = true;
    this.hide = false;
    
    this.listaParcelas = response;
    this.listaParcelas.acordos.forEach((a, index)=>{
      a.parcelas.forEach((p,index)=>{
        p.debitos.forEach((d, index)=>{
          if (!p.possuiDPJ && d.tipo == "DPJ") p.possuiDPJ = true;
          if (!p.possuiDPC && d.tipo == "DPC") p.possuiDPC = true;
        });
      });
    });
    let lista: ParcelaAcordo[]=[];
    this.acordoEscolhido = 0;
    this.parcelaEscolhida = 0;

    this.spinner.hide();

    this.showStep3 = false;
    this.showStep5 = true;
    this.hide = false;
    }

    processarFalhaGetParcela(response: any){}


    gerarAcordo(consorcio: any){

      this.spinner.show();

      this.acordoService.GerarOpcoesAcordo(consorcio.consorcioID,consorcio.pessoaID)
      .subscribe(
        sucesso => {this.processarSucessoGerarAcordo(sucesso)},
        falha => this.processarFalhaGerarAcordo(falha)
      );
    }

    processarSucessoGerarAcordo(response: any){
      this.listaPropostaAcordo= response.data;

      response.data.debitosAtualizados.forEach((d, j)=>
          { 
            if (!this.possuiDPJ) this.possuiDPJ = d.tipo == "DPJ"; 
            if (!this.possuiDPC) this.possuiDPC = d.tipo == "DPC";
            this.valorTotal += d.valor;
          }
      );
      this.showStep3 = false;
      this.showStep6 = false;
      this.showStep4 = true;
      this.hide = false;
      this.spinner.hide();
    }

    processarFalhaGerarAcordo(response: any){
      this.spinner.hide();
    }
     //=================== step 4 ===============================
  step4(consorcio: any, acordo: any) {
    this.ConfirmarProposta(consorcio, acordo);
  }
  donwloadDocumento(parcela: any){

    let arqbase64 = parcela.arquivoBase64;
    let numeroBoleto =  parcela.boletoID;
    let fileName = '';

    let contentType = '';

    fileName = numeroBoleto+ '.pdf';
    contentType = 'application/pdf';

    const b64Data = arqbase64;

    const blob = this.b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);


    const downloadLink = document.createElement('a');


    downloadLink.href = blobUrl; // linkSource;
    downloadLink.download = fileName;
    downloadLink.click();

  }

  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


  copyCodigoBarras(msgText){

    this._clipboardService.copy(msgText);
  }

  ConfirmarProposta(consorcio: any, acordo: any){
    this.spinner.show();

    this.acordoService.SalvarAcordo(consorcio.consorcioID,acordo.numeroDaOpcao)
    .subscribe(
      sucesso => {this.processarSucessoSalvarAcordo(sucesso)},
      falha => this.processarFalhaSalvarAcordo(falha)
    );
  }
  processarSucessoSalvarAcordo(response: any){
    this.spinner.show();
    setTimeout(() => {
      this.acordoService.GetBoletosParcela(this.clienteID, this.administradoraSelecionada)
      .subscribe(
        sucesso => {this.processarSucessoGetParcela(sucesso)},
        falha => this.processarFalhaGetParcela(falha)
      );
    }, 9000);

  }
  processarFalhaSalvarAcordo(response: any){
    this.spinner.hide();
  }


  // getAcordoOuParcela(consorcio: any){
  //   if(consorcio.consorcioAcordoID > 0) {
  //     this.buscaParcelasAcordo();
  // }
  // else{
  //     this.gerarAcordo(consorcio)
  //  }
  // }

  getAcordo(consorcio: any){
    this.gerarAcordo(consorcio)
  }

  getParcela(){
    this.buscaParcelasAcordo();
  }

  naoReconheceDados(){
    this.showMensagemNaoReconhece = true;
  }

  toggle(j:number, i:number){
    this.acordoEscolhido = j;
    this.parcelaEscolhida = i;
  }

  step6(){
    //debugger;
    if(this.administradoraSelecionada==0){
      alert("Escolha a administradora");
      return;
    }

    this.showStep7 = false;
    this.mostrarCotas(this.respostaAutenticacao);
  }

  MudarTextoBotaoDetalheAcordo(nomeBotao: any){
    let botao = document.getElementById(nomeBotao);
    botao.innerHTML = botao.innerHTML == "Ver mais" ? "Ver menos" : "Ver mais";
  }

  MudarTextoBotaoDetalheParcela(nomeBotao: any){
    let botao = document.getElementById(nomeBotao);
    botao.innerHTML = botao.innerHTML == "Mais detalhes" ? "Menos detalhes" : "Mais detalhes";
  }

  MudarTextoDetalheDebitosAcordo(nomeBotao: any){
    let botao = document.getElementById(nomeBotao);
    botao.innerHTML = botao.innerHTML == "Visualizar os débitos constantes nesta parcela" ? "Ocultar os débitos constantes nesta parcela" : "Visualizar os débitos constantes nesta parcela";
  }

  MudarTextoBotaoTodosDebitos(){
    let botao = document.getElementById("botaoMostraTodosDebitos");
    botao.innerHTML = botao.innerHTML == "Visualizar todos os débitos em aberto hoje" ? "Ocultar todos os débitos em aberto hoje" : "Visualizar todos os débitos em aberto hoje";
  }

  voltarOpcoesToken(){
    this.showStep3 = false;
    this.showStep2 = true;
  }

  permiteNegociacaoOnline(consorcio: any){
    consorcio.listaConsorcio.array.forEach(c => {
      if (!c.permiteNegociacaoOnline || c.bloqueadaNegociacaoOnline)
        return false;
    });

    return true;
  }

  c(consorcio: any){
    consorcio.listaConsorcio.array.forEach(c => {
      if (!c.permiteNegociacaoOnline || c.bloqueadaNegociacaoOnline)
        return c.mensagem;
    });

    return "";
  }
}
