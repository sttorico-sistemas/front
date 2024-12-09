import { BaseModel } from "src/core/models/base.model";

export class ContactModel extends BaseModel {
	public id?: number;
	public phone: string;
	public cellphone: string;
	public phoneTypeId: number;
	public email: string;

	constructor(props: {
		id?: string;
		phone: string;
		cellphone: string;
		phoneTypeId: string;
		email: string;
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.phone = props.phone?.replace(/\D+/g, "");
		this.cellphone = props.cellphone?.replace(/\D+/g, "");
		this.phoneTypeId = +props.phoneTypeId;
		this.email = props.email;
	}

	toRecord(): Record<string, any> {
		return {
			id: this?.id,
			telefone: this.phone,
			celular: this.cellphone,
			tipo_contato_id: this.phoneTypeId,
			email: this.email,
		};
	}

	static fromRecord(record: Record<string, any>): ContactModel {
		return new ContactModel({
			id: record?.id,
			cellphone: record.celular,
			email: record.email,
			phone: record.telefone,
			phoneTypeId: record.tipo_contato_id,
		});
	}

	public equals(entity: ContactModel) {
    if (entity === this) {
      return true
    }

    if (entity.id === this.id) {
      return true
    }

    return false
  }
}