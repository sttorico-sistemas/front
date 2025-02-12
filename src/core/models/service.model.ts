import { AddressModel } from "@/core/models/address.model";
import { BaseModel } from "src/core/models/base.model";

export class ServiceModel extends BaseModel {
	public id?: number;
	public name: string;
	public icon: string;
	public theme: string;
	public color: string;

	constructor(props: {
		id?: number;
		name: string;
		icon: string;
		theme: string;
		color: string;
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.icon = props.icon;
		this.theme = props.theme;
		this.color = props.color;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			icone: this.icon,
			tema_do_icone: this.theme,
			cor: this.color,
		}
	}

	static fromRecord(record: Record<string, any>): ServiceModel {
		return new ServiceModel({
			id: record.id,
			name: record.nome,
			icon: record?.icone ? JSON.parse(record.icone)?.fontawesome : null,
			color: record.cor,
			theme: record.tema_do_icone,
		});
	}

	public equals(entity: ServiceModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}