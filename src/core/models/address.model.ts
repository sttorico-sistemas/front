import { BaseModel } from "src/core/models/base.model";

export class AddressModel extends BaseModel {
	public id?: number;
	public cityId: number;
	public cityName?: string;
	public stateId: number;
	public street: string;
	public zipCode: string;
	public addressTypeId: number;

	constructor(props: {
		id?: string;
		cityId: string;
		cityName?: string;
		stateId: string;
		addressTypeId: string;
		street: string;
		zipCode: string;
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.cityId = +props.cityId;
		this.stateId = +props.stateId;
		this.cityName = props.cityName
		this.addressTypeId = +props.addressTypeId;
		this.street = props.street;
		this.zipCode = props.zipCode?.replace(/\D+/g, "");
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			logradouro: this.street,
			cep: this.zipCode,
			cidade_id: this.cityId,
			tipo_endereco_id: this.addressTypeId,
		};
	}

	static fromRecord(record: Record<string, any>): AddressModel {
		return new AddressModel({
			id: record?.id,
			addressTypeId: record.tipo_endereco_id,
			cityId: record.cidade.id,
			cityName: record.cidade.nome,
			stateId: record.cidade.estado.id,
			street: record.logradouro,
			zipCode: record.cep,
		});
	}

	public equals(entity: AddressModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id) {
			return true
		}

		return false
	}
}