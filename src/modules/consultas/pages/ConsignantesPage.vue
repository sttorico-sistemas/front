<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import router from 'src/core/router';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import titulo from 'src/core/components/Titulo.vue';
import ConsultasExport from '../components/ConsultasExport.vue';
import CadastroModalConsignante from 'src/modules/cadastro/components/Modal/CadastroConsignante.vue';
import IconClear from 'src/core/components/Icons/IconClear.vue';
import IconEye from 'src/core/components/Icons/IconEye.vue';
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconCheck from 'src/core/components/Icons/IconCheck.vue';
import IconUnlock from 'src/core/components/Icons/IconUnlock.vue';
import IconBlock from 'src/core/components/Icons/IconBlock.vue';
import IconLock from 'src/core/components/Icons/IconLock.vue';
import AppDialog from 'src/core/components/AppDialog.vue';
import { consignanteStore } from 'src/modules/cadastro/stores/consignante.store';
import AppButton from 'src/core/components/AppButton.vue';
import CircularProgress from 'src/core/components/CircularProgress.vue';

const store = consignanteStore();

const selected = reactive<{ type: string; label: string }>({
	type: '',
	label: '',
});
const consignante = ref('');
const cidade = ref('');
const tp_entidade = ref('');
const data_final = ref('');
const status = ref('');
const averbacao = ref('');

const clearFilter = () => {
	consignante.value = '';
	cidade.value = '';
	tp_entidade.value = '';
	data_final.value = '';
	status.value = '';
	averbacao.value = '';

	selected.label = '';
	selected.type = '';
};

const cols = reactive([
	{ field: 'nome', title: 'Consignante', hide: false },
	{ field: 'tipoEntidadeId', title: 'Tp Entidade', hide: false },
	{ field: 'cidade', title: 'Cidade/UF', hide: false },
	{ field: 'dtInicial', title: 'Dt Inicial', hide: false },
	{ field: 'dtFinal', title: 'Dt Final', hide: false },
	{ field: 'status', title: 'Status', hide: false },
	{ field: 'averbacao', title: 'Averbação', hide: false },
	{ field: 'actions', title: 'Ações', hide: false, sort: false },
]);

const color = (id: number | string): string => {
	switch (id) {
		case 'Ativo':
			return 'bg-success';
		case 'Inativo':
			return 'bg-warning';
		case 'Bloqueada':
			return 'bg-secondary';
		case 'Liberada':
			return 'bg-success';
		default:
			return 'bg-success';
	}
};

onMounted(() => {
	store.getAllConsignantes();
});
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignantes']" />
		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex items-center gap-14">
					<titulo title="Consignantes" />
					<button @click="store.toggleEditor()" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo Consignante</tippy
					>
				</div>

				<div class="header_actions flex items-center gap-5">
					<!-- <multiselect
            v-model="consignante"
            :options="store.consignantesFilter"
            class="custom-multiselect max-w-[200px]"
            placeholder="Consignante"
            :searchable="false"
            :preselect-first="false"
            :allow-empty="false"
            selected-label=""
            select-label=""
            deselect-label=""
            @select="(selected.label = $event), (selected.type = 'consignante')"
          /> -->
					<multiselect
						v-if="item?.enderecos?.length"
						v-model="cidade"
						:options="
							store.consignantes.map(
								(item) => item.enderecos.at(0)?.cidade.nomes,
							)
						"
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
						v-model="tp_entidade"
						:options="store.tipoEntidades.map((item) => item.nome)"
						class="custom-multiselect min-w-[200px]"
						placeholder="Tipo Entidade"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'tp_entidade')"
					/>
					<!-- <multiselect
						v-model="data_final"
						:options="store.consignantes.map((item) => item.dtFinal)"
						class="custom-multiselect max-w-[120px]"
						placeholder="Data Final"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'data_final')"
					/> -->
					<multiselect
						v-model="status"
						:options="['Inativo', 'Ativo']"
						class="custom-multiselect max-w-[120px]"
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
						class="custom-multiselect max-w-[120px]"
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
							:rows="store.consignantes"
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
					:rows="store.consignantes"
					:columns="cols"
					:total-rows="store.consignantes.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
					:loading="store.loadingConsignantes"
					:page="store.pagina"
					:page-size="store.limite"
					@change="(e: any) => store.goToPage(e.current_page)"
					@page-size-change="(e: number) => store.setLimit(e)"
					:is-server-mode="true"
				>
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
									@click="
										router.push({
											name: 'cadastro-consignante',
											params: { id: data.value.id },
										})
									"
								>
									<icon-eye class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">Ver Consignante</tippy>
							</div>
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
									@click="store.toggleStatus(data.value)"
									:disabled="store.saving"
								>
									<icon-check
										v-if="data.value.status === 'Ativo'"
										class="w-5 h-5 text-primary_3-table"
									/>
									<icon-block
										v-else-if="!store.saving"
										class="w-5 h-5 text-primary_3-table"
									/>
									<circular-progress v-else :size="20"></circular-progress>
								</button>
								<tippy target="right" placement="right">
									{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
								</tippy>
							</div>
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
									@click="store.toggleStatus(data.value)"
									:disabled="store.saving"
								>
									<icon-unlock
										v-if="data.value.averbacao === 'Liberada'"
										class="w-5 h-5 text-primary_3-table"
									/>
									<icon-lock v-else class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right">
									{{
										data.value.averbacao === 'Liberada' ? 'Bloquear' : 'Liberar'
									}}
								</tippy>
							</div>
						</div>
					</template>
				</vue3-datatable>
				<app-dialog
					:model-value="store.showDeleteDialog"
					@update:model-value="store.toggleDeleteConsignante()"
				>
					<template #title>
						Deseja deletar {{ store.editingConsignante.nome }}?
					</template>
					Essa ação não poderá ser desfeita.
					<template #actions>
						<app-button
							density="comfortable"
							variant="outlined"
							:disabled="store.deleting"
							@click="store.toggleDeleteConsignante()"
						>
							Cancelar
						</app-button>
						<app-button
							density="comfortable"
							class="ml-2"
							:loading="store.deleting"
							@click="store.deleteConsignante()"
						>
							Apagar
						</app-button>
					</template>
				</app-dialog>
			</div>
		</div>
		<app-dialog
			:model-value="store.showEditor"
			max-width="834px"
			@update:model-value="store.toggleEditor()"
		>
			<cadastro-modal-consignante />
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
