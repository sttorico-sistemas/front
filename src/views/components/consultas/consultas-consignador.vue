<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import titulo from '@components/layout/tituloLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'
  import modalLayout from '@components/layout/modalLayout.vue'
	import VueCollapsible from 'vue-height-collapsible/vue3'

  import ConsultasCadastroConsignador from './consultas-cadastro-pessoa/consultas-cadastro-consignador.vue'
  import FiltroCompleto from './consultas-cadastro-pessoa/consultas-filtros-consignador/consultas-filtros-completo.vue'
  import FiltroSimples from './consultas-cadastro-pessoa/consultas-filtros-consignador/consultas-filtros-simples.vue'
	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ImageName from './consultas-historico/datatable-coluna-image-name.vue'

	// Icons
  import IconAdd from '@icons/iconAdd.vue'
	import IconClear from '@icons/iconClear.vue'
	import IconEye from '@icons/iconEye.vue'
	import IconPrinter from '@icons/iconPrinter.vue'
  import IconCheck from '@icons/iconCheck.vue'
  import IconBlock from '@icons/iconBlock.vue'
	import IconCaretDown from '@icons/iconCaretDown.vue'
	import IconUser from '@icons/iconUser.vue'
	import IconUnlock from '@icons/iconUnlock.vue'
	import IconLock from '@icons/iconLock.vue'
	import IconFilter from '@icons/iconFilter.vue'

	// Declarações
	const accordians = reactive({
		consignadores: false,
		filtros: false,
	})
  const isOpenDialog = ref(false)
  const isOpenDialogCadastrarPessoa = ref(false)
	const cols = reactive([
		{ field: 'id', title: 'ID', hide: true },
		{ field: 'consignador', title: 'Consignador', hide: false },
		{ field: 'cpf', title: 'CPF', hide: false },
		{ field: 'matricula', title: 'Matrícula', hide: false },
		{ field: 'averbador', title: 'Averbador', hide: false },
		{ field: 'regime', title: 'Regime', hide: false },
		{ field: 'categoria', title: 'Categoria', hide: false },
		{ field: 'situacao', title: 'Situação Func', hide: false },
		{ field: 'status', title: 'Status Cad', hide: false },
		{ field: 'averbacao', title: 'Averbação', hide: false },
		{ field: 'acao', title: 'Ação', hide: false, sort: false },
	])
	const rows = reactive([
		{
      id: 1,
      consignador: 'João da Silva',
      cpf: '356.859.789-99',
      matricula: '123456789101112',
      averbador: 'RH Prefeitura',
      regime: 'Estatutário',
      categoria: 'Inativo',
      situacao: 'Ativa',
      status: 'Inativo',
      averbacao: 'Bloqueada',
    },
	])

	// Script
	const clearFilter = () => {
		nome.value = ''
		cpf.value = ''
		consignante.value = ''
		averbador.value = ''
		status.value = ''

		selected.label = ''
		selected.type = ''
	}

	const color = (value: string): string => {
		switch (value) {
			case 'Ativo':
				return 'bg-success' // Ativo
      case 'Liberada':
        return 'bg-success'
			case 'Inativo':
				return 'bg-warning' // Inativo
			case 'Bloqueada':
				return 'bg-secondary'
		}
	}

	const parseRows = (): Array<object> => {
		return rows.map((row) => {
			return {
        id: row.id,
        consignador: row.consignador,
        cpf: row.cpf,
        matricula: row.matricula,
        averbador: row.averbador,
        regime: row.regime,
        categoria: row.categoria,
        situacao: row.situacao,
        status: row.status,
        averbacao: row.averbacao,
			}
		})
	}

	const parseCols = (): Array<object> => {
		return [
			{ field: 'id', title: 'ID', hide: true },
			{ field: 'consignador', title: 'Consignador', hide: false },
			{ field: 'cpf', title: 'CPF', hide: false },
			{ field: 'matricula', title: 'Matrícula', hide: false },
			{ field: 'averbador', title: 'Averbador', hide: false, sort: false },
			{ field: 'regime', title: 'Regime', hide: false, sort: false },
			{ field: 'categoria', title: 'Categoria', hide: false, sort: false },
			{ field: 'situacao', title: 'Situação Func', hide: false, sort: false },
			{ field: 'status', title: 'Status Cad', hide: false, sort: false },
			{ field: 'averbacao', title: 'Averbação', hide: false, sort: false },
		]
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Consignador']" />

		<filtro-simples />

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.filtros === true ? (accordians.filtros = false) : (accordians.filtros = true)"
			>
				<div class="flex items-center gap-2 text-primary_3-table"><icon-filter /> Filtros</div>
				<div
					:class="{ 'rotate-180': accordians.filtros === true }"
				>
					<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.filtros === true">
				<filtro-completo />
			</vue-collapsible>
		</div>

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.consignadores=== true ? (accordians.consignadores= false) : (accordians.consignadores= true)"
			>
				Lista Consignadores
				<div
					:class="{ 'rotate-180': accordians.consignadores=== true }"
				>
					<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.consignadores=== true">
				<div class="panel pb-0 mt-6">
					<div
						class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
					>

						<div class="flex items-center gap-14">
							<titulo title="Consignadores" />
						</div>

						<div
							class="header_actions flex flex-wrap md:flex-nowrap items-center gap-5"
						>
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
									:cols="parseCols()"
									:rows="parseRows()"
									filename="Histórico das Solicitações"
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
							:rows="rows"
							:columns="cols"
							:total-rows="rows.length"
							:sortable="true"
							skin="whitespace-nowrap bh-table-striped"
							no-data-content="Nenhum dado foi encontrado"
							pagination-info="Mostrando {0} a {1} de {2} entradas"
						>
							<template #status="data">
								<span
									class="flex justify-center badge !w-[110px] h-[22px]"
									:class="color(data.value.status)"
									>{{ data.value.status }}</span
								>
							</template>
							<template #averbacao="data">
								<span
									class="flex justify-center badge !w-[110px] h-[22px]"
									:class="color(data.value.averbacao)"
									>{{ data.value.averbacao }}</span
								>
							</template>
							<template #acao="data">
								<div class="flex">
									<div>
										<button
											v-tippy:right type="button"
											class="text-xs m-1"
											@click="isOpenDialog = true"
										>
											<icon-eye class="w-5 h-5 text-primary_3-table" />
										</button>
										<tippy target="right" placement="right"
											>Cadastro Matrícula {{ data.value.id }}</tippy
										>
									</div>
									<div>
										<button
											v-tippy:right type="button"
											class="text-xs m-1"
											@click="isOpenDialogCadastrarPessoa = true"
										>
											<icon-user class="w-5 h-5 text-primary_3-table" />
										</button>
										<tippy target="right" placement="right"
											>Cadastro Pessoa {{ data.value.id }}</tippy
										>
									</div>
									<div>
										<div>
											<button
												v-tippy:right
												type="button"
												class="text-xs m-1"
											>
												<icon-check v-if="data.value.status === 'Inativo'" class="w-5 h-5 text-primary_3-table" />
												<icon-block v-else class="w-5 h-5 text-primary_3-table" />
											</button>
											<tippy target="right" placement="right"
												>{{ data.value.status === 'Inativo' ? 'Ativar' : 'Inativar' }}</tippy
											>
										</div>
									</div>
									<div>
										<div>
											<button
												v-tippy:right
												type="button"
												class="text-xs m-1"
											>
												<icon-unlock v-if="data.value.status === 'Inativo'" class="w-5 h-5 text-primary_3-table" />
												<icon-lock v-else class="w-5 h-5 text-primary_3-table" />
											</button>
											<tippy target="right" placement="right"
												>{{ data.value.status === 'Inativo' ? 'Ativar' : 'Bloquear' }}</tippy
											>
										</div>
									</div>
								</div>
							</template>
						</vue3-datatable>
					</div>
				</div>
			</vue-collapsible>
		</div>

    <modal-layout
			size="max-w-full"
			@btn-close="isOpenDialog = false"
		>
			<consultas-cadastro-consignador @btn-cancelar="isOpenDialog = false" />
		</modal-layout>
    <modal-layout
			:is-open="isOpenDialogCadastrarPessoa"
			size="max-w-full"
			@btn-close="isOpenDialogCadastrarPessoa = false"
		>
			<consultas-cadastro-consignador
				@btn-cancelar="isOpenDialogCadastrarPessoa = false"
				:matricula="false"
			/>
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

		.multiselect__option {
			font-size: 0.75rem;
			line-height: 1rem;
			white-space: normal;
		}
	}
</style>
