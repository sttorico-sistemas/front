<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { PropType, ref } from 'vue'

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
import titulo from '@/core/components/Titulo.vue'
import modalLayout from '@/core/components/Modal.vue'

import CadastroModalGestor from './Modal/CadastroGestor.vue'

// Icons
import IconAdd from '@/core/components/icons/iconAdd.vue'
import IconEdit from '@/core/components/icons/iconEdit.vue'
import IconDelete from '@/core/components/icons/iconDelete.vue'
import IconBlock from '@/core/components/icons/iconBlock.vue'
import IconCheck from '@/core/components/icons/iconCheck.vue'

// Declarações
const isOpenDialog = ref<boolean>(false)

// Scripts
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Lista de Gestores" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo gestor</tippy>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="props.rows" :columns="props.cols" :total-rows="props.rows.length" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="props.pagination">
					<template #actions="data">
						<div class="flex gap-2">
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
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-block v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
									<icon-check v-else class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
								</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout :is-open="isOpenDialog" title="Cadastro de Gestores" size="max-w-[526px]"
			@btn-close="isOpenDialog = false">
			<!-- Datatable-->
			<cadastro-modal-gestor type-screen="consignataria" @btn-cancelar="isOpenDialog = false" />
			<!-- Datatable-->
		</modal-layout>
	</main>
</template>
