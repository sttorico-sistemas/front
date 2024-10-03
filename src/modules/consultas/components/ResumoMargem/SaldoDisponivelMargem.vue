<script lang="ts" setup>
import { ref } from 'vue'

// Componentes
import titulo from '@/core/components/Titulo.vue'

// Icons
import calculatorIcon from '@/core/components/icons/iconCalculator2.vue'

// Declarações
const optionsServicos = ref(['Servico 1', 'Servico 2', 'Servico 3'])
const servico = ref()

// Scripts
const clear = () => servico.value = ''
</script>
<template>
	<div class="panel pb-0 mt-6">
		<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-3 gap-5">
			<titulo title="Saldo Disponível da Margem" info-message="Alguma mensagem aqui para tirar dúvida sobre a página" />
		</div>

		<div id="saldo_disponivel" class="flex justify-between flex-wrap items-center py-8">
			<multiselect v-model="servico" :options="optionsServicos" class="custom-multiselect w-[286px] h-[48px]"
				:searchable="false" placeholder="Selecione Tipo de Serviço" :allow-empty="false" selected-label=""
				select-label="" deselect-label="" />

			<div class="saldo_disponivel__valor self-end border rounded px-2 py-2">R$ 0,00</div>

			<button type="button" class="w-[77px] h-[48px] btn border-primary_3-table text-primary_3-table shadow-none"
				@click="clear">
				Limpar
			</button>

			<div class="w-[575px] h-[48px] flex relative items-stretch flex-wrap">
				<div class="ltr:-mr-px rtl:-ml-px flex">
					<span
						class="border border-[#e0e6ed] rounded-l bg-[#EAEAEC] flex items-center justify-center text-black px-4 py-1.5 ">
						<calculatorIcon />
					</span>
				</div>
				<span class="flex-1 flex items-center border rounded-r px-2 calcula_saldo">Calcule o saldo disponível da sua
					Margem</span>
			</div>
		</div>
	</div>
</template>