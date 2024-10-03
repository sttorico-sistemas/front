<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import breadcrumbs from '@/core/components/Breadcrumbs.vue'
import titulo from '@/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'

import ImageName from 'src/modules/consultas/components/ConsultasHistorico/DatatableColunaImageName.vue'

// Icons
import IconClear from '@/core/components/icons/iconClear.vue'
import IconNote from '@/core/components/icons/iconNote.vue'

// Declarações
const selected = reactive<{ type: string; label: string }>({
	type: '',
	label: '',
})
const prazo = ref<string>('')
const cols = reactive([
	{ field: 'id', title: '#', hide: false },
	{ field: 'ins_financeira', title: 'Instituição Financeira', hide: false },
	{ field: 'prazo_meses', title: 'Prazo em Meses', hide: false },
	{ field: 'tax_juros', title: 'Taxa de Juros (%am)', hide: false },
	{ field: 'cet_mensal', title: 'CET Mensal (%am)', hide: false },
	{ field: 'cet_anual', title: 'CET Anual (%aa)', hide: false },
	{ field: 'solicitar_proposta', title: 'Solicitar Proposta', hide: false },
])
const rows = reactive([
	{
		id: 1,
		ins_financeira: {
			nome: 'Banco do Brasil',
			tipo: 'Instituição Financeira',
			icone: '',
		},
		prazo_meses: '120',
		tax_juros: '2,41',
		cet_mensal: '22,41',
		cet_anual: '28,00',
	},
	{
		id: 2,
		ins_financeira: {
			nome: 'Santander Brasil',
			tipo: 'Instituição Financeira',
			icone: '',
		},
		prazo_meses: '320',
		tax_juros: '2,41',
		cet_mensal: '22,41',
		cet_anual: '28,00',
	},
])

// Script
const clearFilter = () => {
	prazo.value = ''

	selected.label = ''
	selected.type = ''
}

const filtered = (value: string = '') => {
	if (value === '') return rows

	if (selected.type === 'prazo')
		return rows.filter((item: any) => item.prazo_meses === value)
}
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Simulador', 'Taxas de Juros']" />
		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<titulo title="Tabela das Taxas de Juros de Empréstimos Financeiros"
					info-message="Alguma mensagem aqui para tirar dúvida sobre a página" />

				<div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
					<multiselect v-model="prazo" :options="['120', '320']" class="custom-multiselect max-w-[200px]"
						placeholder="Selecione o Prazo" :searchable="false" :preselect-first="false" :allow-empty="false"
						selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'prazo')" />

					<div>
						<button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
							<icon-clear class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
					:sortable="true" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="false">
					<template #id="data"> {{ data.value.id }}º </template>
					<template #ins_financeira="data">
						<image-name image="https://placehold.co/30x30" :name="data.value.ins_financeira.nome" />
					</template>
					<template #solicitar_proposta="data">
						<button v-tippy:right type="button" class="text-xs m-1">
							<icon-note class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="right" placement="right">Algum texto aqui {{ data.value.id }}</tippy>
					</template>
				</vue3-datatable>
				<p class="text-danger text-sm font-bold text-center mt-5">
					A tabela não possui as taxas de juros atualizadas diariamente, o que
					significa que os dados podem sofrer alterações.
				</p>
			</div>
		</div>
	</main>
</template>
<style lang="scss" scoped>
.header_actions:deep(.custom-multiselect) {
	.multiselect__placeholder {
		font-size: 0.75rem;
		line-height: 1rem;
		font-weight: 600;
		white-space: nowrap;
		color: rgb(14 23 38);
	}

	.multiselect__option {
		font-size: 0.75rem;
		line-height: 1rem;
		white-space: normal;
	}
}
</style>
