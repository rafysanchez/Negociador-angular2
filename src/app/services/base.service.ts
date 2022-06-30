import { LocalStorageUtils } from './../utils/localstorage';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn:'root'
})
export abstract class BaseService{

    readonly apiUrl = environment.apiURL;
 
    
    public localStorage = new LocalStorageUtils();
   
   public optionRequest(){
        return{
             headers: new HttpHeaders({
                'Content-Type':'application/json',
                'Acess-Control-Allow-Origin':'*',
                'Acess-Control-Allow-Methods': 'GET,POST,OPTIONS,PUT',
                'Acess-Control-Allow-Headers': 'Acess-Control-Allow-Headers,Origin,Accept,X-Request-With,Content-Type,Acess-Control-Request-Method,Acess-Control-Request-Headers'
            })
        }
    }

    public obterHeaderJson(){
        return{
            headers: new HttpHeaders( {
                    'Content-Type': 'application/json'
                }
            )
        }
    }

    public obterBearHeaderJon(){
        
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Autorization': 'Bearer ' + this.localStorage.obterTokenUsuario()
            })
        }
    }
    

    public obterHeaderToken(){
        return {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        }
    }

   
    public extractData(response: any){
        return response || {};
    }

    public extractDataToken(response: any){
        
        return response || {};
    }

    public serviceError(response: Response | any)    
    {
        let customError: string[] = [];

        let  customResponse: { error: { errors: string []  }}

        if (response.error == "Unknonw Error")
        {
            customError.push("Ocorreu erro desconhecido");
            response.error.erros = customError;
        }
        if (response.status === 500)
        {
            customError.push("erro no processamento");
            customResponse.error.errors  = customError;   
            return throwError(customResponse);
        }
        return throwError(response);
    }
}