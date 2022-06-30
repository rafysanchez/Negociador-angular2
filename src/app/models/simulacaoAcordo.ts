export class SimulacaoAcordo{
      Consorcio:Consorcio;
      DebitosAtualizados: Debitos[];
      PropostasAcordo: Proposta[];
}
export class Consorcio{
      ConsorcioID: string;
      ClienteID: string;
      GrupoID: string;
      Cota: string;
      NomeFantasia: string;
}
export class Debitos{
  numeroDoDebito: number;
  tipo: string;
  descricao: string;
  vencimento:Date;
  valor: number;
  atualizadoAte: Date;
}
export class Proposta{
      NumeroDaOpcao: number;
      ValorAcordo:number;
      QuantidadeParcela: number;
      Parcelas: ParcelasAcordoTemp[];
      PagamentoVista: boolean;
}
export class ParcelasAcordoTemp{
      NumeroParcela: number;
      Vencimento:Date;
      ValorParcela: number;
      Debitos: Debitos[];
      PossuiDPJ: boolean;
      PossuiDPC: boolean;
}

