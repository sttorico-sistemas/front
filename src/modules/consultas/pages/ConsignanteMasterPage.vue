<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { onMounted, reactive, ref } from 'vue';
import breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import titulo from 'src/core/components/Titulo.vue';
import ConsultasExport from '../components/ConsultasExport.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconClear from 'src/core/components/Icons/IconClear.vue';
import IconEdit from 'src/core/components/Icons/IconEdit.vue';
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue';
import FormField from 'src/core/components/FormField.vue';
import { Col } from 'types/col.d';
import { consignanteMasterStore } from '../stores/consignante_master.store';
import AppButton from 'src/core/components/AppButton.vue';
import { ConsignanteMaster } from '../types/consignante_master.d';
import { computed } from '@vue/reactivity';
import AppDialog from 'src/core/components/AppDialog.vue';

const saving = ref(false);
const store = consignanteMasterStore();

const showDialog = ref(false);
const consignanteFilter = ref('');

const cols = reactive<Col[]>([
	{ field: 'nome', title: 'Consignante Master', hide: false },
	{ field: 'actions', title: 'Ações', hide: false, sort: false },
]);

const filtered = computed(() => {
	if (!consignanteFilter.value) {
		return store.consignantesMaster;
	}

	return store.consignantesMaster.filter(
		(consignante) => consignante.nome === consignanteFilter.value,
	);
});

const parseCols = [
	{ field: 'id', title: 'ID', hide: false },
	{ field: 'nome', title: 'Consignante Master', hide: false },
];

const consignanteMasterName = ref('');
const editingConsignanteMaster = ref<ConsignanteMaster | undefined>(undefined);

const openEditor = (consignanteMaster?: ConsignanteMaster) => {
	store.clearError();
	if (consignanteMaster) {
		editingConsignanteMaster.value = consignanteMaster;
		consignanteMasterName.value = consignanteMaster.nome;
		showDialog.value = true;
		return;
	}
	editingConsignanteMaster.value = undefined;
	consignanteMasterName.value = '';
	showDialog.value = true;
};

const saveConsignanteMaster = async () => {
	store.clearError();
	saving.value = true;

	if (editingConsignanteMaster.value) {
		await store.updateConsignanteMaster({
			id: editingConsignanteMaster.value.id,
			name: consignanteMasterName.value,
		});
	} else {
		await store.createConsignanteMaster(consignanteMasterName.value);
	}

	if (!store.error) {
		showDialog.value = false;
	}
	saving.value = false;
};

onMounted(async () => {
	await store.getAllConsignantes();
});
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignante Master']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex items-center gap-14">
					<titulo title="Consignante Master" />
					<button @click="openEditor()" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo Consignatario Master</tippy
					>
				</div>

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
					<multiselect
						:model-value="store.filter"
						:options="store.consignantesFilter"
						class="custom-multiselect min-w-[250px]"
						placeholder="Selecione Consignante Master"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="store.applyFilter($event)"
					/>
					<div>
						<button
							v-tippy:top
							type="button"
							class="text-xs m-1"
							@click="store.clearFilter()"
						>
							<icon-clear class="w-5 h-5 text-primary" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div class="w-5 h-5">
						<consultas-export
							v-tippy:top
							:cols="parseCols"
							:rows="filtered"
							filename="Extrato Anual dos Descontos"
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
			<div class="datatable mb-[344px]">
				<vue3-datatable
					:rows="store.consignantesMaster"
					:columns="cols"
					:total-rows="store.total"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5"
					no-data-content="Nenhum dado foi encontrado"
					pagination-primary="Mostrando {0} a {1} de {2} entradas"
					:loading="store.loadingConsignantesMaster"
					:page="store.page"
					:page-size="store.limit"
					@change="(e: any) => store.goToPage(e.current_page)"
					@page-size-change="(e: number) => store.setLimit(e)"
					:is-server-mode="true"
				>
					<template #actions="data">
						<button
							v-tippy:right
							type="button"
							class="text-xs m-1"
							@click="openEditor(data.value)"
						>
							<icon-edit class="w-5 h-5 text-primary" />
						</button>
						<tippy target="right" placement="right"
							>Editar {{ data.value.nome }}</tippy
						>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<app-dialog v-model="showDialog" width="458px">
			<template #title> Cadastrar Consignante Master </template>
			<form-field
				v-model="consignanteMasterName"
				:message="store.error"
				:error="!!store.error"
				label="Nome"
				@submit="saveConsignanteMaster()"
				:disabled="saving"
			/>
			<template #actions>
				<app-button
					class="mr-2"
					variant="outlined"
					density="comfortable"
					@click="showDialog = false"
					width="24"
					:disabled="saving"
				>
					Cancelar
				</app-button>
				<app-button
					width="24"
					variant="flat"
					density="comfortable"
					:loading="saving"
					@click="saveConsignanteMaster()"
					>Salvar</app-button
				>
			</template>
		</app-dialog>
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
