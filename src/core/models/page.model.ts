import { BaseModel } from "src/core/models/base.model";

export type PageLinks = {
	id: number
	name: string
	slug: string
	url: string
}

export class PageModel extends BaseModel {
	public id?: number
	public name: string
	public url: string
	public parentId?: number | null
	public slug: string
  public children: PageLinks[];

  constructor( props: {
    id?: string;
    name: string;
    url: string;
		parentId?: string | null
    slug: string;
    children: PageLinks[];
  }) {
    super();
    this.id = props?.id ? +props.id : undefined;
    this.name = props.name;
    this.url = props.url;
    this.parentId = props?.parentId ? +props.parentId : undefined;
    this.slug = props.slug;
    this.children = props.children;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
			parent_id: this.parentId,
      url: this.url
    }
  }

  static fromRecord(record: Record<string, any>): PageModel {
    return new PageModel({
      id: record.id,
      name: record.name,
			url: record.url,
			parentId: record.parent_id,
      slug: record.slug,
      children: record.children,
    });
  }
}