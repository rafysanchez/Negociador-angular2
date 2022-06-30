import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AcordoService } from '../../../services/acordo.service';

@Component({
  selector: 'app-propostas',
  templateUrl: './propostas.component.html',
  styleUrls: ['./propostas.component.css']
})
export class PropostasComponent implements OnInit {
  public mensagemSpinner: string = "";
  public loading: boolean = false;
  public acordoRealizado: boolean = false;
  public dataHoraAtual: Date;
  public propostaEscolhida: any;

  @Input() lista: any[] = [];
  @Input() consorcioId: number = 0;

  constructor(private acordoService: AcordoService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.dataHoraAtual = new Date();
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

  realizarAcordo(acordo: any) {
    this.propostaEscolhida = acordo;
    this.propostaEscolhida.DataHoraDoAcordo = new Date();
    this.propostaEscolhida.numeroDeParcela = acordo.parcelas.length
    this.ConfirmarProposta(acordo);
  }

  ConfirmarProposta(acordo: any){
    this.mostrarSpinner(true, 'Aguarde, gravando o acordo...');

    this.acordoService.SalvarAcordo(this.consorcioId,acordo.numeroDaOpcao)
    .subscribe(
      sucesso => {this.processarSucessoSalvarAcordo(sucesso)},
      falha => this.processarFalhaSalvarAcordo(falha)
    );
  }

  processarSucessoSalvarAcordo(response: any){
    this.mostrarSpinner(false, '');
    this.acordoRealizado = true;
  }

  processarFalhaSalvarAcordo(response: any){
    this.mostrarSpinner(false, '');
  }
}
