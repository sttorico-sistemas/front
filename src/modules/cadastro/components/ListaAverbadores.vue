<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'

// Componentes
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'

import CadastroModalAverbador from './Modal/CadastroAverbadores.vue'

// Icons
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'

// Declarações
const isOpenDialog = ref<boolean>(false)
const cols = reactive([
	{ field: 'averbadores', title: 'Averbadores', hide: false, sort: false, },
	{ field: 'gestor', title: 'Gestor', hide: false, sort: false, },
	{ field: 'telefone', title: 'Telefone', hide: false, sort: false, },
	{ field: 'celular', title: 'Celular', hide: false, sort: false, },
	{ field: 'email', title: 'E-mail', hide: false, sort: false, },
	{ field: 'status', title: 'Status', hide: false, sort: false, },
	{ field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: '55622',
		averbadores: 'RH Administração Direta',
		gestor: 'João Carlos de Oliveira Carvalho',
		telefone: '(47) 3322-4455',
		celular: '(47) 9991-4455',
		email: 'financas@prefeitura.sc.gov.br',
		status: 'Ativo',
	},
	{
		id: '55632',
		averbadores: 'RH Secretaria Educação',
		gestor: 'Mário José da Silva Chavier',
		telefone: '(47) 3322-4455',
		celular: '(47) 9991-4455',
		email: 'gabinete@prefeitura.sc.gov.br',
		status: 'Inativo',
	},
])

// Scripts
const color = (value: string) => {
	switch (value) {
		case 'Ativo':
			return 'bg-success'
		case 'Inativo':
			return 'bg-warning'
	}
}
</script>

<template>
	<main>
		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Lista de Averbadores" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo Contrato</tippy>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="false">
					<template #status="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
							data.value.status }}</span>
					</template>
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

		<modal-layout :is-open="isOpenDialog" title="Cadastro Averbadores" size="max-w-[526px]"
			@btn-close="isOpenDialog = false">
			<!-- Datatable-->
			<cadastro-modal-averbador @btn-cancelar="isOpenDialog = false" />
			<!-- Datatable-->
		</modal-layout>
	</main>
</template>
