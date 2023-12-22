<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive } from 'vue'

// Componentes
import breadcrumbs from '../../components/layout/breadcrumbsLayout.vue'

// Icons
import IconCaretDown from '../../assets/svg/iconCaretDown.vue'
import IconFile from '../../assets/svg/iconFile.vue'
import IconPrinter from '../../assets/svg/iconPrinter.vue'

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

// Mudar para Utils
// const formatDate = (date) => {
// 	if (date) {
// 		const dt = new Date(date)
// 		const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
// 		const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
// 		return day + '/' + month + '/' + dt.getFullYear()
// 	}
// 	return ''
// }

// Mudar para Utils
const capitalize = (text: string) => {
	return text
		.replace('_', ' ')
		.replace('-', ' ')
		.toLowerCase()
		.split(' ')
		.map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(' ')
}

const excelColumns = () => {
	return {
		rmc: 'RMC',
		data: 'Data',
		tipo_rmc: 'Tipo RMC',
		cod_autorizacao: 'Cód Autorização',
		tipo_autorizacao: 'Tipo Autorização',
		margem_reservada: 'Margem Reservada',
		tipo_consignado: 'Tipo Consignação',
		consignataria: 'Consignatária',
		local_atendimento: 'Local Atendimento',
		operador: 'Operador',
		valor_rmc: 'Valor RMC',
		status: 'Status'
	}
}

// !TODO - Não exportar os dados, somente as colunas.
const excelItems = () => {
	return rows
}

const exportTable = (type: string) => {
	let columns: any = cols.map((d: any) => d.field)

	let records = rows
	let filename = 'Resumo da RMC - Reserva da Margem de Consignação'

	let newVariable: any
	newVariable = window.navigator

	if (type == 'print') {
		var rowhtml = '<p>' + filename + '</p>'
		rowhtml +=
			'<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> '
		columns.map((d: any) => {
			rowhtml += '<th>' + capitalize(d) + '</th>'
		})
		rowhtml += '</tr></thead>'
		rowhtml += '<tbody>'

		records.map((item) => {
				rowhtml += '<tr>'
				columns.map((d: any) => {
						let val = item[d] ? item[d] : ''

						if (item[d].hasOwnProperty('label'))
							val = item[d].label

						rowhtml += '<td>' + val + '</td>'
				})
				rowhtml += '</tr>'
		})
		rowhtml +=
			'<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>'
		rowhtml += '</tbody></table>'

		var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0')
		winPrint.document.write('<title>Print</title>' + rowhtml)
		winPrint.document.close()
		winPrint.focus()
		winPrint.print()
		// winPrint.close()
	}
}

const color = (id: number | string): string => {
	switch (id) {
	case 1:
		return 'bg-info' // Reservada
	case 2:
		return 'bg-danger' // Suspensa
	case 3:
		return 'bg-secondary' // Baixada
	case 4:
		return 'bg-warning' // Cancelada
	default:
		return '#E0E6ED'
	}
}

// fonte: https://vue3-datatable-document.vercel.app/skeleton-loader
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'RMC']" />

    <div class="panel pb-0 mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <h5 class="text-lg font-semibold text-primary_3-table">
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
                <span class="text-xs text-black mr-5">Colunas</span>
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
                            @change="col.hide = !($event.target as HTMLInputElement).checked"
                          >
                          <span
                            :for="`chk-${i}`"
                            class="ml-2 mr-2 text-xs text-black"
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
                class="min-w-[230px] flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm whitespace-nowrap"
              >
                <span class="text-xs text-black mr-5">Selecione o tipo de consignação</span>
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
                            class="ml-2 mr-2 text-xs text-black"
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
                class="min-w-[200px] flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm whitespace-nowrap"
              >
                <span class="text-xs text-black mr-5">Selecione a Consignatária</span>
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
                            class="ml-2 mr-2 text-xs text-black"
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
                class="min-w-[200px] flex items-center border font-semibold border-[#e0e6ed] rounded-md px-4 py-2 text-sm whitespace-nowrap"
              >
                <span class="text-xs text-black mr-5">Selecione a Situação</span>
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
                            class="ml-2 mr-2 text-xs text-black"
                          >{{ col.title }}</span>
                        </label>
                      </div>
                    </li>
                  </template>
                </ul>
              </template>
            </Popper>
          </div>
					<vue3-json-excel
						class="btn btn-sm btn-outline-primary text-xs m-1 cursor-pointer"
						name="resumo-da-rmc_reserva_da_margem-de-consignacao.xls"
						:fields="excelColumns()"
						:json-data="excelItems()"
					>
						<icon-file class="w-5 h-5 mr-2 ml-2" />
						XLS
					</vue3-json-excel>
					<button
						type="button"
						class="btn btn-sm btn-outline-primary text-xs m-1"
						@click="exportTable('print')"
					>
						<icon-printer class="w-5 h-5 mr-2 ml-2" />
						PRINT
					</button>
        </div>
      </div>

      <!-- Datatable-->
      <div class="datatable mb-[344px]">
        <vue3-datatable
          :rows="rows"
          :columns="cols"
          :total-rows="rows.length"
          :sortable="true"
          skin="whitespace-nowrap bh-table-striped"
          first-arrow=""
          no-data-content="Nenhum dado foi encontrado"
          pagination-info="Mostrando {0} a {1} de {2} entradas"
        >
          <template #rmc="data">
            <a href="#"><strong class="text-primary_3-table">{{ data.value.rmc }}</strong></a>
          </template>
          <template #status="data">
            <span
              class="flex justify-center badge !w-[80px] h-[22px]"
              :class="color(data.value.status.id)"
            >{{ data.value.status.label }}</span>
          </template>
        </vue3-datatable>
      </div>
      <!-- Datatable-->
    </div>
  </main>
</template>

<style lang="scss">
	.datatable .bh-table-responsive table thead tr th {
		color: #1384AD;
		font-size: 14px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
	}
</style>
