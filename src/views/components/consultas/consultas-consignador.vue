<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import titulo from '@components/layout/tituloLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'
  import modalLayout from '@components/layout/modalLayout.vue'

  import ConsultasCadastroConsignador from './consultas-cadastro-pessoa/consultas-cadastro-consignador.vue'
	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ImageName from './consultas-historico/datatable-coluna-image-name.vue'

	// Icons
  import IconAdd from '@icons/iconAdd.vue'
	import IconClear from '@icons/iconClear.vue'
	import IconEye from '@icons/iconEye.vue'
	import IconPrinter from '@icons/iconPrinter.vue'
  import IconCheck from '@icons/iconCheck.vue'
  import IconBlock from '@icons/iconBlock.vue'

	// Declarações
  const isOpenDialog = ref(false)
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const nome = ref<string>('')
	const cpf = ref<string>('')
	const consignante = ref<string>('')
	const averbador = ref<string>('')
	const status = ref<string>('')
	const cols = reactive([
		{ field: 'id', title: 'ID', hide: true },
		{ field: 'nome', title: 'Nome', hide: false },
		{ field: 'cpf', title: 'CPF', hide: false },
		{ field: 'matricula', title: 'Matrícula', hide: false },
		{ field: 'consignante', title: 'Consignante', hide: false, sort: false },
		{ field: 'averbador', title: 'Averbador', hide: false, sort: false },
		{ field: 'categoria', title: 'Categoria', hide: false, sort: false },
		{ field: 'status', title: 'Status', hide: false, sort: false },
		{ field: 'acao', title: 'Ação', hide: false, sort: false },
	])
	const rows = reactive([
		{
      id: 1,
      nome: 'João Carlos de Oliveira Carvalho',
      cpf: '356.859.789-99',
      matricula: '123456789101112',
      consignante: 'Pref. Florianópolis-SC',
      averbador: 'RH Admin. Direta',
      categoria: 'Estatutário',
      status: 'Inativo'
    },
    {
      id: 2,
      nome: 'Mario Alves Cabral',
      cpf: '526.987.456-11',
      matricula: '121110987654321',
      consignante: 'Pref. Alm. Tamandaré-PR',
      averbador: 'RH Fund. Esporte',
      categoria: 'Comissionado',
      status: 'Ativo'
    },
	])

	// Script
	const clearFilter = () => {
		nome.value = ''
		cpf.value = ''
		consignante.value = ''
		averbador.value = ''
		status.value = ''

		selected.label = ''
		selected.type = ''
	}

	const color = (value: string): string => {
		switch (value) {
			case 'Ativo':
				return 'bg-success' // Ativo
      case 'Liberada':
        return 'bg-success'
			case 'Inativo':
				return 'bg-warning' // Inativo
			case 'Bloqueada':
				return 'bg-secondary'
		}
	}

	const filtered = (value: string = '') => {
		if (value === '') return rows

    if (selected.type === 'nome')
			return rows.filter((item: any) => item.nome === value)

    if (selected.type === 'cpf')
			return rows.filter((item: any) => item.cpf === value)

    if (selected.type === 'consignante')
			return rows.filter((item: any) => item.consignante === value)

    if (selected.type === 'averbador')
			return rows.filter((item: any) => item.averbador === value)

		if (selected.type === 'status')
			return rows.filter((item: any) => item.status === value)
	}

	const parseRows = (): Array<object> => {
		return rows.map((row) => {
			return {
        id: row.id,
        nome: row.nome,
        cpf: row.cpf,
        matricula: row.matricula,
        consignante: row.consignante,
        averbador: row.averbador,
        categoria: row.categoria,
        status: row.status,
			}
		})
	}

	const parseCols = (): Array<object> => {
		return [
      { field: 'id', title: 'ID', hide: true },
      { field: 'nome', title: 'Nome', hide: false },
      { field: 'cpf', title: 'CPF', hide: false },
			{ field: 'matricula', title: 'Matrícula', hide: false },
			{ field: 'consignante', title: 'Consignante', hide: false, sort: false },
			{ field: 'averbador', title: 'Averbador', hide: false, sort: false },
			{ field: 'categoria', title: 'Categoria', hide: false, sort: false },
      { field: 'status', title: 'Status', hide: false, sort: false },
		]
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Consignador']" />
		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>

        <div class="flex items-center gap-14">
					<titulo title="Consignadores Cadastrados" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo Consignador</tippy
					>
				</div>

				<div
					class="header_actions flex flex-wrap md:flex-nowrap items-center gap-5"
				>
        	<multiselect
						v-model="nome"
						:options="['João Carlos de Oliveira Carvalho', 'Mario Alves Cabral']"
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
						v-model="consignante"
						:options="['Pref. Florianópolis-SC', 'Pref. Florianópolis-SC']"
						class="custom-multiselect max-w-[200px]"
						placeholder="Consignante"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'consignante')"
					/>
          <multiselect
						v-model="averbador"
						:options="['RH Admin. Direta', 'RH Fund. Esporte']"
						class="custom-multiselect max-w-[150px]"
						placeholder="Averbador"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'averbador')"
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
					:rows="filtered(selected.label)"
					:columns="cols"
					:total-rows="filtered(selected.label)?.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
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
                  v-tippy:right type="button"
                  class="text-xs m-1"
                  @click="isOpenDialog = true"
                >
                  <icon-eye class="w-5 h-5 text-primary_3-table" />
                </button>
                <tippy target="right" placement="right"
                  >ver {{ data.value.id }}</tippy
                >
              </div>
              <div>
                <div>
                  <button
                    v-tippy:right
                    type="button"
                    class="text-xs m-1"
                  >
                    <icon-check v-if="data.value.status === 'Inativo'" class="w-5 h-5 text-primary_3-table" />
                    <icon-block v-else class="w-5 h-5 text-primary_3-table" />
                  </button>
                  <tippy target="right" placement="right"
                    >{{ data.value.status === 'Inativo' ? 'Ativar' : 'Inativar' }}</tippy
                  >
                </div>
              </div>
            </div>
					</template>
				</vue3-datatable>
			</div>
		</div>

    <modal-layout
			:is-open="isOpenDialog"
			size="max-w-full"
			@btn-close="isOpenDialog = false"
		>
			<consultas-cadastro-consignador @btn-cancelar="isOpenDialog = false" />
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
