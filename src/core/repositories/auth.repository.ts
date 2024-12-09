import { useAxios } from "src/core/composables/use_axios";
import { BaseError } from "src/core/errors/base.error";
import { HttpClientProps } from "@/modules/configuracoes/types/http-client";
import { Ref } from "vue";
import { UserModel } from "@/core/models";

export class AuthRepository {
	private http = useAxios();
	#QUERY_KEY = 'auth'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async login(body: { username: string, password: string }, configParams?: HttpClientProps<UserModel>): Promise<{
		authToken: string
		tokenType: string
	}> {
		try {
			const response = await this.http.post<{ data: any }, any>(`/login`, {
				cpf: body.username,
				password: body.password,
			});

			return {
				authToken: response.data.authToken as string,
				tokenType: response.data.token_type as string,
			}
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getYourself(configParams?: HttpClientProps<UserModel>): Promise<UserModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/user`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return UserModel.fromRecord(response)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}
