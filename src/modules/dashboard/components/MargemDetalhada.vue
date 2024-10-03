<script setup lang="ts">
import { PropType } from 'vue'

// Icons
import beneficsCardIcon from '@/core/components/Icons/IconBeneficsCard.vue'
import conveniosIcon from '@/core/components/Icons/IconAgreements.vue'
import creditCardIcon from '@/core/components/Icons/IconCreditCard.vue'
import currencyIcon from '@/core/components/Icons/IconCurrency.vue'

// Scripts
interface IMargemDetalhamento {
	financeiro: number
	convenios: number
	cartao_credito: number
	cartao_beneficios: number
}

const props = defineProps({
	detalhamento: {
		type: Object as PropType<IMargemDetalhamento>,
		required: true,
	},
})

const color = [
	{
		title: 'Financeiro',
		bgColor: 'bg-info',
		textColor: 'text-info',
		icon: currencyIcon,
	},
	{
		title: 'Convênios',
		bgColor: 'bg-orange-200',
		textColor: 'text-warning',
		icon: conveniosIcon,
	},
	{
		title: 'Cartão de Crédito',
		bgColor: 'bg-secondry',
		textColor: 'text-secondry',
		icon: creditCardIcon,
	},
	{
		title: 'Cartão de Benefícios',
		bgColor: 'bg-primary_3',
		textColor: 'text-primary_3',
		icon: beneficsCardIcon,
	},
]
</script>
<template>
	<div v-for="(value, key, id) in props.detalhamento" :key="key" class="w-full flex justify-between items-center mb-3">
		<div class="flex items-center gap-1">
			<div class="flex justify-center items-center w-10 h-10 rounded-xl" :class="color[id].bgColor">
				<component :is="color[id].icon" />
			</div>
			<span class="margem_individual__detalhamento__title" :class="color[id].textColor">{{ color[id].title }}</span>
		</div>
		<span class="margem_individual__detalhamento__value" :class="color[id].textColor">R$ {{ value }}</span>
	</div>
</template>

<style lang="scss">
.margem_individual__detalhamento {
	&__title {
		font-size: 14px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	&__value {
		font-size: 12px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
}
</style>
