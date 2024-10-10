<script lang="ts" setup>
import { reactive, ref } from 'vue'
import router from 'src/core/router'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import titulo from 'src/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import modalLayout from 'src/core/components/Modal.vue'
import ImageName from '../components/ConsultasHistorico/DatatableColunaImageName.vue'
import ConsultasExport from '../components/ConsultasExport.vue'
import ConsultaCadastroConsignante from '../components/ConsultaCadastroConsignatarias.vue'
import IconCartaoCreditoServico from 'src/core/components/Icons/Services/IconCartaoCreditoServico.vue'
import IconEmprestimoServico from 'src/core/components/Icons/Services/IconEmprestimosServicos.vue'
import IconMensalidadeServico from 'src/core/components/Icons/Services/IconMensalidadeServicos.vue'
import IconPlanoSaudeServico from 'src/core/components/Icons/Services/IconPlanoSaudeServico.vue'
import IconSegurosServico from 'src/core/components/Icons/Services/IconSegurosServico.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconUnlock from 'src/core/components/Icons/IconUnlock.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconLock from 'src/core/components/Icons/IconLock.vue'

const isOpenDialog = ref(false)
const selected = reactive<{ type: string; label: string }>({
  type: '',
  label: '',
})
const consignataria = ref('')
const instituicao = ref('')
const servico = ref('')
const status = ref('')
const averbacao = ref('')
const cols = reactive([
  { field: 'consignataria', title: 'Consignatária', hide: false, },
  { field: 'tipo_instituicao', title: 'Tp Instituição', hide: false, },
  { field: 'cnpj', title: 'CNPJ', hide: false, },
  { field: 'tipo_servicos', title: 'Tp Serviços', hide: false, },
  { field: 'status', title: 'Status', hide: false, },
  { field: 'averbacao', title: 'Averbação', hide: false, },
  { field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
  {
    id: 1,
    consignataria: 'Banco do Brasil S/A',
    tipo_instituicao: 'Instituição Financeira',
    cnpj: '11.845.879/0001-01',
    tipo_servicos: [
      {
        nome: 'Emprestimo',
        icone: 'emprestimo',
      },
    ],
    status: 'Inativo',
    averbacao: 'Bloqueada',
  },
  {
    id: 2,
    consignataria: 'ASM',
    tipo_instituicao: 'Associação de Classe',
    cnpj: '14.333.879/0001-18',
    tipo_servicos: [
      {
        nome: 'Emprestimo',
        icone: 'emprestimo',
      },
      {
        nome: 'Mensalidade',
        icone: 'mensalidades',
      },
      {
        nome: 'Plano de Saúde',
        icone: 'plano-saude',
      },
      {
        nome: 'Seguros',
        icone: 'seguros',
      },
    ],
    status: 'Ativo',
    averbacao: 'Liberada',
  },
])

const clearFilter = () => {
  consignataria.value = ''
  instituicao.value = ''
  servico.value = ''
  status.value = ''
  averbacao.value = ''

  selected.label = ''
  selected.type = ''
}

const color = (value: string): string => {
  switch (value) {
    case 'Ativo':
      return 'bg-success'
    case 'Liberada':
      return 'bg-success'
    case 'Inativo':
      return 'bg-warning'
    case 'Bloqueada':
      return 'bg-secondary'
    default:
      return 'bg-secondary'
  }
}

const filtered = (value: string = '') => {
  if (value === '') return rows

  if (selected.type === 'consignataria')
    return rows.filter((item: any) => item.consignataria === value)

  if (selected.type === 'tipo_instituicao')
    return rows.filter((item: any) => item.tipo_instituicao === value)

  if (selected.type === 'servico') {
    return rows.filter((item: any) => {
      return item.tipo_servicos.some((servico: any) => servico.nome === value)
    })
  }

  if (selected.type === 'status')
    return rows.filter((item: any) => item.status === value)

  if (selected.type === 'averbacao')
    return rows.filter((item: any) => item.averbacao === value)
}

const iconeService = (value: string) => {
  switch (value) {
    case 'emprestimo':
      return IconEmprestimoServico
    case 'compras':
      return ''
    case 'mensalidades':
      return IconMensalidadeServico
    case 'cartao-credito':
      return IconCartaoCreditoServico
    case 'cartao-beneficios':
      return ''
    case 'plano-saude':
      return IconPlanoSaudeServico
    case 'financiamentos':
      return ''
    case 'seguros':
      return IconSegurosServico
    default:
      return 'https://placehold.co/30x30?text=TS'
  }
}

const parseCols = () => {
  return [
    { field: 'consignataria', title: 'Consignatária', hide: false, },
    { field: 'tipo_instituicao', title: 'Tp Instituição', hide: false, },
    { field: 'cnpj', title: 'CNPJ', hide: false, },
    { field: 'tipo_servicos', title: 'Tp Serviços', hide: false, },
    { field: 'status', title: 'Status', hide: false, },
    { field: 'averbacao', title: 'Averbação', hide: false, },
  ]
}

const parseRows = () => {
  return rows.map((row) => {
    const services = row.tipo_servicos.map((servico) => servico.nome)

    return {
      consignataria: row.consignataria,
      tipo_instituicao: row.tipo_instituicao,
      cnpj: row.cnpj,
      tipo_servicos: `${services}`,
      status: row.status,
      averbacao: row.averbacao,
    }
  })
}
</script>
<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Consignatárias Admin']" />
    <div class="panel pb-0 mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <div class="flex items-center gap-14">
          <titulo title="Consignatárias Habilitadas" />
          <button @click="isOpenDialog = true" v-tippy:right>
            <icon-add />
          </button>
          <tippy target="right" placement="right">Cadastre uma nova Consignatária</tippy>
        </div>

        <div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
          <multiselect v-model="consignataria" :options="['Banco do Brasil S/A', 'ASM']"
            class="custom-multiselect max-w-[230px]" placeholder="Consignatária" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'consignataria')" />
          <multiselect v-model="instituicao" :options="['Instituição Financeira', 'Associação de Classe']"
            class="custom-multiselect max-w-[230px]" placeholder="Tipo Instituição" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'tipo_instituicao')" />
          <multiselect v-model="servico" :options="['Emprestimo', 'Cartão de Crédito', 'Seguros']"
            class="custom-multiselect max-w-[230px]" placeholder="Tipo Serviços" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'servico')" />
          <multiselect v-model="status" :options="['Inativo', 'Ativo']" class="custom-multiselect max-w-[230px]"
            placeholder="Status" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
            select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'status')" />
          <multiselect v-model="averbacao" :options="['Bloqueada', 'Liberada']" class="custom-multiselect max-w-[200px]"
            placeholder="Averbação" :searchable="false" :preselect-first="false" :allow-empty="false" selected-label=""
            select-label="" deselect-label="" @select="(selected.label = $event), (selected.type = 'averbacao')" />

          <div>
            <button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
              <icon-clear class="w-5 h-5 text-primary_3-table" />
            </button>
            <tippy target="top" placement="top">Limpar pesquisa</tippy>
          </div>

          <div>
            <consultas-export v-tippy:top :cols="parseCols()" :rows="parseRows()" filename="Consignatárias Habilitadas"
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
          <template #tipo_servicos="data">
            <div class="flex gap-1">
              <template v-for="(tipo_servico, idx) in data.value.tipo_servicos" :key="idx">
                <image-name v-tippy:top>
                  <component :is="iconeService(tipo_servico.icone)" />
                </image-name>
                <tippy target="top" placement="top">{{
                  tipo_servico.nome
                }}</tippy>
              </template>
            </div>
          </template>
          <template #status="data">
            <span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
              data.value.status }}</span>
          </template>
          <template #averbacao="data">
            <span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.averbacao)">{{
              data.value.averbacao }}</span>
          </template>
          <template #actions="data">
            <div class="flex">
              <div>
                <button v-tippy:right type="button" class="text-xs m-1"
                  @click="router.push({ name: 'cadastro-consignataria', params: { id: '1' } })">
                  <icon-eye class="w-5 h-5 text-primary_3-table" />
                </button>
                <tippy target="right" placement="right">Ver Consignatária</tippy>
              </div>
              <div>
                <button v-tippy:right type="button" class="text-xs m-1">
                  <icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
                  <icon-block v-else class="w-5 h-5 text-primary_3-table" />
                </button>
                <tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
                </tippy>
              </div>
              <div>
                <button v-tippy:right type="button" class="text-xs m-1">
                  <icon-unlock v-if="data.value.averbacao === 'Liberada'" class="w-5 h-5 text-primary_3-table" />
                  <icon-lock v-else class="w-5 h-5 text-primary_3-table" />
                </button>
                <tippy target="right" placement="right">{{ data.value.averbacao === 'Liberada' ? 'Liberar' : 'Bloquear'
                  }}</tippy>
              </div>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>

    <modal-layout title="Cadastro Consignatária" :is-open="isOpenDialog" size="max-w-[834px]"
      @btn-close="isOpenDialog = false">
      <consulta-cadastro-consignante @btn-cancelar="isOpenDialog = false" />
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
