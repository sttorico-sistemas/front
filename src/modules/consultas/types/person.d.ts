import { Address } from "./address";
import { Contact } from "./contract";

export interface Person {
  cpf: string;
  name: string;
  vinculo: string;
  contratante: string;
  contacts: Contact[];
  addresses: Address[];
}