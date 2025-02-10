<script lang="ts" setup>
import InputReadonly from 'src/core/components/Inputs/InputReadonly.vue'

const emits = defineEmits(['btnSave', 'btnClose'])
</script>

<template>
	<main>
		<div class="panel pb-0 mt-6">
			<div class="flex flex-wrap flex-col justify-center md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex flex-wrap gap-5 mb-12">
					<input-readonly label="Valor Financiado" labelLeft="R$" />
					<input-readonly label="Valor da Parcela" labelLeft="R$" />
					<input-readonly label="Valor Liberado" labelLeft="R$" />
				</div>

				<div class="flex flex-wrap gap-5 mb-12">
					<input-readonly label="Taxa de Juros Mensal" labelLeft="%" />
					<input-readonly label="CET - Mensal" labelLeft="%" />
					<input-readonly label="CET - Anual" labelLeft="%" />
				</div>

				<div class="flex flex-wrap gap-5 mb-12">
					<input-readonly label="Valor Total à pagar com juros" labelLeft="R$" />
					<input-readonly label="Total de juros do empréstimo" labelLeft="R$" />
				</div>

				<div class="max-w-2xl flex justify-center flex-wrap gap-5 mb-12">
					<button type="button" class="btn border-primary text-primary shadow-none"
						@click="emits('btnClose', false)">Novo Cálculo</button>

					<p class="text-danger text-xs text-center">O cálculo dos valores servem somente para você ter noção de como
						ficará o valor final e o valor de cada parcela a ser paga, podem sofrer alterações de acordo com as regras
						das Instituições Financeiras.</p>
				</div>
			</div>
		</div>
	</main>
</template>