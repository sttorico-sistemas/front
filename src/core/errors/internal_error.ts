import { BaseError } from "./base.error";

export class InternalError extends BaseError {
  constructor() {
    super({
      code: 500,
      message: 'Erro interno da aplicação.',
      errors: {},
    });
  }
}