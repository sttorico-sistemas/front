export function formatCEP(cep: string) {
	cep = cep.replace(/\D/g, '');
	return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}