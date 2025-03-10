<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'
import CadastrarIp from './Modal/CadastrarIpIntrucoesProcedimentos.vue'
import IconDoc from 'src/core/components/Icons/IconFile.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import { Col } from 'types/col.d'

const isOpenDialog = ref(false);
const selected = reactive({
	type: '',
	label: '',
})
const cols = reactive<Col[]>([
	{ field: 'id', title: '#', hide: true, sort: false, },
	{ field: 'dcto', title: 'Dcto', hide: false, sort: false, },
	{ field: 'numero', title: 'Número', hide: false, sort: false, },
	{ field: 'instrucao', title: 'Instrução', hide: false, sort: false, },
	{ field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false, },
	{ field: 'data_revogacao', title: 'Data Revogação', hide: false, sort: false, },
	{ field: 'status', title: 'Status', hide: false, sort: false, },
	{ field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: 1,
		dcto: 1,
		numero: 'IP-01-01-22',
		instrucao: 'Gestão de Atendimento',
		data_inicial: '23/03/2018',
		data_revogacao: '',
		status: 'Vigente',
	},
	{
		id: 2,
		dcto: 3,
		numero: 'IP-38-00-23',
		instrucao: 'Comunicação Interna e Externa',
		data_inicial: '23/03/2018',
		data_revogacao: '23/03/2023',
		status: 'Revogado',
	},
])

const color = (value: string) => {
	switch (value) {
		case 'Vigente':
			return 'bg-success'
		case 'Revogado':
			return 'bg-warning'
	}
}

const filtered = (value: string = '') => {
	if (value === '') return rows

	if (selected.type === 'normativo')
		return rows.filter((item: any) => item.tipo === value)

	if (selected.type === 'numero')
		return rows.filter((item: any) => item.numero === value)

	if (selected.type === 'status')
		return rows.filter((item: any) => item.status === value)
}
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="IP-Instrução de Procedimentos" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo IP-Instrução de Procedimentos</tippy>
				</div>

				<div class="header_actions flex items-center gap-5">
					<input id="pesquisa" type="text" placeholder="Pesquisa"
						class="form-input mb-3 md:mb-0 md:min-w-[320px] h-[38px]" />
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="filtered(selected.label)" :columns="cols"
					:total-rows="filtered(selected.label)?.length ?? 0" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-primary="Mostrando {0} a {1} de {2} entradas">
					<template #dcto="data">
						<icon-doc />
					</template>
					<template #status="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
							data.value.status }}</span>
					</template>
					<template #actions="data">
						<div class="flex gap-2">
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-eye class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Visualizar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-edit class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Editar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-block v-if="data.value.status === 'Vigente'" class="w-5 h-5 text-primary" />
									<icon-check v-else class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">{{ data.value.status === 'Vigente' ? 'Revogado' : 'Vigente' }}
								</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>
		<modal-layout title="Cadastro IP-Instrução Procedimento" :is-open="isOpenDialog" size="max-w-[600px]"
			@btn-close="isOpenDialog = false">
			<cadastrar-ip @btn-cancelar="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
