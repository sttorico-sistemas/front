<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive } from 'vue';

import router from 'src/core/router'

// Componentes
import ImageName from '../ConsultasHistorico/DatatableColunaImageName.vue'

// Icons
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconCartaoCreditoServico from 'src/core/components/Icons/Services/IconCartaoCreditoServico.vue'
import IconEmprestimoServico from 'src/core/components/Icons/Services/IconEmprestimosServicos.vue'
import IconConveniosServico from 'src/core/components/Icons/Services/IconConveniosServicos.vue'
import IconMensalidadeServico from 'src/core/components/Icons/Services/IconMensalidadeServicos.vue'
import IconPlanoSaudeServico from 'src/core/components/Icons/Services/IconPlanoSaudeServico.vue'
import IconSegurosServico from 'src/core/components/Icons/Services/IconSegurosServico.vue'

// Declarações
const cols = reactive([
	{ field: 'tipo_servicos', title: 'Tipo de Serviço', hide: false, sort: false, },
	{ field: 'valor_reservado', title: 'Vlr Reservado', hide: false, sort: false, },
	{ field: 'action', title: 'Ação', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: '1',
		tipo_servicos: [
			{
				nome: 'Empréstimo',
				icone: 'emprestimo',
			},
		],
		valor_reservado: 'R$ 200,00',
	},
	{
		id: '2',
		tipo_servicos: [
			{
				nome: 'Convênios',
				icone: 'convenios',
			},
		],
		valor_reservado: 'R$ 100,00',
	},
])

// Script
const iconeService = (value: string) => {
	console.log(value)
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
		case 'convenios':
			return IconConveniosServico
		default:
			return 'https://placehold.co/30x30?text=TS'
	}
}
</script>
<template>
	<div class="panel mt-5 flex justify-between">
		<div
			class="w-[70px] h-[53px] rounded-md flex justify-center items-center flex-col px-2 py-2.5 bg-info text-white font-semibold">
			<span class="text-base">35%</span>
			<span class="text-sm ">Limite</span>
		</div>
		<div class="flex justify-center items-center flex-col font-semibold text-dark">
			<span class="text-xl">R$ 350,00</span>
			<span class="text-xs">Total da Margem</span>
		</div>
		<div class="flex justify-center items-center flex-col font-semibold text-danger">
			<span class="text-xl">R$ 300,00</span>
			<span class="text-xs">Total Reservado</span>
		</div>
	</div>
	<div class="panel mt-6 datatable">
		<div class="flex justify-between items-center mb-8">
			<p class="text-primary_3 text-base font-semibold">
				Margens Reservadas
			</p>
		</div>

		<vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
			skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
			pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="false">
			<template #tipo_servicos="data">
				<div class="flex">
					<template v-for="(tipo_servico, idx) in data.value.tipo_servicos" :key="idx">
						<image-name v-tippy:top :name="tipo_servico.nome">
							<component :is="iconeService(tipo_servico.icone)" />
						</image-name>
					</template>
				</div>
			</template>
			<template #action="data">
				<button v-tippy:right type="button" class="text-xs m-1"
					@click="router.push({ name: 'consultas-rmc', params: { id: data.value.id } })">
					<icon-eye class="w-5 h-5 text-primary_3-table" />
				</button>
				<tippy target="right" placement="right">Ver resumo da margem principal</tippy>
			</template>
		</vue3-datatable>
	</div>
</template>