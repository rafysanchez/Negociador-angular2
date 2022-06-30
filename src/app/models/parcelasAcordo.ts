export class ParcelaAcordo{
    Consorcio:Consorcio;
    acordos: Acordo[];
}
export class Consorcio{
    ConsorcioID: string;
    ClienteID: string;
    GrupoID: string;
    Cota: string;
    NomeFantasia: string;
}
export class Acordo{
    ConsorcioAcordoID: number;
    ValorAcordo:number;
    ValorPago:number;
    QuantidadeParcela: number;
    parcelas: ParcelasAcordo[];
}
export class ParcelasAcordo{
    ConsorcioAcordoParcelaID: number;
    NumeroParcela: number;
    NumeroDeParcela: number;
    Vencimento:Date;
    ValorParcela: number;
    BoletoID: string;
    BoletoEmitido: boolean;
    CodigoDeBarra: string;
    LinhaDigitavel: string;
    NomeArquivo: string;
    ArquivoBase64: string;
    possuiDPJ: boolean;
    possuiDPC: boolean;
    debitos: DebitosAcordo[];
}
export class DebitosAcordo{
numeroDoDebito: number;
tipo: string;
descricao: string;
vencimento:Date;
valor: number;
atualizadoAte: Date;
}

