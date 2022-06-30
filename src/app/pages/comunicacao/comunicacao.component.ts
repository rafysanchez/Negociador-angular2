import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'comunicacao-cmp',
  templateUrl: './comunicacao.component.html',
  styleUrls: ['./comunicacao.component.css']
})
export class ComunicacaoComponent implements OnInit {

  email:string= "";
  celular:string = "";
  nomecliente:string = "";
  constructor( private router: Router,) { }

  ngOnInit(): void {
    this.email="g****m@gmail.com";
    this.celular="(15)9*******21";
    this.nomecliente="Solange Almeida";
  }

  EnviarChaveAcesso(){
    //debugger;
    this.router.navigate(['/login']);  
  }
}
