import { AddressModel } from "@/core/models/address.model";
import { BaseModel } from "@/core/models/base.model";
import { ContactModel } from "@/core/models/contact.model";

export class PersonModel extends BaseModel {
	public id?: number;
	public name: string;
	public cpf: string;
	public linkedType?: string;
	public birthday: string;
	public city?: string;
	public email?: string;
	public status?: number;
	public addresses: AddressModel[]
	public deletedAddresses?: number[]
	public contacts: ContactModel[]
	public deletedContacts?: number[]

	constructor(props: {
		id?: number;
		name: string;
		cpf: string;
		linkedType?: string;
		birthday: string;
		city?: string;
		email?: string;
		status?: number;
		addresses: AddressModel[];
		deletedAddresses: number[];
		contacts: ContactModel[];
		deletedContacts: number[];
	}) {

		super();
		this.id = props?.id;
		this.cpf = props.cpf?.replace(/\D+/g, "");
		this.name = props.name;
		this.linkedType = props?.linkedType;
		this.birthday = props.birthday?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
		this.city = props?.city;
		this.email = props?.email;
		this.status = props?.status;
		this.addresses = props?.addresses ?? [];
		this.deletedAddresses = props?.deletedAddresses ?? [];
		this.contacts = props?.contacts ?? [];
		this.deletedContacts = props?.deletedContacts ?? [];
	}

	toRecord(): Record<string, any> {

		return {
			id: this?.id,
			nome: this.name,
			cpf: this.cpf,
			dt_nasc: this.birthday,
			enderecos: this.addresses.map((data) => data.toRecord()),
			enderecos_deletado: this.deletedAddresses,
			contatos: this.contacts.map((data) => data.toRecord()),
			contatos_deletado: this.deletedContacts,
		}
	}

	static formatDate(birthDate?: string) {
		if (!birthDate) {
			return '';
		}
		if (birthDate.includes('-')) {
			const date = new Date(birthDate);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${day}/${month}/${year}`;
		}
		const day = birthDate.split('/')[0];
		const month = birthDate.split('/')[1]
		const year = birthDate.split('/')[2];
		return `${year}-${month}-${day}`;
	}

	static fromRecord(record: Record<string, any>): PersonModel {
		console.log('fromRecord', record)

		return new PersonModel({
			id: record.id,
			name: record.nome,
			cpf: record.cpf,
			linkedType: record.tp_vinculo,
			email: record.email,
			status: record.status,
			birthday: record.dt_nasc,
			city: record.cidade,
			addresses: record.enderecos?.map((data: any) => AddressModel.fromRecord(data)),
			deletedAddresses: [],
			contacts: record.contatos?.map((data: any) => ContactModel.fromRecord(data)),
			deletedContacts: [],
		});
	}
}