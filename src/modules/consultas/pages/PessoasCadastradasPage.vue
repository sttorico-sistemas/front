<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import breadcrumbs from '@/core/components/Breadcrumbs.vue'
import titulo from '@/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import modalLayout from '@/core/components/Modal.vue'

import ConsultasCadastroPessoa from '../components/CadastroPessoa/CadastroPessoa.vue'
import ConsultasExport from '../components/ConsultasExport.vue'
import ImageName from '../components/ConsultasHistorico/DatatableColunaImageName.vue'

// Icons
import IconAdd from '@/core/components/icons/iconAdd.vue'
import IconClear from '@/core/components/icons/iconClear.vue'
import IconEye from '@/core/components/icons/iconEye.vue'
import IconPrinter from '@/core/components/icons/iconPrinter.vue'
import IconCheck from '@/core/components/icons/iconCheck.vue'
import IconBlock from '@/core/components/icons/iconBlock.vue'

// Declarações
const isOpenDialog = ref(false)
const selected = reactive<{ type: string; label: string }>({
  type: '',
  label: '',
})
const nome = ref<string>('')
const cpf = ref<string>('')
const tp_vinculo = ref<string>('')
const cidade = ref<string>('')
const status = ref<string>('')
const cols = reactive([
  { field: 'id', title: 'ID', hide: true },
  { field: 'nome', title: 'Nome', hide: false },
  { field: 'cpf', title: 'CPF', hide: false },
  { field: 'tp_vinculo', title: 'Tp Vínculo', hide: false },
  { field: 'cidade', title: 'Cidade', hide: false, sort: false },
  { field: 'celular', title: 'Celular', hide: false, sort: false },
  { field: 'email', title: 'E-mail', hide: false, sort: false },
  { field: 'status', title: 'Status', hide: false, sort: false },
  { field: 'acao', title: 'Ação', hide: false, sort: false },
])
const rows = reactive([
  {
    id: 1,
    nome: 'João Carlos de Oliveira Carvalho',
    cpf: '356.859.789-99',
    tp_vinculo: 'Consignante',
    cidade: 'Florianópolis-SC',
    celular: '(48) 98745632',
    email: 'jcoliveira@gmail.com',
    status: 'Inativo'
  },
  {
    id: 2,
    nome: 'Mario Alves Cabral',
    cpf: '526.987.456-11',
    tp_vinculo: 'Consignatária',
    cidade: 'São Paulo-SP',
    celular: '(11) 95683031',
    email: 'mario@daycoval.com.br',
    status: 'Ativo'
  },
])

// Script
const clearFilter = () => {
  nome.value = ''
  cpf.value = ''
  tp_vinculo.value = ''
  cidade.value = ''
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

  if (selected.type === 'vinculo')
    return rows.filter((item: any) => item.tp_vinculo === value)

  if (selected.type === 'cidade')
    return rows.filter((item: any) => item.cidade === value)

  if (selected.type === 'status')
    return rows.filter((item: any) => item.status === value)
}

const parseRows = (): Array<object> => {
  return rows.map((row) => {
    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      tp_vinculo: row.tp_vinculo,
      cidade: row.cidade,
      celular: row.celular,
      email: row.email,
      status: row.status,
    }
  })
}

const parseCols = (): Array<object> => {
  return [
    { field: 'id', title: 'ID', hide: true },
    { field: 'nome', title: 'Nome', hide: false },
    { field: 'cpf', title: 'CPF', hide: false },
    { field: 'tp_vinculo', title: 'Tp Vínculo', hide: false },
    { field: 'cidade', title: 'Cidade', hide: false, sort: false },
    { field: 'celular', title: 'Celular', hide: false, sort: false },
    { field: 'email', title: 'E-mail', hide: false, sort: false },
    { field: 'status', title: 'Status', hide: false, sort: false },
  ]
}
</script>
<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Pessoas']" />
    <div class="panel pb-0 mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">

        <div class="flex items-center gap-14">
          <titulo title="Pessoas Cadastradas" />
          <button @click="isOpenDialog = true" v-tippy:right>
            <icon-add />
          </button>
          <tippy target="right" placement="right">Cadastre uma nova pessoa</tippy>
        </div>

        <div class="header_actions flex flex-wrap md:flex-nowrap items-center gap-5">
          <multiselect v-model="nome" :options="['João Carlos de Oliveira Carvalho', 'Mario Alves Cabral']"
            class="custom-multiselect min-w-[200px]" placeholder="Nome" :searchable="false" :preselect-first="false"
            :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'nome')" />
          <multiselect v-model="cpf" :options="['356.859.789-99', '526.987.456-11']"
            class="custom-multiselect min-w-[120px]" placeholder="CPF" :searchable="false" :preselect-first="false"
            :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'cpf')" />
          <multiselect v-model="tp_vinculo" :options="['Consignante', 'Consignatária']"
            class="custom-multiselect max-w-[150px]" placeholder="Tipo Vínculo" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'vinculo')" />
          <multiselect v-model="cidade" :options="['Florianópolis-SC', 'São Paulo-SP']"
            class="custom-multiselect max-w-[150px]" placeholder="Cidade" :searchable="false" :preselect-first="false"
            :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'cidade')" />
          <multiselect v-model="status" :options="['Inativo', 'Ativo']" class="custom-multiselect max-w-[120px]"
            placeholder="Status" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
            select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'status')" />

          <div>
            <button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
              <icon-clear class="w-5 h-5 text-primary_3-table" />
            </button>
            <tippy target="top" placement="top">Limpar pesquisa</tippy>
          </div>

          <div>
            <consultas-export v-tippy:top :cols="parseCols()" :rows="parseRows()" filename="Histórico das Solicitações"
              export-type="print">
              <template #icon>
                <icon-printer class="w-5 h-5" />
              </template>
            </consultas-export>
            <tippy target="top" placement="top">Imprimir</tippy>
          </div>
        </div>
      </div>

      <div class="datatable">
        <vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
          :sortable="true" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
          pagination-info="Mostrando {0} a {1} de {2} entradas">
          <template #solicitado="data">
            <image-name image="https://placehold.co/30x30" :name="data.value.solicitado.nome" />
          </template>
          <template #status="data">
            <span class="flex justify-center badge !w-[110px] h-[22px]" :class="color(data.value.status)">{{
              data.value.status }}</span>
          </template>
          <template #acao="data">
            <div class="flex">
              <div>
                <button v-tippy:right type="button" class="text-xs m-1" @click="isOpenDialog = true">
                  <icon-eye class="w-5 h-5 text-primary_3-table" />
                </button>
                <tippy target="right" placement="right">ver {{ data.value.id }}</tippy>
              </div>
              <div>
                <div>
                  <button v-tippy:right type="button" class="text-xs m-1">
                    <icon-check v-if="data.value.status === 'Inativo'" class="w-5 h-5 text-primary_3-table" />
                    <icon-block v-else class="w-5 h-5 text-primary_3-table" />
                  </button>
                  <tippy target="right" placement="right">{{ data.value.status === 'Inativo' ? 'Ativar' : 'Inativar' }}
                  </tippy>
                </div>
              </div>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>

    <modal-layout :is-open="isOpenDialog" size="max-w-full" @btn-close="isOpenDialog = false">
      <consultas-cadastro-pessoa @btn-cancelar="isOpenDialog = false" />
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
