import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AcordoService } from '../../../app/services/acordo.service';
import { ToastrService } from 'ngx-toastr';
import { clienteCpfRequest } from '../../../app/requests/clientecpfRequest';
import { LocalStorageUtils } from '../../../app/utils/localstorage';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

@Component({
  selector: 'identificador-cmp',
  templateUrl: './identificador.component.html',
  styleUrls: ['./identificador.component.css']
})
export class IdentificadorComponent implements OnInit {
  public erro: string = "";
  public userForm: FormGroup = this.fb.group({
    cpfcnpj: [null, Validators.required]
   });
   public localStorage = new LocalStorageUtils();
   public loading: boolean = false;
   public solicitarCPF: boolean = true;
   public solicitarContato: boolean = false;
   public listaComunicacao: any[] = [];
   public comunicacaoSelecionada: any = null;
   public mensagemSpinner: string = '';
   public validaChaveAcesso: boolean = false;
   public chaveForm = this.fb.group({
     chave: ['', Validators.required]
   });
   public clienteId: number = 0;
   public listaContatos: any[] = [];
   public nomeCliente: string = "";

  constructor(private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private acordoService: AcordoService,
    private router: Router)
  {
    this.localStorage.clear();
  }

  ngOnInit(){}

  mostrarSpinner(mostrar: boolean, mensagem: string){
    if (mostrar){
      this.mensagemSpinner = mensagem;
      this.spinner.show();
    }
    else
      this.spinner.hide();

    this.loading = mostrar;
  }

  buscarCliente(){
    this.erro = "";

    if (this.userForm.get('cpfcnpj').value == null || this.userForm.get('cpfcnpj').value == '')
    {
      this.erro = "Favor informar seu CPF ou CNPJ";
      return;
    }

    let cpfCnpj = this.userForm.get('cpfcnpj').value;
    if (cpfCnpj.length > 11){
      let isValido = this.isCNPJValido(cpfCnpj);
      if (!isValido){
        this.erro = "O CNPJ informado é inválido";
        return;
      }
    }
    else{
      let isValido = this.isCPFValido(cpfCnpj);
      if (!isValido){
        this.erro = "O CPF informado é inválido";
        return;
      }
    }

    this.mostrarSpinner(true, 'Aguarde, consultando seu cadastro...');

    let request = new clienteCpfRequest();
    request.cpf= this.userForm.get('cpfcnpj').value;
    this.acordoService.buscaCliente(request)
    .subscribe(
      sucesso => {this.processarSucessoBuscaCliente(sucesso)},
      falha => this.processarFalhaBuscaCliente(falha)
    );
  }

  processarSucessoBuscaCliente(response: any)
  {
    this.mostrarSpinner(false, '');

    if (response.success){
      this.listaContatos = response.data.contatos;

      if(response.data.cliente == null)
      {
        this.erro="Infelizmente não localizamos o seu CPF/CNPJ nesta base de dados. Por gentileza ligue no telefone " + this.obterTelefone() +" para falar conosco";
      }
      else if (response.data.mensagem != null && response.data.mensagem != ''){
        this.erro = response.data.mensagem;
      }
      else{
        this.clienteId = response.data.cliente.clienteID;
        this.nomeCliente = response.data.cliente.nome;
        this.listaContatos=response.data.contatos;

        this.localStorage.salvarCliente(response.data.cliente.nome, response.data.cliente.clienteID);
        this.listaComunicacao = response.data.cliente.listaComunicacao;

        this.solicitarCPF = false;
        this.solicitarContato = true;
      }
    }
    else{
      this.erro = response.data.mensagem;
    }
  }

  processarFalhaBuscaCliente(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na consulta do cadastro";
  }

  naoReconheceDados(){
    this.erro="Por favor entre em contato conosco por meio do telefone " + this.obterTelefone() +" para atualizar o seu cadastro";
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

  escolheContato(contato: any){
    this.comunicacaoSelecionada = contato;
  }

  gerarChaveAcesso() {
    this.erro = "";

    if (this.comunicacaoSelecionada == null){
      this.erro = "Por favor, escolha onde deseja receber a chave de acesso";
      return;
    }

    this.mostrarSpinner(true, "Aguarde, gerando a chave de acesso...");

    this.acordoService.GerarChaveAcesso(this.comunicacaoSelecionada.contatoID)
    .subscribe(
      sucesso => {this.processarSucessoGerarChave(sucesso)},
      falha => this.processarFalhaGerarChave(falha)
    );

  }
  
  processarSucessoGerarChave(response: any){
    this.mostrarSpinner(false, '');
    
    if (response.success){
        this.solicitarContato = false;
        this.validaChaveAcesso = true;
    }
    else{
      this.erro = "Erro na geração da chave de acesso";
    }
  }

  processarFalhaGerarChave(response: any){
    this.mostrarSpinner(false, '');
    this.erro = "Erro na geração da chave de acesso";
  }

  obterTipoContatoParaOpcoes(meioComunicao: number){
    return meioComunicao==6 ? 'E-mail' : 'Telefone';
  }

  obterTipoContato(){
    return this.comunicacaoSelecionada.tblMeioComunicacao==6 ? 'email' : 'SMS';
  }

  voltarOpcoesToken(){
    this.solicitarContato = true;
    this.validaChaveAcesso = false;
  }

  validarChave(){
    this.erro = "";

    let chave = this.chaveForm.get('chave').value;
    if (chave == '')
    {
      this.erro = "Favor informar a chave de acesso recebida";
      return;
    }

    this.mostrarSpinner(true, 'Aguarde, validando a chave de acesso...');

    this.acordoService.ValidarChaveAcesso(chave, this.clienteId)
    .subscribe(
      sucesso => {this.processarSucessoValidarChave(sucesso)},
      falha => this.processarFalhaValidarChave(falha)
    );
  }

  processarSucessoValidarChave(response: any){
    this.mostrarSpinner(false, '');

    if (response.success){
      this.localStorage.salvarTokenUsuario(this.chaveForm.get('chave').value);
      this.router.navigate(['/administradoras']);
    }
    else{
      this.erro = "Erro na validação da chave de acesso";
    }
  }

  processarFalhaValidarChave(response: any){
    this.mostrarSpinner(false, '');
    
    this.erro = "Erro na validação da chave de acesso";
  }

  isCPFValido(cpf:string){
    let multiplicador1: number[] = [ 10, 9, 8, 7, 6, 5, 4, 3, 2 ];
    let multiplicador2: number[] = [ 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];

    cpf = cpf.replace(" ", "").replace(".", "").replace("-", "");
    if (cpf.length != 11)
        return false;

    if (cpf == "11111111111")
      return false;
    else if (cpf == "2222222222")
      return false;
    else if (cpf == "33333333333")
      return false;
    else if (cpf == "44444444444")
      return false;
    else if (cpf == "55555555555")
      return false;
    else if (cpf == "66666666666")
      return false;
    else if (cpf == "77777777777")
      return false;
    else if (cpf == "88888888888")
      return false;
    else if (cpf == "99999999999")
      return false;
    else if (cpf == "00000000000")
      return false;

    /*for (let j = 0; j < 10; j++)
        if (j.toString().PadLeft(11, char.Parse(j.ToString())) == cpf)
            return false;
*/
    let tempCpf = cpf.substring(0, 9);
    let soma = 0;

    for (let i = 0; i < 9; i++)
        soma += parseInt(tempCpf[i].toString()) * multiplicador1[i];

    let resto = soma % 11;
    if (resto < 2)
        resto = 0;
    else
        resto = 11 - resto;

    let digito = resto.toString();
    tempCpf = tempCpf + digito;
    soma = 0;
    for (let i = 0; i < 10; i++)
        soma += parseInt(tempCpf[i].toString()) * multiplicador2[i];

    resto = soma % 11;
    if (resto < 2)
        resto = 0;
    else
        resto = 11 - resto;

    digito = digito + resto.toString();

    return cpf.substring(9, 11) == digito;
  }

  isCNPJValido(cnpj:string){    
    let multiplicador1: number[] = [ 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ];
    let multiplicador2: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ];

    cnpj = cnpj.replace(" ", "").replace(".", "").replace("-", "").replace("/", "");
    if (cnpj.length != 14)
        return false;

    if (cnpj == "11111111111111")
      return false;
    else if (cnpj == "22222222222222")
      return false;
    else if (cnpj == "33333333333333")
      return false;
    else if (cnpj == "44444444444444")
      return false;
    else if (cnpj == "55555555555555")
      return false;
    else if (cnpj == "66666666666666")
      return false;
    else if (cnpj == "77777777777777")
      return false;
    else if (cnpj == "88888888888888")
      return false;
    else if (cnpj == "99999999999999")
      return false;
    else if (cnpj == "00000000000000")
      return false;

    let tempCnpj = cnpj.substring(0, 12);
    let soma = 0;

    for (let i = 0; i < 12; i++)
        soma += parseInt(tempCnpj[i].toString()) * multiplicador1[i];

    let resto = (soma % 11);
    if (resto < 2)
        resto = 0;
    else
        resto = 11 - resto;

    let digito = resto.toString();
    tempCnpj = tempCnpj + digito;
    soma = 0;
    for (let i = 0; i < 13; i++)
        soma += parseInt(tempCnpj[i].toString()) * multiplicador2[i];

    resto = (soma % 11);
    if (resto < 2)
        resto = 0;
    else
        resto = 11 - resto;

    digito = digito + resto.toString();

    return cnpj.substring(12, 14) == digito;
  }
}
