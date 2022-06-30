import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-debitos-detalhes',
  templateUrl: './debitos-detalhes.component.html',
  styleUrls: ['./debitos-detalhes.component.css']
})
export class DebitosDetalhesComponent implements OnInit {
  public valorTotal: number = 0;
  public possuiDPJ: boolean = false;
  public possuiDPC: boolean = false;
  public atualizadoAte: Date;

  @Input() lista: [];

  constructor() {
   }

  ngOnInit(): void {
    this.atualizar();
  }

  ngOnChanges(changes: SimpleChanges){
    for (const propName in changes) {
      this.atualizar();
    }
  }

  atualizar(){
    if (this.lista != null && this.lista.length > 0){
      Array.from(this.lista).forEach(l=>{
        this.atualizadoAte = l["atualizadoAte"];
        this.valorTotal += l["valor"];
      });
    }
  }
}
