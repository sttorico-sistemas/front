import { useAxios } from "src/core/composables/use_axios";
import { Person } from "../types/person";
import { PersonModel } from "../models/person.model";
import { BaseError } from "src/core/errors/base.error";
import { PaginatedResultOutput, PaginationArgs } from "src/core/types/pagination.type.d";

export class PersonRepository {
  private http = useAxios();

  private getPersonModel(person: Person): PersonModel {
    return new PersonModel({
      cpf: person.cpf,
      name: person.name,
      vinculo: person.vinculo,
      contratante: person.contratante,
      contacts: person.contacts,
      addresses: person.addresses,
    });
  }

  async getAllPersons(pagination?: PaginationArgs, query?: string): Promise<PaginatedResultOutput<Person>> {
    try {
      const response = await this.http.get('/persons', {
        params: {
          'per_page': pagination?.limit ?? 10,
          'page': pagination?.page ?? 1,
          'search': query,
        }
      });
      return {
        total: response.data.data.meta.total,
        items: (response.data.data.data as []).map(
          (e) => PersonModel.fromRecord(e),
        ),
      }
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async getPersonById(id: number): Promise<Person> {
    try {
      const response = await this.http.get(`/persons/${id}`);
      return PersonModel.fromRecord(response.data.data);
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async createPerson(person: Person): Promise<Person> {
    try {
      const personModel = this.getPersonModel(person);
      const response = await this.http.post('/persons', personModel.toRecord());
      return PersonModel.fromRecord(response.data.data);
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async updatePerson(person: Person): Promise<void> {
    try {
      const personModel = this.getPersonModel(person);
      await this.http.put(`/persons/${person.cpf}`, personModel.toRecord());
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async deletePerson(cpf: string): Promise<void> {
    try {
      await this.http.delete(`/persons/${cpf}`);
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }
}