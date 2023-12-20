<script setup>
import { reactive } from 'vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'

// Componentes
import breadcrumbs from '../../components/layout/breadcrumbsLayout.vue'

// Script
const cols = reactive([
	{ field: 'rmc', title: 'RMC', isUnique: true, hide: false },
	{ field: 'data', title: 'Data', hide: false },
	{ field: 'tipo_rmc', title: 'Tipo RMC', hide: false },
	{ field: 'cod_autorizacao', title: 'Cód Autorização', hide: false },
	{ field: 'tipo_autorizacao', title: 'Tipo Autorização', hide: false },
	{ field: 'margem_reservada', title: 'Margem Reservada', hide: false },
	{ field: 'tipo_consignado', title: 'Tipo Consignação', hide: false },
	{ field: 'consignataria', title: 'Consignatária', hide: false },
	{ field: 'local_atendimento', title: 'Local Atendimento', hide: false },
	{ field: 'operador', title: 'Operador', hide: false },
	{ field: 'valor_rmc', title: 'Valor RMC', hide: false },
	{ field: 'status', title: 'Status', hide: false },
])

const rows = reactive([
	{
		rmc: 3629999,
		data: '09/19/2016 - 10:00',
		tipo_rmc: 'Originada',
		cod_autorizacao: '202356481BBQ',
		tipo_autorizacao: 'Manual',
		margem_reservada: 'Margem Principal - 35%',
		tipo_consignado: 'Financeiro',
		consignataria: 'Banco do Brasil S/A',
		local_atendimento: 'Agência Balneário Camboriú - 1489',
		operador: 'José da Silva',
		valor_rmc: 'R$ 100,00',
		status: {
			id: 1,
			label: 'Reservada'
		}
	},
	{
		rmc: 1203,
		data: 'informada',
		tipo_rmc: 'Importada',
		cod_autorizacao: 'Não informado',
		tipo_autorizacao: 'Não informado',
		margem_reservada: 'Margem Secundária - 5%',
		tipo_consignado: 'Financeiro',
		consignataria: 'Banco do Brasil S/A',
		local_atendimento: 'Agência Balneário Camboriú - 1489',
		operador: 'José da Silva',
		valor_rmc: 'R$ 100,00',
		status: {
			id: 2,
			label: 'Suspensa'
		}
	},
	{
		rmc: 7079,
		data: '07/18/2017 - 14:00',
		tipo_rmc: 'Originada',
		cod_autorizacao: '202200128CHS',
		tipo_autorizacao: 'On-line',
		margem_reservada: 'Margem Principal - 5%',
		tipo_consignado: 'Financeiro',
		consignataria: 'Banco do Brasil S/A',
		local_atendimento: 'Agência Balneário Camboriú - 1489',
		operador: 'José da Silva',
		valor_rmc: 'R$ 100,00',
		status: {
			id: 3,
			label: 'Baixada'
		}
	},
	{
		rmc: 9875,
		data: '03/27/2017 - 09:00',
		tipo_rmc: 'Originada',
		cod_autorizacao: '202354012LKM',
		tipo_autorizacao: 'On-line',
		margem_reservada: 'Margem Principal - 5%',
		tipo_consignado: 'Financeiro',
		consignataria: 'Banco do Brasil S/A',
		local_atendimento: 'Agência Balneário Camboriú - 1489',
		operador: 'José da Silva',
		valor_rmc: 'R$ 100,00',
		status: {
			id: 1,
			label: 'Reservada'
		}
	},
	{
		rmc: 4713,
		data: '11/06/2017 - 11:00',
		tipo_rmc: 'Originada',
		cod_autorizacao: '202356154WDS',
		tipo_autorizacao: 'Manual',
		margem_reservada: 'Margem Principal - 10%',
		tipo_consignado: 'Financeiro',
		consignataria: 'Banco do Brasil S/A',
		local_atendimento: 'Agência Balneário Camboriú - 1489',
		operador: 'José da Silva',
		valor_rmc: 'R$ 100,00',
		status: {
			id: 4,
			label: 'Cancelada'
		}
	}
])

const formatDate = (date) => {
	if (date) {
		const dt = new Date(date)
		const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
		const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
		return day + '/' + month + '/' + dt.getFullYear()
	}
	return ''
}

// fonte: https://vue3-datatable-document.vercel.app/skeleton-loader
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'RMC']" />

    <!-- Datatable-->
    <div class="panel pb-0 mt-6">
      <div class="flex md:items-center md:flex-row flex-col mb-5 gap-5">
        <h5 class="font-semibold text-lg dark:text-white-light">
          Resumo da RMC - Reserva da Margem de Consignação
        </h5>

        <div class="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
          <div class="dropdown">
            <Popper
              placement="bottom-end"
              offset-distance="0"
              class="align-middle"
            >
              <button
                type="button"
                class="flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm "
              >
                <span class="ltr:mr-1 rtl:ml-1">Colunas</span>
                <icon-caret-down class="w-5 h-5" />
              </button>
              <template #content>
                <ul class="whitespace-nowrap">
                  <template
                    v-for="(col, i) in cols"
                    :key="i"
                  >
                    <li>
                      <div class="flex items-center px-4 py-1">
                        <label class="cursor-pointer mb-0">
                          <input
                            :id="`chk-${i}`"
                            type="checkbox"
                            class="form-checkbox"
                            :value="col.field"
                            :checked="!col.hide"
                            @change="col.hide = !$event.target.checked"
                          >
                          <span
                            :for="`chk-${i}`"
                            class="ltr:ml-2 rtl:mr-2"
                          >{{ col.title }}</span>
                        </label>
                      </div>
                    </li>
                  </template>
                </ul>
              </template>
            </Popper>
          </div>
          <div class="dropdown">
            <Popper
              placement="bottom-end"
              offset-distance="0"
              class="align-middle"
            >
              <button
                type="button"
                class="flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm "
              >
                <span class="ltr:mr-1 rtl:ml-1">Selecione o tipo de consignação</span>
                <icon-caret-down class="w-5 h-5" />
              </button>
              <template #content>
                <ul class="whitespace-nowrap">
                  <template
                    v-for="(col, i) in cols"
                    :key="i"
                  >
                    <li>
                      <div class="flex items-center px-4 py-1">
                        <label class="cursor-pointer mb-0">
                          <input
                            :id="`chk-${i}`"
                            type="checkbox"
                            class="form-checkbox"
                            :value="col.field"
                            :checked="!col.hide"
                            @change="col.hide = !$event.target.checked"
                          >
                          <span
                            :for="`chk-${i}`"
                            class="ltr:ml-2 rtl:mr-2"
                          >{{ col.title }}</span>
                        </label>
                      </div>
                    </li>
                  </template>
                </ul>
              </template>
            </Popper>
          </div>
          <div class="dropdown">
            <Popper
              placement="bottom-end"
              offset-distance="0"
              class="align-middle"
            >
              <button
                type="button"
                class="flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm "
              >
                <span class="ltr:mr-1 rtl:ml-1">Selecione a Consignatária</span>
                <icon-caret-down class="w-5 h-5" />
              </button>
              <template #content>
                <ul class="whitespace-nowrap">
                  <template
                    v-for="(col, i) in cols"
                    :key="i"
                  >
                    <li>
                      <div class="flex items-center px-4 py-1">
                        <label class="cursor-pointer mb-0">
                          <input
                            :id="`chk-${i}`"
                            type="checkbox"
                            class="form-checkbox"
                            :value="col.field"
                            :checked="!col.hide"
                            @change="col.hide = !$event.target.checked"
                          >
                          <span
                            :for="`chk-${i}`"
                            class="ltr:ml-2 rtl:mr-2"
                          >{{ col.title }}</span>
                        </label>
                      </div>
                    </li>
                  </template>
                </ul>
              </template>
            </Popper>
          </div>
          <div class="dropdown">
            <Popper
              placement="bottom-end"
              offset-distance="0"
              class="align-middle"
            >
              <button
                type="button"
                class="flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm "
              >
                <span class="ltr:mr-1 rtl:ml-1">Selecione a Situação</span>
                <icon-caret-down class="w-5 h-5" />
              </button>
              <template #content>
                <ul class="whitespace-nowrap">
                  <template
                    v-for="(col, i) in cols"
                    :key="i"
                  >
                    <li>
                      <div class="flex items-center px-4 py-1">
                        <label class="cursor-pointer mb-0">
                          <input
                            :id="`chk-${i}`"
                            type="checkbox"
                            class="form-checkbox"
                            :value="col.field"
                            :checked="!col.hide"
                            @change="col.hide = !$event.target.checked"
                          >
                          <span
                            :for="`chk-${i}`"
                            class="ltr:ml-2 rtl:mr-2"
                          >{{ col.title }}</span>
                        </label>
                      </div>
                    </li>
                  </template>
                </ul>
              </template>
            </Popper>
          </div>
        </div>
      </div>

      <div class="datatable">
        <vue3-datatable
          :rows="rows"
          :columns="cols"
          :total-rows="rows.length"
          :sortable="true"
          skin="whitespace-nowrap bh-table-hover"
          first-arrow=""
					no-data-content="Nenhum dado foi encontrado"
          pagination-info="Mostrando {0} a {1} de {2} entradas"
        >
          <!-- <template #dob="data">
            {{ formatDate(data.value.dob) }}
          </template>
          <template #isActive="data">
            <span
              class="capitalize"
              :class="data.value.isActive ? 'text-success' : 'text-danger'"
            >{{ data.value.isActive }}</span>
          </template> -->
        </vue3-datatable>
      </div>
    </div>
    <!-- Datatable-->
  </main>
</template>
