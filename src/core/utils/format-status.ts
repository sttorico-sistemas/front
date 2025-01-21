export type StatusFormatted = {
	text: string;
	bgColor: string;
	textColor: string;
	raw: number | string
}

export function formatStatus(status: number | string): StatusFormatted {
	switch (status) {
		case 'revogado':
		case 0: {
			return {
				text: 'Inativo',
				bgColor: '#E2A03F',
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