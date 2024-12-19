export type StatusFormatted = {
	text: string;
	bgColor: string;
	textColor: string;
	raw: number
}

export function formatStatus(status: number): StatusFormatted {
	switch (status) {
		case 0: {
			return {
				text: 'Inativo',
				bgColor: '#E2A03F',
				textColor: '#f8fafc',
				raw: status
			}
		}

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