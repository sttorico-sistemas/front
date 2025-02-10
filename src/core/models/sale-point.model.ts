import { BaseModel } from "src/core/models/base.model";

export class SalePointModel extends BaseModel {
	public id?: number;
	public name: string;
	public email: string;
	public cellphone: string;
	public phone: string;
	public cityId: string;
	public cityName?: string;
	public ufId: string;
	public ufName?: string;
	public managerId: string;
	public managerName?: string;
	public salePointTypeId: string;
	public salePointTypeName?: string;
	public status?: number;

	constructor(props: {
		id?: number
		name: string
		email: string;
		cellphone: string;
		phone: string;
		cityId: string
		cityName?: string
		ufId: string
		ufName?: string
		managerId: string
		managerName?: string;
		salePointTypeId: string
		salePointTypeName?: string;
		status?: number
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.email = props.email;
		this.cellphone = props.cellphone;
		this.phone = props.phone;
		this.cityId = props.cityId;
		this.cityName = props.cityName;
		this.ufId = props.ufId;
		this.ufName = props.ufName;
		this.managerId = props.managerId;
		this.managerName = props.managerName;
		this.salePointTypeId = props.salePointTypeId;
		this.salePointTypeName = props.salePointTypeName;
		this.status = props.status;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name
		}
	}

	static fromRecord(record: Record<string, any>): SalePointModel {
		return new SalePointModel({
			id: record.id,
			name: record.nome,
			cellphone: record.celular,
			phone: record.telefone,
			email: record.email,
			cityId: record.cidade_id,
			cityName: record.cidade_name,
			ufId: record.estado_id,
			ufName: record.estado_name,
			managerId: record.gestor_id,
			managerName: record.gestor_nome,
			salePointTypeId: record.ponto_de_venda_id,
			salePointTypeName: record.ponto_de_venda_nome,
			status: record.status
		});
	}

	public equals(entity: SalePointModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}