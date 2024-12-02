import { ContactModel } from "@/core/models/contact.model";
import { WatchedList } from "@/core/models/watched-list";

export class ContactList extends WatchedList<ContactModel> {
	compareItems(a: ContactModel, b: ContactModel): boolean {
		return a.equals(b)
	}
}