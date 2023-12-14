<script setup lang="ts">
import { reactive } from 'vue'

import MargemDetalhada from './margem-detalhada.vue'
import TotalReservado from './total-reservado.vue'

interface IMargemDetalhamento {
	financeiro: number,
	convenios: number,
	cartao_credito: number,
	cartao_beneficios: number,
}

interface IMargens {
	id: number,
	titulo: string,
	valor: number,
	porcentagem: number,
	total_reservado: number,
	detalhamento: IMargemDetalhamento
}

const margens = reactive<IMargens[]>([
	{
		id: 1,
		titulo: 'Total da Margem Principal',
		valor: 350,
		porcentagem: 35,
		total_reservado: 227.5,
		detalhamento: {
			financeiro: 100,
			convenios: 200,
			cartao_credito: 300,
			cartao_beneficios: 400,
		},
	},
	{
		id: 2,
		titulo: 'Total da Margem Secundária',
		valor: 50,
		porcentagem: 5,
		total_reservado: 25,
		detalhamento: {
			financeiro: 10,
			convenios: 20,
			cartao_credito: 30,
			cartao_beneficios: 40,
		},
	},
	{
		id: 3,
		titulo: 'Total da Margem Adicional',
		valor: 100,
		porcentagem: 10,
		total_reservado: 70,
		detalhamento: {
			financeiro: 600,
			convenios: 700,
			cartao_credito: 800,
			cartao_beneficios: 900,
		},
	},
])

const bgColor = (value: number) => {
	switch (value) {
	case 1:
		return 'bg-info'
	case 2:
		return 'bg-success'
	case 3:
		return 'bg-warning'
	}
}
</script>

<template>
  <div
    v-for="margem in margens"
    id="margem_individual"
    :key="margem.id"
    class="panel max-h-[595px] lg:max-h-[582px] col-span-12 md:col-span-4 lg:col-span-4 xl:col-span-2"
  >
    <div
      class="margem_individual__principal relative flex flex-col items-baseline w-full min-h-[123px] rounded border border-[#e0e6ed] p-3 mb-2 mt-8 text-start"
      :class="bgColor(margem.id)"
    >
      <div
        class="margem_individual__principal__destaque absolute border bg-white text-info rounded-md shadow-md p-2"
        :class="bgColor(margem.id)"
      >
        <span>Limite</span>
        <p class="text-info">
          {{ margem.porcentagem }}%
        </p>
      </div>

      <h3>R$ {{ margem.valor }}</h3>
      <p class="text-white">
        {{ margem.titulo }}
      </p>
    </div>

    <total-reservado :total-reservado="margem.total_reservado" />

    <div
      class="margem_individual__detalhamento w-full min-h-[266px] bg-white rounded border border-[#e0e6ed] px-2 pb-5"
    >
      <h3>Detalhamento da Margem Reservada</h3>

      <div
        class="w-full bg-white rounded border border-[#e0e6ed] pr-2 pl-1 py-3"
      >
        <margem-detalhada
          :detalhamento="margem.detalhamento"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#margem_individual.panel {
	.margem_individual__principal {
		h3 {
			color: var(--White, #fff);
			text-align: right;
			font-size: 32px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		p {
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		&__destaque {
			width: 69px;
			height: 66px;
			top: -30px;
			right: 20px;
			text-align: center;
			font-style: normal;
			font-weight: 500;
			line-height: normal;

			span {
				font-size: 12px;
			}

			p {
				font-size: 24px;
			}
		}
	}

	.margem_individual__total_reservado {
		h3 {
			color: var(--Danger, #e7515a);
			font-size: 32px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		p {
			color: #151516;
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}
	}

	.margem_individual__detalhamento {
		h3 {
			margin: 11px 0 5px;
			color: #151516;
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			text-align: center;
		}
	}
}
</style>
