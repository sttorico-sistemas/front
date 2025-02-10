<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { PropType, ref } from 'vue'
import { Col } from 'types/col.d'
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'
import CadastroModalGestor from './Modal/CadastroGestor.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'

const props = withDefaults(defineProps<{
	cols: Col[];
	rows: Record<string, any>;
	pagination?: boolean;
}>(), {
	pagination: false,
});

const isOpenDialog = ref(false)
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
					pagination-primary="Mostrando {0} a {1} de {2} entradas" :pagination="props.pagination">
					<template #actions="data">
						<div class="flex gap-2">
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-edit class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Editar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-delete class="w-5 h-5 text-primary" />
								</button>
								<tippy target="right" placement="right">Deletar</tippy>
							</div>
							<div>
								<button v-tippy:right type="button" class="text-xs m-1">
									<icon-block v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary" />
									<icon-check v-else class="w-5 h-5 text-primary" />
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
