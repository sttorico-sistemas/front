import { BaseModel } from "src/core/models/base.model";
import { Person } from "../types/person";
import { Address } from "../types/address";
import { Contact } from "../types/contract";
import { ContactModel } from "./contact.model";
import { AddressModel } from "./address.model";

export class PersonModel extends BaseModel implements Person {
  public cpf: string;
  public name: string;
  public vinculo: string;
  public contratante: string;
  public contacts: ContactModel[];
  public addresses: AddressModel[];

  constructor(private props: {
    cpf: string;
    name: string;
    vinculo: string;
    contratante: string;
    contacts: Contact[];
    addresses: Address[];
  }) {
    super();
    this.cpf = this.props.cpf;
    this.name = this.props.name;
    this.vinculo = this.props.vinculo;
    this.contratante = this.props.contratante;
    this.contacts = this.props.contacts.map((e) => new ContactModel({
      typeId: e.typeId,
      phone: e.phone,
      cellPhone: e.cellPhone,
      email: e.email,
    }));
    this.addresses = this.props.addresses.map((e) => new AddressModel({
      typeId: e.typeId,
      address: e.address,
      cityId: e.cityId,
    }));
  }

  toRecord(): Record<string, any> {
    return {
      cpf: this.cpf,
      nome: this.name,
      vinculo: this.vinculo,
      contratante: this.contratante,
      contatos: this.contacts.map((e) => e.toRecord()),
      enderecos: this.addresses.map((e) => e.toRecord()),
    }
  }

  static fromRecord(record: Record<string, any>): PersonModel {
    return new PersonModel({
      cpf: record.cpf,
      name: record.nome,
      vinculo: record.vinculo ?? '',
      contratante: record.contratante ?? '',
      contacts: (record.contatos as [] | undefined)?.map(
        (e) => ContactModel.fromRecord(e),
      ) ?? [],
      addresses: (record.enderecos as [] | undefined)?.map(
        (e) => AddressModel.fromRecord(e),
      ) ?? [],
    });
  }
}