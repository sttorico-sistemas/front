<script lang="ts" setup>
import { reactive } from 'vue'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import VueCollapsible from 'vue-height-collapsible/vue3'
import ConsignatariaHabilitadas from '../components/ConsignatariaHabilitadas.vue'
import ContratoSistema from '../components/ContratoSistema.vue'
import DadosConsignante from '../components/DadosConsignante.vue'
import ListaAverbadores from '../components/ListaAverbadores.vue'
import ListaGestores from '../components/ListaGestores.vue'
import LogsAlteracao from '../components/LogsAlteracao.vue'
import ConsultaConsignante from '../components/ConsultaConsignante.vue'
import NormativosCadastrado from '../components/NormativosCadastrado.vue'
import ConsignacoesAutorizadas from '../components/ConsignacoesAutorizadas.vue'
import MargemConsignavel from '../components/MargemConsignavel.vue'
import Regulamento from '../components/Regulamento.vue'
import PontoVenda from '../components/PontoVenda.vue'
import instrucoesProcedimentos from '../components/InstrucoesProcedimentos.vue'
import restricoes from '../components/Restricoes.vue'
import anotacoes from '../components/Anotacoes.vue'
import IconCaretDown from 'src/core/components/Icons/IconCaretDown.vue'

const accordians = reactive({
  dadosConsignante: false,
  contratoSistema: false,
  gestores: false,
  averbadores: false,
  consignatariaHabilitadas: false,
  normativosCadastrado: false,
  consignacoesAutorizadas: false,
  operadores: false,
  margemConsignavel: false,
  regulamento: false,
  restricoes: false,
  ip: false,
  anotacoes: false,
  logs: false,
})
const colsContratoSistema = reactive([
  { field: 'cod', title: 'Cód. Contrato', hide: false, sort: false, },
  { field: 'tipo_contrato', title: 'Tipo Contrato', hide: false, sort: false, },
  { field: 'vigencia', title: 'Vigência', hide: false, sort: false, },
  { field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false, },
  { field: 'data_final', title: 'Data Final', hide: false, sort: false, },
  { field: 'status', title: 'Status', hide: false, sort: false, },
  { field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rowsContratoSistema = reactive([
  {
    cod: '55622',
    tipo_contrato: 'Contrato Comodato',
    vigencia: '48',
    data_inicial: '23/03/2018',
    data_final: '23/03/2023',
    status: 'Ativo',
  },
  {
    cod: '55632',
    tipo_contrato: 'Acordo de Cooperação Técnica',
    vigencia: '60',
    data_inicial: '23/03/2018',
    data_final: '23/03/2023',
    status: 'Inativo',
  },
])
const colsGestores = reactive([
  { field: 'id', title: '#', hide: true, sort: false, },
  { field: 'gestor', title: 'Gestores', hide: false, sort: false, },
  { field: 'cargo', title: 'Cargo', hide: false, sort: false, },
  { field: 'telefone', title: 'Telefone', hide: false, sort: false, },
  { field: 'celular', title: 'Celular', hide: false, sort: false, },
  { field: 'email', title: 'E-mail', hide: false, sort: false, },
  { field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rowsGestores = reactive([
  {
    id: 1,
    gestor: 'João Carlos de Oliveira Carvalho',
    cargo: 'Secretário de Administração e Finanças',
    telefone: '(47) 3322-4455',
    celular: '(47) 9991-4455',
    email: 'financas@prefeitura.sc.gov.br',
    status: 'Ativo',
  },
  {
    id: 2,
    gestor: 'Mário José da Silva Chavier',
    cargo: 'Prefeito Municipal',
    telefone: '(47) 3322-4455',
    celular: '(47) 9991-4455',
    email: 'gabinete@prefeitura.sc.gov.br',
    status: 'Inativo',
  },
])
const colsConsignatesHabilitadas = reactive([
  { field: 'id', title: '#', hide: false, sort: false },
  { field: 'consignataria', title: 'Consignatária', hide: false },
  { field: 'tipo_instituicao', title: 'Tipo Instituição', hide: false },
  { field: 'tipo_servicos', title: 'Tipo de Serviços', hide: false },
  { field: 'data_habilitacao', title: 'Data Habilitação', hide: false },
  { field: 'data_renovação', title: 'Data Renovação', hide: false },
  { field: 'status', title: 'Status', hide: false },
  { field: 'averbacao', title: 'Averbação', hide: false },
  { field: 'habilitacao', title: 'Habilitação', hide: false },
  { field: 'actions', title: 'Ações', hide: false, sort: false },
])
const rowsConsignatesHabilitadas = reactive([
  {
    id: 1,
    consignataria: {
      nome: 'Banco do Brasil',
      tipo: 'Instituição Financeira',
      icone: '',
    },
    tipo_instituicao: 'Instituição Financeira',
    tipo_servicos: [
      {
        nome: 'Emprestimo',
        icone: 'emprestimo',
      },
    ],
    data_habilitacao: '23/03/2020',
    data_renovação: '23/03/2021',
    status: 'Inativo',
    averbacao: 'Bloqueada',
    habilitacao: 'Desabilitado',
  },
  {
    id: 2,
    consignataria: {
      nome: 'Banco Daycoval',
      tipo: 'Associação',
      icone: '',
    },
    tipo_instituicao: 'Cooperativa de Crédito',
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
        nome: 'Seguro',
        icone: 'seguros',
      },
    ],
    data_habilitacao: '15/10/2021',
    data_renovação: '15/10/2022',
    status: 'Ativo',
    averbacao: 'Liberada',
    habilitacao: 'Habilitado',
  },
])
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
    <breadcrumbs :paginas="['Cadastro', 'Consignante']" />

    <consulta-consignante />

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.dadosConsignante === true ? (accordians.dadosConsignante = false) : (accordians.dadosConsignante = true)">
        Dados do Consignante
        <div :class="{ 'rotate-180': accordians.dadosConsignante === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.dadosConsignante === true">
        <dados-consignante />
      </vue-collapsible>
    </div>

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.contratoSistema === true ? (accordians.contratoSistema = false) : (accordians.contratoSistema = true)">
        Contratos Sistema
        <div :class="{ 'rotate-180': accordians.contratoSistema === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.contratoSistema === true">
        <contrato-sistema :cols="colsContratoSistema" :rows="rowsContratoSistema" />
      </vue-collapsible>
    </div>
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.gestores === true ? (accordians.gestores = false) : (accordians.gestores = true)">
        Lista de Gestores
        <div :class="{ 'rotate-180': accordians.gestores === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.gestores === true">
        <lista-gestores :cols="colsGestores" :rows="rowsGestores" />
      </vue-collapsible>
    </div>
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.averbadores === true ? (accordians.averbadores = false) : (accordians.averbadores = true)">
        Lista de Averbadores
        <div :class="{ 'rotate-180': accordians.averbadores === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.averbadores === true">
        <lista-averbadores />
      </vue-collapsible>
    </div>
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.consignatariaHabilitadas === true ? (accordians.consignatariaHabilitadas = false) : (accordians.consignatariaHabilitadas = true)">
        Consignatárias Habilitadas
        <div :class="{ 'rotate-180': accordians.consignatariaHabilitadas === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.consignatariaHabilitadas === true">
        <consignataria-habilitadas :cols="colsConsignatesHabilitadas" :rows="rowsConsignatesHabilitadas"
          title="Consignatárias Habilitadas" />
      </vue-collapsible>
    </div>

    <!-- novas abas -->
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
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.normativosCadastrado === true ? (accordians.normativosCadastrado = false) : (accordians.normativosCadastrado = true)">
        Normativos
        <div :class="{ 'rotate-180': accordians.normativosCadastrado === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.normativosCadastrado === true">
        <normativos-cadastrado />
      </vue-collapsible>
    </div>
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.consignacoesAutorizadas === true ? (accordians.consignacoesAutorizadas = false) : (accordians.consignacoesAutorizadas = true)">
        Consignações
        <div :class="{ 'rotate-180': accordians.consignacoesAutorizadas === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.consignacoesAutorizadas === true">
        <consignacoes-autorizadas />
      </vue-collapsible>
    </div>
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.margemConsignavel === true ? (accordians.margemConsignavel = false) : (accordians.margemConsignavel = true)">
        Margem Consignável
        <div :class="{ 'rotate-180': accordians.margemConsignavel === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.margemConsignavel === true">
        <margem-consignavel />
      </vue-collapsible>
    </div>
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.regulamento === true ? (accordians.regulamento = false) : (accordians.regulamento = true)">
        Regulamento
        <div :class="{ 'rotate-180': accordians.regulamento === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.regulamento === true">
        <regulamento title="Regras para Consignações" title-modal="Cadastrar Regulamento"
          sub-title-modal="Regras da Consignação" />
      </vue-collapsible>
    </div>
    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.restricoes === true ? (accordians.restricoes = false) : (accordians.restricoes = true)">
        Restrições
        <div :class="{ 'rotate-180': accordians.restricoes === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.restricoes === true">
        <restricoes />
      </vue-collapsible>
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
        @click="accordians.anotacoes === true ? (accordians.anotacoes = false) : (accordians.anotacoes = true)">
        Anotações
        <div :class="{ 'rotate-180': accordians.anotacoes === true }">
          <icon-caret-down />
        </div>
      </button>
      <vue-collapsible :isOpen="accordians.anotacoes === true">
        <anotacoes />
      </vue-collapsible>
    </div>
    <!-- novas abas -->

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
      <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
        @click="accordians.logs === true ? (accordians.logs = false) : (accordians.logs = true)">
        Logs
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
