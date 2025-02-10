<script lang="ts" setup>
import { PropType, reactive, ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import ImageName from 'src/modules/consultas/components/ConsultasHistorico/DatatableColunaImageName.vue'
import modalLayout from 'src/core/components/Modal.vue'
import ConsultasExport from 'src/modules/consultas/components/ConsultasExport.vue'
import cadastroModalHabilitarConsignatarias from './Modal/HabilitarConsignatarias.vue'
import modalHabilitarPontoVenda from './Modal/HabilitarPontoVenda.vue'
import modalHabilitarBackoffice from './Modal/HabilitarBackoffice.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconUnlock from 'src/core/components/Icons/IconUnlock.vue'
import IconLock from 'src/core/components/Icons/IconLock.vue'
import IconShieldCheck from 'src/core/components/Icons/IconShieldCheck.vue'
import IconShieldUser from 'src/core/components/Icons/IconShieldUser.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconHabilitar from 'src/core/components/Icons/IconHabilitar.vue'
import IconDesabilitar from 'src/core/components/Icons/IconDesabilitar.vue'
import IconCartaoCreditoServico from 'src/core/components/Icons/Services/IconCartaoCreditoServico.vue'
import IconEmprestimoServico from 'src/core/components/Icons/Services/IconEmprestimosServicos.vue'
import IconMensalidadeServico from 'src/core/components/Icons/Services/IconMensalidadeServicos.vue'
import IconPlanoSaudeServico from 'src/core/components/Icons/Services/IconPlanoSaudeServico.vue'
import IconSegurosServico from 'src/core/components/Icons/Services/IconSegurosServico.vue'
import { Col } from 'types/col.d'

type RowData = {
	id: number;
	consignante?: string;
	consignataria?: { nome: string };
	tipo_instituicao: string;
	tipo_servicos: { nome: string }[];
	data_habilitacao: string;
	data_renovação: string;
	status: string;
	averbacao: string;
}

const props = withDefaults(defineProps<{
	cols: Col[];
	rows: RowData[];
	pagination?: boolean;
	title?: string;
	typeScreen?: string;
}>(), {
	pagination: false,
	title: '',
	typeScreen: 'consignante',
});

const isOpenDialog = ref(false)
const isOpenDialogPontoVenda = ref(false)
const isOpenDialogBackOffice = ref(false)
const selected = reactive({
	type: '',
	label: '',
})
const consignante = ref('')
const servico = ref('')
const status = ref('')
const instituicao = ref('')
const averbacao = ref('')

const clearFilter = () => {
	servico.value = ''
	status.value = ''
	instituicao.value = ''
	averbacao.value = ''
	consignante.value = ''

	selected.label = ''
	selected.type = ''
}

const color = (value: string): string | undefined => {
	switch (value) {
		case 'Ativo':
			return 'bg-success'
		case 'Liberada':
			return 'bg-success'
		case 'Inativo':
			return 'bg-warning'
		case 'Bloqueada':
			return 'bg-secondary'
		case 'Desabilitado':
			return 'bg-warning'
		case 'Habilitado':
			return 'bg-success'
	}
}

const filtered = (value: string = '') => {
	if (value === '') return props.rows

	if (selected.type === 'consignante')
		return props.rows.filter((item: any) => item.consignante === value)

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

const parseCols = (): Col[] => {
	return [
		{ field: 'id', title: '#', hide: false, sort: false },
		{ field: 'consignante', title: 'Consignante', hide: false },
		{ field: 'tipo_instituicao', title: 'Instituição', hide: false },
		{ field: 'tipo_servicos', title: 'Serviços', hide: false },
		{ field: 'data_habilitacao', title: 'Data Habilitação', hide: false },
		{ field: 'data_renovação', title: 'Data Renovação', hide: false },
		{ field: 'status', title: 'Status', hide: false },
		{ field: 'averbacao', title: 'Averbação', hide: false },
	]
}

const parseRows = (): Record<string, any>[] => {
	return props.rows.map((row) => {
		const services = row.tipo_servicos.map((servico) => servico.nome)
		return {
			id: row.id,
			consignante: row.consignante,
			consignataria: row.consignataria,
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
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo :title="props.title" />
					<button :class="props.typeScreen === 'consignataria' ? 'hidden' : ''" @click="isOpenDialog = true"
						v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Habilitar Nova Consignatária</tippy>
				</div>

				<div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
					<multiselect v-model="consignante" :options="['Prefeitura de Florianópolis', 'Governo do Mato Grosso']"
						class="custom-multiselect min-w-[200px]" placeholder="Consignantes" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'consignante')" />
					<multiselect v-model="instituicao" :options="['Instituição Financeira', 'Cooperativa de Crédito']"
						class="custom-multiselect min-w-[200px]" placeholder="Tipo de Instituição" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'instituicao')" />
					<multiselect v-model="servico" :options="['Emprestimo', 'Cartão de Crédito', 'Seguros']"
						class="custom-multiselect min-w-[200px]" placeholder="Tipo de serviço" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'servico')" />
					<multiselect v-model="status" :options="['Ativo', 'Inativo']" class="custom-multiselect min-w-[122px]"
						placeholder="Status" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
						select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'status')" />
					<multiselect v-model="averbacao" :options="['Bloqueada', 'Liberada']" class="custom-multiselect min-w-[122px]"
						placeholder="Averbação" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
						select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'averbacao')" />

					<div>
						<button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
							<icon-clear class="w-5 h-5 text-primary" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div>
						<consultas-export v-tippy:top :cols="parseCols()" :rows="parseRows()" filename="Consignatárias Habilitadas"
							export-type="print">
							<template #icon>
								<icon-printer class="w-5 h-5" />
							</template>
						</consultas-export>
						<tippy target="top" placement="top">Imprimir</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="filtered(selected.label)" :columns="props.cols"
					:total-rows="filtered(selected.label)?.length" :sortable="true" skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado" pagination-primary="Mostrando {0} a {1} de {2} entradas">
					<template #consignataria="data">
						<image-name image="https://placehold.co/30x30" :name="data.value.consignataria.nome" />
					</template>
					<template #consignante="data">
						{{ data.value.consignante }}
					</template>
					<template #tipo_servicos="data">
						<div class="flex">
							<template v-for="(tipo_servico, idx) in data.value.tipo_servicos" :key="idx">
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
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
							data.value.status }}</span>
					</template>
					<template #averbacao="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.averbacao)">{{
							data.value.averbacao }}</span>
					</template>
					<template #habilitacao="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.habilitacao)">{{
							data.value.habilitacao }}</span>
					</template>
					<template #actions="data">
						<div class="flex">
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-edit class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Editar</tippy>
							</div>
							<div v-if="props.typeScreen === 'consignante'">
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-habilitar v-if="data.value.habilitacao === 'Desabilitado'"
										class="w-5 h-5 text-primary" />
									<icon-desabilitar v-else class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">{{ data.value.habilitacao === 'Desabilitado' ? 'Habilitar' :
									'Desabilitar' }}</tippy>
							</div>
							<div v-if="props.typeScreen === 'consignante'">
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-unlock v-if="data.value.averbacao === 'Liberada'" class="w-5 h-5 text-primary" />
									<icon-lock v-else class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">{{ data.value.averbacao === 'Liberada' ? 'Liberar' : 'Bloquear'
									}}</tippy>
							</div>
							<div v-if="props.typeScreen === 'consignataria'">
								<button v-tippy:right type="button" class="text-xs m-1" @click="isOpenDialogBackOffice = true">
									<icon-shield-check class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Backoffice</tippy>
							</div>
							<div v-if="props.typeScreen === 'consignataria'">
								<button v-tippy:right type="button" class="text-xs m-1" @click="isOpenDialogPontoVenda = true">
									<icon-shield-user class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Ponto de venda</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout title="Habilitar Consignatárias" :is-open="isOpenDialog" size="max-w-[490px]"
			@btn-close="isOpenDialog = false">
			<!-- Datatable-->
			<cadastro-modal-habilitar-consignatarias @btn-cancelar="isOpenDialog = false" />
			<!-- Datatable-->
		</modal-layout>

		<modal-layout title="Habilitar Pontos de Venda para Consignante" :is-open="isOpenDialogPontoVenda" size="max-w-full"
			@btn-close="isOpenDialogPontoVenda = false">
			<template #icon>
				<component :is="IconShieldUser" />
			</template>
			<modal-habilitar-ponto-venda @btn-cancelar="isOpenDialogPontoVenda = false" />
		</modal-layout>

		<modal-layout title="Habilitar Backoffice para Consignante" :is-open="isOpenDialogBackOffice" size="max-w-full"
			@btn-close="isOpenDialogBackOffice = false">
			<template #icon>
				<component :is="IconShieldCheck" />
			</template>
			<modal-habilitar-backoffice @btn-cancelar="isOpenDialogBackOffice = false" />
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
