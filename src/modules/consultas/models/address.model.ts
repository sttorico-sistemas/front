import { BaseModel } from "src/core/models/base.model";
import { Address } from "../types/address";

export class AddressModel extends BaseModel implements Address {
  public typeId: number;
  public address: string;
  public cityId: number;

  constructor(private props: {
    typeId: number;
    address: string;
    cityId: number;
  }) {
    super();
    this.typeId = this.props.typeId;
    this.address = this.props.address;
    this.cityId = this.props.cityId;
  }

  toRecord(): Record<string, any> {
    return {
      tipo_endereco_id: this.typeId,
      endereco: this.address,
      cidade_id: this.cityId,
    }
  }

  static fromRecord(record: Record<string, any>): AddressModel {
    return new AddressModel({
      typeId: record.tipo_endereco_id,
      address: record.endereco,
      cityId: record.cidade_id,
    });
  }
}