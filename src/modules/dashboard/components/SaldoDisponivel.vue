<script setup lang="ts">
import { ref } from 'vue'
import calculatorIcon from 'src/core/components/Icons/IconCalculator2.vue'

const optionsServicos = ref(['Servico 1', 'Servico 2', 'Servico 3'])
const servico = ref('')
</script>

<template>
	<div id="saldo_disponivel"
		class="panel flex flex-col max-h-[244px] xl:row-start-2 xl:row-span-8 col-span-12 md:col-span-6 lg:col-span-3 xl:col-span-3 px-3">
		<h2 class="mb-4">Saldo Disponível da Margem</h2>

		<div class="saldo_disponivel__valor self-end border rounded mb-3 px-2 py-2">
			R$ 0,00
		</div>

		<multiselect v-model="servico" :options="optionsServicos" class="custom-multiselect mb-3" :searchable="false"
			placeholder="Selecione Tipo de Serviço" :allow-empty="false" selected-label="" select-label=""
			deselect-label="" />

		<div class="flex relative items-stretch flex-wrap">
			<div class="ltr:-mr-px rtl:-ml-px flex">
				<span
					class="border border-[#e0e6ed] dark:border-[#17263c] rounded-l bg-[#EAEAEC] flex items-center justify-center text-black px-4 py-1.5 dark:bg-[#1a1c2d] dark:text-white">
					<calculatorIcon />
				</span>
			</div>
			<span class="flex-1 flex items-center border rounded-r px-2 calcula_saldo">Calcule o saldo disponível da sua
				Margem</span>
		</div>
	</div>
</template>

<style lang="scss">
#saldo_disponivel.panel {
	h2 {
		color: var(--Dark, #3b3f5c);
		font-size: 19px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.saldo_disponivel__valor {
		width: 272px;
		color: var(--Dark, #3b3f5c);
		font-size: 32px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.calcula_saldo {
		color: var(--Dark, #3b3f5c);
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
}
</style>
