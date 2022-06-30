import { clienteCpfRequest } from './../requests/clientecpfRequest';


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class AcordoService extends BaseService{

    constructor(private http: HttpClient){
        super();
    }

    loginNovo(usuario: clienteCpfRequest): Observable<any> {
        let body = new URLSearchParams()

        let response = this.http
            .post(this.apiUrl + '/Negociador/GetByCPF', JSON.stringify(usuario),this.obterHeaderJson())
            .pipe(
                map(this.extractDataToken),
                catchError(this.serviceError)
            );
        return response;
    };
    buscaCliente(consorcioRequest: clienteCpfRequest): Observable<any>
    {
        let obj = {cpf: consorcioRequest.cpf}
        return this.http
        .post(this.apiUrl + '/Negociador/GetByCPF', JSON.stringify(obj),this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }

    GerarChaveAcesso(contatoid: string): Observable<any>
    {
        let obj = {ContatoContatoID: contatoid}
        return this.http
        .post(this.apiUrl + '/Autenticacao/GerarChave', JSON.stringify(obj),this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }

    ValidarChaveAcesso(chave: string, clienteId: number): Observable<any>
    {
        let obj = {ChaveDeAcesso: chave, ClienteID : clienteId}
        return this.http
        .post(this.apiUrl + '/Negociador/AutenticacaoTemporaria', JSON.stringify(obj),this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }

    GetAdministradoras(clienteId: number): Observable<any>
    {
        let obj = {clienteId: clienteId}
        return this.http
        .get(this.apiUrl + '/Cliente/GetAdministradoras?clienteId=' + clienteId,this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }

    GetClienteConsorcios(clienteId: number, pessoaID: number): Observable<any>
    {
        let obj = {clienteId: clienteId, pessoaId: pessoaID }
        return this.http
        .post(this.apiUrl + '/Negociador/GetClienteConsorcios', JSON.stringify(obj), this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }

    GerarOpcoesAcordo(consorcioID: number, pessoaID:number): Observable<any>
    {
        let obj = {ConsorcioID: consorcioID, PessoaID:pessoaID }
        return this.http
        .post(this.apiUrl + '/Negociador/GerarOpcoesAcordo', JSON.stringify(obj),this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }
    SalvarAcordo(consorcioID: number, numeroDaOpcao:number): Observable<any>
    {
        let obj = {NumeroDaOpcao: numeroDaOpcao, ConsorcioID:consorcioID }
        return this.http
        .post(this.apiUrl + '/ConsorcioAcordo/SalvarAcordo', JSON.stringify(obj),this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }
    GetBoletosParcela(clienteID: number, pessoaID: number): Observable<any>
    {
        let obj = {clienteId: clienteID, pessoaId: pessoaID }
        return this.http
        .post(this.apiUrl + '/Negociador/GetBoletosParcela', JSON.stringify(obj), this.optionRequest())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError)
        )
    }

}
