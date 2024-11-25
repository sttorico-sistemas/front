import { Table, TableURL } from "@/modules/configuracoes/types";
import { BaseModel } from "src/core/models/base.model";

export type PageLinks = {
	id: number
	name: string
	url: string
}

export class PageModel extends BaseModel {
	public id: number
	public name: string
	public url: string
	public slug: string
  public children: PageLinks[];

  constructor(private props: {
    id: number;
    name: string;
    url: string;
    slug: string;
    children: PageLinks[];
  }) {
    super();
    this.id = this.props.id;
    this.name = this.props.name;
    this.url = this.props.url;
    this.slug = this.props.slug;
    this.children = this.props.children;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      children: this.children,
    }
  }

  static fromRecord(record: Record<string, any>): PageModel {
    return new PageModel({
      id: record.id,
      name: record.name,
			url: record.url,
      slug: record.url,
      children: record.children,
    });
  }
}