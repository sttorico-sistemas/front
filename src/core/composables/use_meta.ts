import { useHead } from '@vueuse/head'
import { computed, unref } from 'vue'

export const useMeta = (data: any): void => {
	return useHead(
		computed(() => ({
			...data,
			title: unref(data.title),
			meta: [
				{
					name: 'description',
					content: unref(`O Infoconsig promove a gestão do uso da
							 margem consignável dentro do limite permitido, o 
							 monitoramento on-line de todo processo de averbação 
							 eletrônica das operações das Consignatárias, 
							 e o controle das consignações dos descontos na 
							 folha de pagamento, reduz as tarefas do 
							 RH e simplifica o fechamento da folha.`),
				},
			],
		})),
	)
}
