export function formatCNPJ(cpf: string) {
	cpf = cpf.replace(/\D/g, '');
	return cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}