<script lang="ts" setup>
	import { reactive, ref } from 'vue'
  const props = defineProps({
		cols: {
			type: Array as PropType<Object>,
			required: true,
		},
		rows: {
			type: Array as PropType<Object>,
			required: true,
		},
		pagination: {
			type: Boolean,
			default: false,
		},
    title: {
      type: String,
      default: 'Pontos de Vendas',
    },
		btnAdd: {
			type: Boolean,
			default: true,
		},
	})

	// Componentes
	import titulo from '@components/layout/tituloLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'
	import modalLayout from '@components/layout/modalLayout.vue'
  import ConsultasExport from '../../consultas/consultas-export/consultas-export.vue'

	import CadastroModalPontoVenda from '../cadastro-modal-ponto-venda/cadastro-modal-ponto-venda.vue'

	// Icons
  import IconAdd from '@icons/iconAdd.vue'
  import IconEdit from '@icons/iconEdit.vue'
	import IconEye from '@icons/iconEye.vue'
	import IconClear from '@icons/iconClear.vue'
	import IconPrinter from '@icons/iconPrinter.vue'
  import IconCheck from '@icons/iconCheck.vue'
	import IconBlock from '@icons/iconBlock.vue'

	// Declarações
	const isOpenDialog = ref<boolean>(false)
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const pdv = ref<string>('')
	const cidade = ref<string>('')
	const status = ref<string>('')

	// Script
	const clearFilter = () => {
		pdv.value = ''
		cidade.value = ''
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
		}
	}

	const filtered = (value: string = '') => {
		if (value === '') return props.rows

    if (selected.type === 'pdv')
			return props.rows.filter((item: any) => item.pdv === value)

		if (selected.type === 'status')
			return props.rows.filter((item: any) => item.status === value)

    if (selected.type === 'cidade')
			return props.rows.filter((item: any) => item.cidade === value)
	}

  const parseCols = (): Array<object> => {
		return [
      { field: 'id', title: '#', hide: false, sort: false },
      { field: 'ponto_venda', title: 'Ponto de Venda', hide: false },
      { field: 'pdv', title: 'Tipo PDV', hide: false, sort: false },
      { field: 'cidade', title: 'Cidade', hide: false },
      { field: 'status', title: 'Status', hide: false },
    ]
	}
</script>
<template>
	<main>
		<div class="panel mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
        <div class="flex items-center gap-14">
					<titulo :title="props.title" />
					<button
						:class="!props.btnAdd ? 'hidden' : ''"
						@click="isOpenDialog = true"
						v-tippy:right
					>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo</tippy
					>
				</div>

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
          <multiselect
						v-model="pdv"
						:options="['Agência', 'PAB']"
						class="custom-multiselect min-w-[200px]"
						placeholder="Tipo PDV"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'pdv')"
					/>
					<multiselect
						v-model="cidade"
						:options="['Brasília - DF', 'Florianópolis - SC']"
						class="custom-multiselect min-w-[200px]"
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
						v-model="status"
						:options="['Ativo', 'Inativo']"
						class="custom-multiselect min-w-[122px]"
						placeholder="Status"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'status')"
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
							:rows="props.rows"
							filename=""
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
					:columns="props.cols"
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
          <template #actions="data">
						<div class="flex">
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
								>
									<icon-eye class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Visualizar</tippy
								>
							</div>
              <div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
								>
									<icon-edit class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Editar</tippy
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
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout
			title="Cadastro Ponto de Venda"
			:is-open="isOpenDialog"
			size="max-w-[490px]"
			@btn-close="isOpenDialog = false"
		>
			<!-- Datatable-->
			<cadastro-modal-ponto-venda
				@btn-cancelar="isOpenDialog = false"
			/>
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

		.multiselect__option {
			font-size: 0.75rem;
			line-height: 1rem;
			white-space: normal;
		}
	}
</style>
