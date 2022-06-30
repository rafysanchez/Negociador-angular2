
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
//import { LoaderService } from '../../services/loader.service';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permissao } from '../guard/permissao';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private router: Router,
     private  permissao: Permissao
      //public loaderService: LoaderService
      ) {
        
       }

    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      //  this.loaderService.show();
      /*if ((this.permissao.role != 'A') && (this.permissao.role != 'C'))
      {
        this.router.navigate(['/']);
      }*/
        let token = window.localStorage.getItem('tokem');
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: 'Bearer ' + token
            }
          });
        }
        return next
        .handle(req)
        .pipe(catchError( (err: HttpErrorResponse) => {
            if (err.status === 401) {
              //debugger;
            this.router.navigate(['/']);
            
            }
          //  finalize(() => this.loaderService.hide());
            return throwError(err);
          }
        ),
        //finalize(() => this.loaderService.hide())
        );
    }
}
