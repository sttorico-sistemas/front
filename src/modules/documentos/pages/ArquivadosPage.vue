<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import titulo from 'src/core/components/Titulo.vue'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import IconFile from 'src/core/components/Icons/IconFile.vue'

const selected = reactive<{ type: string; label: string }>({
	type: '',
	label: '',
})
const tipo_arquivo = ref<string>('')
const cols = reactive([
	{ field: 'data', title: 'Data', hide: false, },
	{ field: 'tipo_arquivo', title: 'Tipo de Arquivo', hide: false, },
	{ field: 'nome_arquivo', title: 'Nome do Arquivo', hide: false, },
	{ field: 'autor', title: 'Autor', hide: false, },
	{ field: 'documento', title: 'Documento', hide: false, sort: false },
])
const rows = reactive([
	{
		id: '1',
		data: '16/02/2024',
		tipo_arquivo: 'ADF',
		nome_arquivo: 'ADF -  nº 15464658787',
		autor: 'Banco do Brasil S/A',
	},
	{
		id: '2',
		data: '08/03/2024',
		tipo_arquivo: 'PDF',
		nome_arquivo: 'PDF -  nº 15464658788',
		autor: 'Banco do Santander S/A',
	},
])

const filtered = (value: string = '') => {
	if (value === '') return rows
	if (selected.type === 'tipo_arquivo')
		return rows.filter((item: any) => item.tipo_arquivo === value)
}
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Documentos', 'Arquivados']" />
		<div class="panel pb-0 mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<titulo title="Consulta Documentos Arquivados" />

				<div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
					<multiselect v-model="tipo_arquivo" :options="['ADF', 'PDF']" class="custom-multiselect max-w-[200px]"
						placeholder="Selecione o Tipo Arquivo" :searchable="false" :preselect-first="false" :allow-empty="false"
						selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'tipo_arquivo')" />
				</div>
			</div>

			<div class="datatable pb-1">
				<vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
					:sortable="true" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas">
					<template #documento="data">
						<button v-tippy:right type="button" class="text-xs m-1">
							<icon-file class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="right" placement="right">Algum texto aqui {{ data.value.id }}</tippy>
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

	.multiselect__option {
		font-size: 0.75rem;
		line-height: 1rem;
		white-space: normal;
	}
}
</style>
