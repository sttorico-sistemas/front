export type StatusFormatted = {
	text: string;
	bgColor: string;
	textColor: string;
	raw: number | string
}

export function formatStatus(status: number | string): StatusFormatted {
	switch (status) {
		case 'suspenso': {
			return {
				text: 'Suspenso',
				bgColor: '#E2a03f',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'inativo':
		case 0: {
			return {
				text: 'Inativo',
				bgColor: '#E2a03f',
				textColor: '#f8fafc',
				raw: status
			}
		}


		case 'liberado':  {
			return {
				text: 'Liberado',
				bgColor: '#00AB55',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'habilitado':  {
			return {
				text: 'Habilitado',
				bgColor: '#00AB55',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'vigente':  {
			return {
				text: 'Vigente',
				bgColor: '#00AB55',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'ativo':
		case 1: {
			return {
				text: 'Ativo',
				bgColor: '#00AB55',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'baixado': {
			return {
				text: 'Baixado',
				bgColor: '#805dca',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'bloqueado': {
			return {
				text: 'Bloqueado',
				bgColor: '#805dca',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'revogado': {
			return {
				text: 'Revogado',
				bgColor: '#e7515a',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'cancelado': {
			return {
				text: 'Cancelado',
				bgColor: '#e7515a',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'desabilitado': {
			return {
				text: 'Desabilitado',
				bgColor: '#e7515a',
				textColor: '#f8fafc',
				raw: status
			}
		}

		case 'reservado': {
			return {
				text: 'Reservado',
				bgColor: '#1384ad',
				textColor: '#f8fafc',
				raw: status
			}
		}

		default: {
			return {
				text: 'Desconhecido',
				bgColor: '#94a3b8',
				textColor: '#f8fafc',
				raw: status
			}
		}
	}
}