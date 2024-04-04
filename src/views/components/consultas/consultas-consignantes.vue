<script lang="ts" setup>
	import { reactive, ref } from 'vue'
	import router from 'src/router'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'

	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ConsultasTitulo from './consultas-titulo/consultas-titulo.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'
	import IconEye from '@icons/iconEye.vue'
	import IconPrinter from '@icons/iconPrinter.vue'
	import IconAdd from '@icons/iconAdd.vue'
	import IconUser from '@icons/iconUser.vue'
	import IconCheck from '@icons/iconCheck.vue'
	import IconUnlock from '@icons/iconUnlock.vue'
	import IconBlock from '@icons/iconBlock.vue'
	import IconLock from '@icons/iconLock.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const consignante = ref<string>('')
	const cidade = ref<string>('')
	const tp_entidade = ref<string>('')
	const data_final = ref<string>('')
	const status = ref<string>('')
	const averbacao = ref<string>('')
	const cols = reactive([
		{ field: 'consignante', title: 'Consignante', hide: false, },
		{ field: 'tp_entidade', title: 'Tp Entidade', hide: false, },
		{ field: 'cidade', title: 'Cidade/UF', hide: false, },
		{ field: 'dt_inicial', title: 'Dt Inicial', hide: false, },
		{ field: 'dt_final', title: 'Dt Final', hide: false, },
		{ field: 'status', title: 'Status', hide: false, },
		{ field: 'averbacao', title: 'Averbação', hide: false, },
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
	])
	const rows = reactive([
		{
			id: 1,
			consignante: 'IPMAT',
			tp_entidade: 'INSTITUTO PREVIDENCIA',
			cidade: 'AMIRANTE TAMANDARÉ - PR',
			dt_inicial: '23/03/2018',
			dt_final: '23/03/2023',
			status: 'Inativo',
			averbacao: 'Bloqueada',
		},
		{
			id: 2,
			consignante: 'PREFEITURA DE CAMBORIÚ',
			tp_entidade: 'GOVERNO MUNICIPAL',
			cidade: 'CAMBORIÚ - SC',
			dt_inicial: '20/08/2020',
			dt_final: '20/08/2024',
			status: 'Ativo',
			averbacao: 'Liberada',
		},
	])

	// Script
	const clearFilter = () => {
		consignante.value = ''
		cidade.value = ''
		tp_entidade.value = ''
		data_final.value = ''
		status.value = ''
		averbacao.value = ''

		selected.label = ''
		selected.type = ''
	}

	const color = (id: number | string): string => {
		switch (id) {
			case 'Ativo':
				return 'bg-success' // Ativo
			case 'Inativo':
				return 'bg-warning' // Inativo
			case 'Bloqueada':
			 	return 'bg-secondary' // Bloqueada 
			case 'Liberada':
				return 'bg-success' // Liberada
		}
	}

	const filtered = (value: string = '') => {
		if (value === '') return rows

		if (selected.type === 'consignante')
			return rows.filter((item: any) => item.consignante === value)

		if (selected.type === 'cidade')
			return rows.filter((item: any) => item.cidade === value)

		if (selected.type === 'tp_entidade')
			return rows.filter((item: any) => item.tp_entidade === value)

		if (selected.type === 'data_final')
			return rows.filter((item: any) => item.dt_final === value)

		if (selected.type === 'status')
			return rows.filter((item: any) => item.status === value)

		if (selected.type === 'averbacao')
			return rows.filter((item: any) => item.averbacao === value)
	}

	const parseCols = (): Array<object> => {
		return [
			{ field: 'consignante', title: 'Consignante', hide: false },
			{ field: 'tp_entidade', title: 'Tp Entidade', hide: false },
			{ field: 'cidade', title: 'Cidade/UF', hide: false },
			{ field: 'dt_inicial', title: 'Dt Inicial', hide: false },
			{ field: 'dt_final', title: 'Dt Final', hide: false },
			{ field: 'status', title: 'Status', hide: false, sort: false, },
			{ field: 'averbacao', title: 'Averbação', hide: false, sort: false, },
		]
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Consignantes']" />
		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex items-center gap-14">
					<consultas-titulo title="Consignantes" />
					<button v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo Consignante</tippy
					>
				</div>

				<div
					class="header_actions flex items-center gap-5"
				>
					<multiselect
						v-model="consignante"
						:options="['IPMAT', 'PREFEITURA DE CAMBORIÚ']"
						class="custom-multiselect max-w-[200px]"
						placeholder="Consignante Master"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'consignante')"
					/>
					<multiselect
						v-model="cidade"
						:options="['AMIRANTE TAMANDARÉ - PR', 'CAMBORIÚ - SC']"
						class="custom-multiselect max-w-[150px]"
						placeholder="Cidade"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'cidade')"
					/>
					<multiselect
						v-model="tp_entidade"
						:options="['INSTITUTO PREVIDENCIA', 'GOVERNO MUNICIPAL']"
						class="custom-multiselect max-w-[150px]"
						placeholder="Tipo Entidade"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'tp_entidade')"
					/>
					<multiselect
						v-model="data_final"
						:options="['23/03/2023', '20/08/2024']"
						class="custom-multiselect max-w-[120px]"
						placeholder="Data Final"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'data_final')"
					/>
					<multiselect
						v-model="status"
						:options="['Inativo', 'Ativo']"
						class="custom-multiselect max-w-[120px]"
						placeholder="Status"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'status')"
					/>
					<multiselect
						v-model="averbacao"
						:options="['Bloqueada', 'Liberada']"
						class="custom-multiselect max-w-[120px]"
						placeholder="Averbação"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'averbacao')"
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
							:cols="parseCols()"
							:rows="rows"
							filename="Consignatárias Habilitadas"
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
					<template #status="data">
						<span
							class="flex justify-center badge !w-[80px] h-[22px]"
							:class="color(data.value.status)"
							>{{ data.value.status }}</span
						>
					</template>
					<template #averbacao="data">
						<span
							class="flex justify-center badge !w-[80px] h-[22px]"
							:class="color(data.value.averbacao)"
							>{{ data.value.averbacao }}</span
						>
					</template>
					<template #actions="data">
						<div class="flex">
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
									@click="router.push({ name: 'cadastro-consignante', params: { id: '1' } })"						
								>
									<icon-eye class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Ver Consignante</tippy
								>
							</div>
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"							
								>
									<icon-user class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Usuário {{ data.value.consignante }}</tippy
								>
							</div>
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"							
								>
									<icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
									<icon-block v-else class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}</tippy
								>
							</div>
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"							
								>
									<icon-unlock v-if="data.value.averbacao === 'Liberada'" class="w-5 h-5 text-primary_3-table" />
									<icon-lock v-else class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>{{ data.value.averbacao === 'Liberada' ? 'Liberar' : 'Bloquear' }}</tippy
								>
							</div>
						</div>
					</template>
				</vue3-datatable>
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
	}
</style>
