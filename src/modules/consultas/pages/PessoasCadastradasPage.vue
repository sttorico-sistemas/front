<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import titulo from 'src/core/components/Titulo.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import ConsultasCadastroPessoa from '../components/CadastroPessoa/CadastroPessoa.vue';
import ConsultasExport from '../components/ConsultasExport.vue';
import ImageName from '../components/ConsultasHistorico/DatatableColunaImageName.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconClear from 'src/core/components/Icons/IconClear.vue';
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue';
import IconCheck from 'src/core/components/Icons/IconCheck.vue';
import IconBlock from 'src/core/components/Icons/IconBlock.vue';
import { Col } from 'types/col.d';
import { pessoaStore } from '../stores/pessoa.store';
import IconEdit from 'src/core/components/Icons/IconEdit.vue';
import AppDialog from 'src/core/components/AppDialog.vue';
import AppButton from 'src/core/components/AppButton.vue';
import CircularProgress from 'src/core/components/CircularProgress.vue';

const store = pessoaStore();

const selected = reactive({
	type: '',
	label: '',
});
const nome = ref('');
const cpf = ref('');
const tp_vinculo = ref('');
const cidade = ref('');
const status = ref('');

const cols = reactive<Col[]>([
	{ field: 'id', title: 'ID', hide: true },
	{ field: 'nome', title: 'Nome', hide: false },
	{ field: 'cpf', title: 'CPF', hide: false },
	{ field: 'tpVinculo', title: 'Tp Vínculo', hide: false },
	{ field: 'cidade', title: 'Cidade', hide: false, sort: false },
	{ field: 'email', title: 'E-mail', hide: false, sort: false },
	{ field: 'status', title: 'Status', hide: false, sort: false },
	{ field: 'acao', title: 'Ação', hide: false, sort: false },
]);

const clearFilter = () => {
	nome.value = '';
	cpf.value = '';
	tp_vinculo.value = '';
	cidade.value = '';
	status.value = '';

	selected.label = '';
	selected.type = '';
};

const color = (value: string): string => {
	switch (value) {
		case 'Ativo':
			return 'bg-success';
		case 'Liberada':
			return 'bg-success';
		case 'Inativo':
			return 'bg-warning';
		case 'Bloqueada':
			return 'bg-secondary';
		default:
			return 'bg-secondary';
	}
};

const parseRows = () => {
	return store.pessoas.map((pessoa) => {
		return {
			id: pessoa.id,
			nome: pessoa.nome,
			cpf: pessoa.cpf,
			tp_vinculo: pessoa.tpVinculo,
			cidade: pessoa.cidade,
			celular: pessoa.contatos.at(0)?.celular,
			email: pessoa.email,
			status: pessoa.status,
		};
	});
};

const parseCols = () => {
	return [
		{ field: 'id', title: 'ID', hide: true },
		{ field: 'nome', title: 'Nome', hide: false },
		{ field: 'cpf', title: 'CPF', hide: false },
		{ field: 'tp_vinculo', title: 'Tp Vínculo', hide: false },
		{ field: 'cidade', title: 'Cidade', hide: false, sort: false },
		{ field: 'celular', title: 'Celular', hide: false, sort: false },
		{ field: 'email', title: 'E-mail', hide: false, sort: false },
		{ field: 'status', title: 'Status', hide: false, sort: false },
	];
};

onMounted(() => {
	store.getAllPessoas();
});
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Pessoas']" />
		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex items-center gap-14">
					<titulo title="Pessoas Cadastradas" />
					<button @click="store.toggleEditor(true)" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre uma nova pessoa</tippy
					>
				</div>

				<div
					class="header_actions flex flex-wrap md:flex-nowrap items-center gap-5"
				>
					<multiselect
						v-model="nome"
						:options="[
							'João Carlos de Oliveira Carvalho',
							'Mario Alves Cabral',
						]"
						class="custom-multiselect min-w-[200px]"
						placeholder="Nome"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'nome')"
					/>
					<multiselect
						v-model="cpf"
						:options="['356.859.789-99', '526.987.456-11']"
						class="custom-multiselect min-w-[120px]"
						placeholder="CPF"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'cpf')"
					/>
					<multiselect
						v-model="tp_vinculo"
						:options="['Consignante', 'Consignatária']"
						class="custom-multiselect max-w-[150px]"
						placeholder="Tipo Vínculo"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'vinculo')"
					/>
					<multiselect
						v-model="cidade"
						:options="['Florianópolis-SC', 'São Paulo-SP']"
						class="custom-multiselect max-w-[150px]"
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
							:cols="parseCols()"
							:rows="parseRows()"
							filename="Histórico das Solicitações"
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
					:rows="store.pessoas"
					:columns="cols"
					:total-rows="store.total"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
					:loading="store.loadingPessoas"
					:page="store.pagina"
					:page-size="store.limite"
					@change="(e: any) => store.goToPage(e.current_page)"
					@page-size-change="(e: number) => store.setLimit(e)"
					:is-server-mode="true"
				>
					<template #solicitado="data">
						<image-name
							image="https://placehold.co/30x30"
							:name="data.value.solicitado.nome"
						/>
					</template>
					<template #status="data">
						<span
							class="flex justify-center badge !w-[110px] h-[22px]"
							:class="color(data.value.status)"
							>{{ data.value.status }}</span
						>
					</template>
					<template #acao="data">
						<div class="flex">
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
									:disabled="store.saving"
									@click="store.toggleEditor(true, data.value)"
								>
									<icon-edit class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Editar {{ data.value.nome }}</tippy
								>
							</div>
							<div>
								<div>
									<button
										v-tippy:right
										type="button"
										class="text-xs m-1"
										@click="store.toggleStatus(data.value)"
										:disabled="store.saving"
									>
										<icon-check
											v-if="data.value.status === 'Inativo'"
											class="w-5 h-5 text-primary_3-table"
										/>
										<icon-block
											v-else-if="!store.saving"
											class="w-5 h-5 text-primary_3-table"
										/>
										<circular-progress v-else :size="20"></circular-progress>
									</button>
									<tippy target="right" placement="right"
										>{{
											data.value.status === 'Inativo' ? 'Ativar' : 'Inativar'
										}}
									</tippy>
								</div>
							</div>
						</div>
					</template>
				</vue3-datatable>
				<app-dialog
					:model-value="store.showDeleteDialog"
					@update:model-value="store.toggleDeletePessoa()"
				>
					<template #title>
						Deseja deletar {{ store.editingPessoa.nome }}?
					</template>
					Essa ação não poderá ser desfeita.
					<template #actions>
						<app-button
							density="comfortable"
							variant="outlined"
							:disabled="store.deleting"
							@click="store.toggleDeletePessoa()"
						>
							Cancelar
						</app-button>
						<app-button
							density="comfortable"
							class="ml-2"
							:loading="store.deleting"
							@click="store.deletePessoa()"
						>
							Apagar
						</app-button>
					</template>
				</app-dialog>
			</div>
		</div>

		<consultas-cadastro-pessoa />
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
