import { AxiosError } from "axios";

export class BaseError {
	public code?: number;
	public message: string;
	public errors: {
		[key: string]: string[];
	}

	constructor(private props: {
		code?: number;
		message: string;
		errors: {
			[key: string]: string[];
		}
	}) {
		this.code = this.props.code;
		this.message = this.props.message;
		this.errors = this.props.errors;
	}

	static fromHttpError(e: unknown): BaseError {
		if (e instanceof AxiosError) {
			const error = e as AxiosError;
			return new BaseError({
				code: error.response?.status,
				message: (error.response?.data as any)?.message,
				errors: (error.response?.data as any)?.error ?? {},
			});
		}
		console.log(e);
		throw new BaseError({
			code: 500,
			message: 'Erro interno da aplicação.',
			errors: {},
		});
	}
}