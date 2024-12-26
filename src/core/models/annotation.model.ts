import { BaseModel } from "@/core/models/base.model";

export class AnnotationModel extends BaseModel {
	public id?: number
	public title: string
	public operatorName: string
	public createdAt: string

	constructor(props: {
		id?: number;
		title: string;
		operatorName: string;
		createdAt: string;
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.title = props.title;
		this.operatorName = props.operatorName;
		this.createdAt = props.createdAt;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			titulo: this.title,
			operator: this.operatorName,
			data: this.createdAt,
		}
	}

	static fromRecord(record: Record<string, any>): AnnotationModel {
		return new AnnotationModel({
			id: record.id,
			title: record.titulo,
			operatorName: record.operatorName,
			createdAt: record.data
		});
	}
}