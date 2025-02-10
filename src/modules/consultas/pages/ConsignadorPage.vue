<script lang="ts" setup>
import { reactive, ref } from 'vue'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import titulo from 'src/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import modalLayout from 'src/core/components/Modal.vue'
import VueCollapsible from 'vue-height-collapsible/vue3'
import ConsultasCadastroConsignador from '../components/CadastroPessoa/CadastroConsignador.vue'
import FiltroCompleto from '../components/CadastroPessoa/FiltrosConsignador/FiltrosCompleto.vue'
import FiltroSimples from '../components/CadastroPessoa/FiltrosConsignador/FiltrosSimples.vue'
import ConsultasExport from '../components/ConsultasExport.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconCaretDown from 'src/core/components/Icons/IconCaretDown.vue'
import IconUser from 'src/core/components/Icons/IconUser.vue'
import IconUnlock from 'src/core/components/Icons/IconUnlock.vue'
import IconLock from 'src/core/components/Icons/IconLock.vue'
import IconFilter from 'src/core/components/Icons/IconFilter.vue'

const accordians = reactive({
  consignadores: false,
  filtros: false,
})
const isOpenDialog = ref(false)
const isOpenDialogCadastrarPessoa = ref(false)
const cols = reactive([
  { field: 'id', title: 'ID', hide: true },
  { field: 'consignador', title: 'Consignador', hide: false },
  { field: 'cpf', title: 'CPF', hide: false },
  { field: 'matricula', title: 'Matrícula', hide: false },
  { field: 'averbador', title: 'Averbador', hide: false },
  { field: 'regime', title: 'Regime', hide: false },
  { field: 'categoria', title: 'Categoria', hide: false },
  { field: 'situacao', title: 'Situação Func', hide: false },
  { field: 'status', title: 'Status Cad', hide: false },
  { field: 'averbacao', title: 'Averbação', hide: false },
  { field: 'acao', title: 'Ação', hide: false, sort: false },
])
const rows = reactive([
  {
    id: 1,
    consignador: 'João da Silva',
    cpf: '356.859.789-99',
    matricula: '123456789101112',
    averbador: 'RH Prefeitura',
    regime: 'Estatutário',
    categoria: 'Inativo',
    situacao: 'Ativa',
    status: 'Inativo',
    averbacao: 'Bloqueada',
  },
])

const clearFilter = () => { }

const color = (value: string): string | undefined => {
  switch (value) {
    case 'Ativo':
      return 'bg-success'
    case 'Liberada':
      return 'bg-success'
    case 'Inativo':
      return 'bg-warning'
    case 'Bloqueada':
      return 'bg-secondary'
  }
}

const parseRows = () => {
  return rows.map((row) => {
    return {
      id: row.id,
      consignador: row.consignador,
      cpf: row.cpf,
      matricula: row.matricula,
      averbador: row.averbador,
      regime: row.regime,
      categoria: row.categoria,
      situacao: row.situacao,
      status: row.status,
      averbacao: row.averbacao,
    }
  })
}

const parseCols = () => {
  return [
    { field: 'id', title: 'ID', hide: true },
    { field: 'consignador', title: 'Consignador', hide: false },
    { field: 'cpf', title: 'CPF', hide: false },
    { field: 'matricula', title: 'Matrícula', hide: false },
    { field: 'averbador', title: 'Averbador', hide: false, sort: false },
    { field: 'regime', title: 'Regime', hide: false, sort: false },
    { field: 'categoria', title: 'Categoria', hide: false, sort: false },
    { field: 'situacao', title: 'Situação Func', hide: false, sort: false },
    { field: 'status', title: 'Status Cad', hide: false, sort: false },
    { field: 'averbacao', title: 'Averbação', hide: false, sort: false },
  ]
}
</script>
<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Consignador']" />

    <filtro-simples />

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.filtros === true ? (accordians.filtros = false) : (accordians.filtros = true)">
        <div class="flex items-center gap-2 text-primary"><icon-filter /> Filtros</div>
        <div :class="{ 'rotate-180': accordians.filtros === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.filtros === true">
        <filtro-completo />
      </vue-collapsible>
    </div>

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.consignadores === true ? (accordians.consignadores = false) : (accordians.consignadores = true)">
        Lista Consignadores
        <div :class="{ 'rotate-180': accordians.consignadores === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.consignadores === true">
        <div class="panel pb-0 mt-6">
          <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">

            <div class="flex items-center gap-14">
              <titulo title="Consignadores" />
            </div>

            <div class="header_actions flex flex-wrap md:flex-nowrap items-center gap-5">
              <div>
                <button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
                  <icon-clear class="w-5 h-5 text-primary" />
                </button>
                <tippy target="top" placement="top">Limpar pesquisa</tippy>
              </div>

              <div>
                <consultas-export v-tippy:top :cols="parseCols()" :rows="parseRows()"
                  filename="Histórico das Solicitações" export-type="print">
                  <template #icon>
                    <icon-printer class="w-5 h-5" />
                  </template>
                </consultas-export>
                <tippy target="top" placement="top">Imprimir</tippy>
              </div>
            </div>
          </div>

          <div class="datatable">
            <vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
              skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
              pagination-primary="Mostrando {0} a {1} de {2} entradas">
              <template #status="data">
                <span class="flex justify-center badge !w-[110px] h-[22px]" :class="color(data.value.status)">{{
                  data.value.status }}</span>
              </template>
              <template #averbacao="data">
                <span class="flex justify-center badge !w-[110px] h-[22px]" :class="color(data.value.averbacao)">{{
                  data.value.averbacao }}</span>
              </template>
              <template #acao="data">
                <div class="flex">
                  <div>
                    <button v-tippy:right type="button" class="text-xs m-1" @click="isOpenDialog = true">
                      <icon-eye class="w-5 h-5 text-primary" />
                    </button>
                    <tippy target="right" placement="right">Cadastro Matrícula {{ data.value.id }}</tippy>
                  </div>
                  <div>
                    <button v-tippy:right type="button" class="text-xs m-1" @click="isOpenDialogCadastrarPessoa = true">
                      <icon-user class="w-5 h-5 text-primary" />
                    </button>
                    <tippy target="right" placement="right">Cadastro Pessoa {{ data.value.id }}</tippy>
                  </div>
                  <div>
                    <div>
                      <button v-tippy:right type="button" class="text-xs m-1">
                        <icon-check v-if="data.value.status === 'Inativo'" class="w-5 h-5 text-primary" />
                        <icon-block v-else class="w-5 h-5 text-primary" />
                      </button>
                      <tippy target="right" placement="right">{{ data.value.status === 'Inativo' ? 'Ativar' : 'Inativar'
                        }}</tippy>
                    </div>
                  </div>
                  <div>
                    <div>
                      <button v-tippy:right type="button" class="text-xs m-1">
                        <icon-unlock v-if="data.value.status === 'Inativo'" class="w-5 h-5 text-primary" />
                        <icon-lock v-else class="w-5 h-5 text-primary" />
                      </button>
                      <tippy target="right" placement="right">{{ data.value.status === 'Inativo' ? 'Ativar' : 'Bloquear'
                        }}</tippy>
                    </div>
                  </div>
                </div>
              </template>
            </vue3-datatable>
          </div>
        </div>
      </vue-collapsible>
    </div>

    <modal-layout size="max-w-full" @btn-close="isOpenDialog = false">
      <consultas-cadastro-consignador @btn-cancelar="isOpenDialog = false" />
    </modal-layout>
    <modal-layout :is-open="isOpenDialogCadastrarPessoa" size="max-w-full"
      @btn-close="isOpenDialogCadastrarPessoa = false">
      <consultas-cadastro-consignador @btn-cancelar="isOpenDialogCadastrarPessoa = false" :matricula="false" />
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
