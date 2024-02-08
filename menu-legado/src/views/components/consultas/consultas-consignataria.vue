<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'

	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ConsultasTitulo from './consultas-titulo/consultas-titulo.vue'
	import ImageName from './consultas-historico/datatable-coluna-image-name.vue'
	import modalLayout from '@components/layout/modalLayout.vue'
	import PontoAtendimento from './consultas-consignatario/pontos-atendimentos.vue'

	// Icons
	import IconCartaoCreditoServico from '@icons/services/iconCartaoCreditoServico.vue'
	import IconClear from '@icons/iconClear.vue'
	import IconEmprestimoServico from '@icons/services/iconEmprestimosServicos.vue'
	import IconEye from '@icons/iconEye.vue'
	import IconMensalidadeServico from '@icons/services/iconMensalidadeServicos.vue'
	import IconPlanoSaudeServico from '@icons/services/iconPlanoSaudeServico.vue'
	import IconPrinter from '@icons/iconPrinter.vue'
	import IconSegurosServico from '@icons/services/iconSegurosServico.vue'

	// Declarações
	const isOpenDialog = ref<boolean>(false)
	const idPontoAtendimento = ref<number>(0)
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const servico = ref<string>('')
	const consignataria = ref<string>('')
	const status = ref<string>('')
	const cols = reactive([
		{ field: 'consignataria', title: 'Consignatária', hide: false },
		{ field: 'tipo_servico', title: 'Tipo de Serviços', hide: false },
		{ field: 'status', title: 'Status', isUnique: true, hide: false },
		{
			field: 'pontos_atendimento',
			title: 'Pontos de Atendimento',
			hide: false,
		},
	])
	const rows = reactive([
		{
			consignataria: {
				nome: 'Banco do Brasil',
				tipo: 'Instituição Financeira',
				icone: '',
			},
			tipo_servicos: [
				{
					nome: 'Emprestimo',
					icone: 'emprestimo',
				},
			],
			status: {
				id: 1,
				label: 'Ativo',
			},
			pontos_atendimento: 5,
		},
		{
			consignataria: {
				nome: 'ASM',
				tipo: 'Associação',
				icone: '',
			},
			tipo_servicos: [
				{
					nome: 'Emprestimo',
					icone: 'emprestimo',
				},
				{
					nome: 'Cartão de Crédito',
					icone: 'cartao-credito',
				},
				{
					nome: 'Seguros',
					icone: 'seguros',
				},
			],
			status: {
				id: 2,
				label: 'Inativo',
			},
			pontos_atendimento: 4,
		},
	])

	// Script
	const clearFilter = () => {
		servico.value = ''
		status.value = ''
	}

	const color = (id: number | string): string => {
		switch (id) {
			case 1:
				return 'bg-success' // Ativo
			case 2:
				return 'bg-warning' // Inativo
			default:
				return '#E0E6ED'
		}
	}

	const filtered = (value: string = '') => {
		if (value === '') return rows

		if (selected.type === 'servico')
			return rows.filter((item: any) => item.tipo_servico === value)

		if (selected.type === 'situacao')
			return rows.filter((item: any) => item.status.label === value)
	}

	const iconeService = (value: string) => {
		switch (value) {
			case 'emprestimo':
				return IconEmprestimoServico
			case 'compras':
				return ''
			case 'mensalidades':
				return IconMensalidadeServico
			case 'cartao-credito':
				return IconCartaoCreditoServico
			case 'cartao-beneficios':
				return ''
			case 'plano-saude':
				return IconPlanoSaudeServico
			case 'financiamentos':
				return ''
			case 'seguros':
				return IconSegurosServico
			default:
				return 'https://placehold.co/30x30?text=TS'
		}
	}

	const openModal = (id: number) => {
		idPontoAtendimento.value = id
		isOpenDialog.value = true
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Consignatárias']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo title="Consignatárias Habilitadas" />

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
					<multiselect
						v-model="consignataria"
						:options="[
							'Banco Daycoval S/A',
							'Meu CaschCard',
							'Banco do Brasil S/A',
							'ASPM',
						]"
						class="custom-multiselect max-w-[200px]"
						placeholder="Tipo de Serviço"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="
							(selected.label = $event), (selected.type = 'consignataria')
						"
					/>
					<multiselect
						v-model="status"
						:options="['Ativo', 'Inativo']"
						class="custom-multiselect max-w-[200px]"
						placeholder="Selecione a Situação"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'situacao')"
					/>

					<div>
						<button
							v-tippy:top
							type="button"
							class="text-xs m-1"
							@click="clearFilter()"
						>
							<icon-clear class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div>
						<consultas-export
							v-tippy:top
							:cols="cols"
							:rows="rows"
							export-type="print"
						>
							<template #icon>
								<icon-printer class="w-5 h-5" />
							</template>
						</consultas-export>
						<tippy target="top" placement="top">Imprimir</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable
					:rows="filtered(selected.label)"
					:columns="cols"
					:total-rows="filtered(selected.label)?.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
				>
					<template #consignataria="data">
						<image-name
							image="https://placehold.co/30x30"
							:name="data.value.consignataria.nome"
							:description="data.value.consignataria.tipo"
						/>
					</template>
					<template #tipo_servico="data">
						<div class="flex">
							<template
								v-for="(tipo_servico, idx) in data.value.tipo_servicos"
								:key="idx"
							>
								<image-name v-tippy:top>
									<component :is="iconeService(tipo_servico.icone)" />
								</image-name>
								<tippy target="top" placement="top">{{
									tipo_servico.nome
								}}</tippy>
							</template>
						</div>
					</template>
					<template #status="data">
						<span
							class="flex justify-center badge !w-[80px] h-[22px]"
							:class="color(data.value.status.id)"
							>{{ data.value.status.label }}</span
						>
					</template>
					<template #pontos_atendimento="data">
						<button
							v-tippy:right
							type="button"
							class="text-xs m-1"
							@click="openModal(data.value.pontos_atendimento)"
						>
							<icon-eye class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="right" placement="right"
							>Ver pontos de atendimento</tippy
						>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout
			:is-open="isOpenDialog"
			size="max-w-full"
			btn-close
			@btn-close="isOpenDialog = false"
		>
			<!-- Datatable-->
			<ponto-atendimento :id="idPontoAtendimento" />
			<!-- Datatable-->
		</modal-layout>
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
	}
</style>
