import { AddressModel } from "@/core/models/address.model";
import { WatchedList } from "@/core/models/watched-list";


export class AddressList extends WatchedList<AddressModel> {
	compareItems(a: AddressModel, b: AddressModel): boolean {
		return a.equals(b)
	}
}