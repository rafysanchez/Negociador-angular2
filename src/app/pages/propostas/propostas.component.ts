import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'propostas-cmp',
  templateUrl: './propostas.component.html',
  styleUrls: ['./propostas.component.css']
})
export class PropostasComponent implements OnInit {

  nomecliente:string="";
  constructor() { }

  ngOnInit(): void {
    this.nomecliente="Solange de Almeida";
  }
  ConfirmarProposta(){}
}
