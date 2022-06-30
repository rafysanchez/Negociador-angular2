import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-debitos-detalhes2',
  templateUrl: './debitos-detalhes2.component.html',
  styleUrls: ['./debitos-detalhes2.component.css']
})
export class DebitosDetalhes2Component implements OnInit {
  public valorTotal: number = 0;
  public possuiPCL: boolean = false;
  public possuiDFP: boolean = false;
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
      this.valorTotal = 0;
      Array.from(this.lista).forEach(l=>{
        this.atualizadoAte = l["atualizadoAte"];

        if (l["tipo"] == "PCL") this.possuiPCL = true;
        else if (l["tipo"] == "DFP") this.possuiDFP = true;
        else if (l["tipo"] == "DPJ") this.possuiDPJ = true;
        else if (l["tipo"] == "DPC") this.possuiDPC = true;

        this.valorTotal += l["valor"];
      });
    }
  }
}
