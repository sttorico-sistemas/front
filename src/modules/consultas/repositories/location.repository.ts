import { useAxios } from "src/core/composables/use_axios";
import { BaseError } from "src/core/errors/base.error";
import { LocationState } from "../types/location_state.d";
import { LocationStateModel } from "../models/location_state.model";

export class LocationRepository {
  private http = useAxios();

  async getStates(): Promise<LocationState[]> {
    try {
      const response = await this.http.get('/estados');
      return (response.data.data as []).map(
        (e) => LocationStateModel.fromRecord(e),
      );
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }
}