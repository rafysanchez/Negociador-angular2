import { Component, Input, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-acordo-detalhes',
  templateUrl: './acordo-detalhes.component.html',
  styleUrls: ['./acordo-detalhes.component.css']
})
export class AcordoDetalhesComponent implements OnInit {

  @Input() acordo: any = null;
  @Input() debitosabertos: boolean = true;
  @Input() mostrardataacordo: boolean = true;
  
  constructor(
    private _clipboardService:  ClipboardService) { }

  ngOnInit(): void {
  }

  MudarTextoBotaoDetalheParcela(nomeBotao: any){
    let botao = document.getElementById(nomeBotao);
    botao.innerHTML = botao.innerHTML == "Mais detalhes" ? "Menos detalhes" : "Mais detalhes";
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
}
