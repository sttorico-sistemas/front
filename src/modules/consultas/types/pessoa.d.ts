import { Endereco } from "./endereco";
import { Contato } from "./contato";

export interface Pessoa {
  id: number;
  cpf: string;
  nome: string;
  vinculo: string;
  contratante: string;
  contatos: Contato[];
  enderecos: Endereco[];
}