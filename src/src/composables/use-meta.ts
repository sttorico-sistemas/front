import { useHead } from '@vueuse/head'
import { computed, unref } from 'vue'

const siteTitle = ''
const separator = '|'

const description =
	'O Infoconsig promove a gestão do uso da margem consignável dentro do limite permitido, o monitoramento on-line de todo processo de averbação eletrônica das operações das Consignatárias, e o controle das consignações dos descontos na folha de pagamento, reduz as tarefas do RH e simplifica o fechamento da folha.'

export const usePageTitle = (pageTitle: any) =>
	useHead(
		computed(() => ({
			title: `${unref(pageTitle)} ${separator} ${siteTitle}`,
		})),
	)

export const useMeta = (data: any) => {
	return useHead({ ...data, title: `${data.title} | ${description}` })
}
