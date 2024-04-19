<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// props
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
	})

	// Componentes
	import titulo from '@components/layout/tituloLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'
	import ImageName from '../../consultas/consultas-historico/datatable-coluna-image-name.vue'
	import modalLayout from '@components/layout/modalLayout.vue'
  import ConsultasExport from '../../consultas/consultas-export/consultas-export.vue'

	import cadastroModalHabilitarConsignatarias from '../cadastro-modal-habilitar-consignatarias/cadastro-modal-habilitar-consignatarias.vue'

	// Icons
  import IconAdd from '@icons/iconAdd.vue'
	import IconEye from '@icons/iconEye.vue'
	import IconClear from '@icons/iconClear.vue'
	import IconPrinter from '@icons/iconPrinter.vue'
  import IconCheck from '@icons/iconCheck.vue'
	import IconUnlock from '@icons/iconUnlock.vue'
	import IconBlock from '@icons/iconBlock.vue'
	import IconLock from '@icons/iconLock.vue'

	import IconCartaoCreditoServico from '@icons/services/iconCartaoCreditoServico.vue'
	import IconEmprestimoServico from '@icons/services/iconEmprestimosServicos.vue'
	import IconMensalidadeServico from '@icons/services/iconMensalidadeServicos.vue'
	import IconPlanoSaudeServico from '@icons/services/iconPlanoSaudeServico.vue'
	import IconSegurosServico from '@icons/services/iconSegurosServico.vue'

	// Declarações
	const isOpenDialog = ref<boolean>(false)
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const servico = ref<string>('')
	const status = ref<string>('')
	const instituicao = ref<string>('')
	const averbacao = ref<string>('')

	// Script
	const clearFilter = () => {
		servico.value = ''
		status.value = ''
		instituicao.value = ''
		averbacao.value = ''

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

	const filtered = (value: string = '') => {
		if (value === '') return props.rows

    if (selected.type === 'instituicao')
			return props.rows.filter((item: any) => item.tipo_instituicao === value)

		if (selected.type === 'servico') {
			return props.rows.filter((item: any) => {
				return item.tipo_servicos.some((servico: any) => servico.nome === value)
			})
		}

		if (selected.type === 'status')
			return props.rows.filter((item: any) => item.status === value)

    if (selected.type === 'averbacao')
			return props.rows.filter((item: any) => item.averbacao === value)
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

	const parseRows = (): Array<object> => {
		return props.rows.map((row) => {
			const services = row.tipo_servicos.map((servico) => servico.nome)

			return {
				consignante: row?.consignante,
				consignataria: row?.consignataria?.nome,
				tipo_instituicao: row.tipo_instituicao,
				tipo_servicos: `${services}`,
        data_habilitacao: row.data_habilitacao,
        data_renovação: row.data_renovação,
        status: row.status,
        averbacao: row.averbacao,
			}
		})
	}
</script>
<template>
	<main>
		<div class="panel mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
        <div class="flex items-center gap-14">
					<titulo title="Consignatárias Habilitadas" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre uma nova Consignatária</tippy
					>
				</div>

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
          <multiselect
						v-model="instituicao"
						:options="['Instituição Financeira', 'Cooperativa de Crédito']"
						class="custom-multiselect min-w-[200px]"
						placeholder="Tipo de Instituição"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'instituicao')"
					/>
					<multiselect
						v-model="servico"
						:options="['Emprestimo', 'Cartão de Crédito', 'Seguros']"
						class="custom-multiselect min-w-[200px]"
						placeholder="Tipo de serviço"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'servico')"
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
          <multiselect
						v-model="averbacao"
						:options="['Bloqueada', 'Liberada']"
						class="custom-multiselect min-w-[122px]"
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
							:cols="cols"
							:rows="parseRows()"
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
					:columns="props.cols"
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
						/>
					</template>
					<template #consignante="data">
						{{ data.value.consignante }}
					</template>
					<template #tipo_servicos="data">
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
								>
									<icon-eye class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Ver Consignatária</tippy
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

		<modal-layout
			title="Habilitar Consignatárias"
			:is-open="isOpenDialog"
			size="max-w-[490px]"
			@btn-close="isOpenDialog = false"
		>
			<!-- Datatable-->
			<cadastro-modal-habilitar-consignatarias @btn-cancelar="isOpenDialog = false" />
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
