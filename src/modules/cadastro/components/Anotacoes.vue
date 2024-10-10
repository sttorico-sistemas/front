<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'
import CadastrarAnotacao from './Modal/CadastrarAnotacao.vue'
import IconDoc from 'src/core/components/Icons/IconFile.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import { Col } from 'types/col.d'

const isOpenDialog = ref(false);
const cols = reactive<Col[]>([
	{ field: 'id', title: '#', hide: true, sort: false, },
	{ field: 'dcto', title: 'Dcto', hide: false, sort: false, },
	{ field: 'data', title: 'Data', hide: false, sort: false, },
	{ field: 'titulo', title: 'Título', hide: false, sort: false, },
	{ field: 'operador', title: 'Operador', hide: false, sort: false, },
	{ field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: 1,
		dcto: 1,
		data: '03/09/2021',
		titulo: 'Gestão de Atendimento',
		operador: 'Marcio',
	},
	{
		id: 2,
		dcto: 1,
		data: '12/10/2018',
		titulo: 'Comunicação Interna e Externa',
		operador: 'Pamela',
	},
])
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Anotações Importantes" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo Anotações Importantes</tippy>
				</div>

				<div class="header_actions flex items-center gap-5">
					<input id="pesquisa" type="text" placeholder="Pesquisa"
						class="form-input mb-3 md:mb-0 md:min-w-[320px] h-[38px]" />
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas">
					<template #dcto="data">
						<icon-doc />
					</template>

					<template #actions="data">
						<div class="flex gap-2">
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-eye class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">Visualizar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-edit class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">Editar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-delete class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">Deletar</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>
		<modal-layout title="Cadastrar Nova Anotação" :is-open="isOpenDialog" size="max-w-[600px]"
			@btn-close="isOpenDialog = false">
			<cadastrar-anotacao @btn-cancelar="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
