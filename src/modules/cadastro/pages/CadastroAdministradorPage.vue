<script lang="ts" setup>
import { ref, reactive } from 'vue'
import router from 'src/core/router'
import VueCollapsible from 'vue-height-collapsible/vue3'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import titulo from 'src/core/components/Titulo.vue'
import PontoVenda from '../components/PontoVenda.vue'
import DadosAdministrador from '../components/DadosAdministrador.vue'
import instrucoesProcedimentos from '../components/InstrucoesProcedimentos.vue'
import LogsAlteracao from '../components/LogsAlteracao.vue'
import IconCaretDown from 'src/core/components/Icons/IconCaretDown.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'

const selected = reactive({
  type: '',
  label: '',
})
const accordians = reactive({
  backoffice: false,
  contratoSistema: false,
  gestores: false,
  pontoVenda: false,
  operadores: false,
  consignantesHabilitados: false,
  ip: false,
  logs: false,
})
const contrato = ref('')
const consignante = ref('')
const data_inicial = ref('')
const data_final = ref('')
const status = ref('')

const colsOperadores = reactive([
  { field: 'operador', title: 'Operador', hide: false, sort: false },
  { field: 'tp_operador', title: 'Tp Operador', hide: false, sort: false },
  { field: 'perfil', title: 'Perfil', hide: false, sort: false },
  { field: 'departamento', title: 'Departamento', hide: false, sort: false },
  { field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false },
  { field: 'data_final', title: 'Data Final', hide: false, sort: false },
  { field: 'status', title: 'Status', hide: false },
  { field: 'actions', title: 'Ações', hide: false, width: '116px', sort: false },
])
const rowsOperadores = reactive([
  {
    id: 1,
    operador: 'João da Silva',
    tp_operador: 'Suporte',
    perfil: 'Atendimento',
    departamento: 'Suporte ao Cliente',
    data_inicial: '',
    data_final: '',
    status: 'Inativo',
  },
  {
    id: 2,
    operador: 'Mario Alves Cabral',
    tp_operador: 'Operacional',
    perfil: 'Fechamento',
    departamento: 'Operacional',
    data_inicial: '',
    data_final: '',
    status: 'Ativo',
  },
])
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Cadastro', 'Administrador']" />

    <dados-administrador />

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.operadores === true ? (accordians.operadores = false) : (accordians.operadores = true)">
        Operadores
        <div :class="{ 'rotate-180': accordians.operadores === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.operadores === true">
        <ponto-venda :cols="colsOperadores" :rows="rowsOperadores" title="Operadores Cadastrados" administrador />
      </vue-collapsible>
    </div>

    <div class="panel mt-6 bg-[#f6f8fa]">
      <div class="flex items-center justify-between">
        <titulo title="Perfil de Acesso para Operadores" :class-style="'text-[#1E1E1E] text-lg'" />
        <a :href="router.resolve({ name: 'cadastro-perfil-operador', params: { id: '1' } }).href" target="_blank">
          <icon-eye />
        </a>
      </div>
    </div>

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.ip === true ? (accordians.ip = false) : (accordians.ip = true)">
        IP-Instrução de Procedimentos
        <div :class="{ 'rotate-180': accordians.ip === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.ip === true">
        <instrucoes-procedimentos />
      </vue-collapsible>
    </div>

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.logs === true ? (accordians.logs = false) : (accordians.logs = true)">
        Logs de Alterações
        <div :class="{ 'rotate-180': accordians.logs === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.logs === true">
        <logs-alteracao />
      </vue-collapsible>
    </div>
  </main>
</template>
