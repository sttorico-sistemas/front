import { PermissionModel } from "@/core/models/permission.model";
import { WatchedList } from "@/core/models/watched-list";


export class PermissionList extends WatchedList<PermissionModel> {
	compareItems(a: PermissionModel, b: PermissionModel): boolean {
		return a.equals(b)
	}
}