<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	import { required } from '@vuelidate/validators'
	import { useVuelidate } from '@vuelidate/core'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import InputValidation from '@components/layout/inputValidation.vue'
	import StepByNumber from '@components/layout/stepByNumber.vue'

	import ConsultasTitulo from '../consultas/consultas-titulo/consultas-titulo.vue'

	// Icons

	// Declarações
	const isSubmitForm = ref(false)
	const form = reactive({
		vlrEmprestimo: '',
		vlrParcela: '',
		vlrJuros: '',
		vlrPrazo: '',
	})
	const rules = {
		form: {
			vlrEmprestimo: { required },
			vlrParcela: { required },
			vlrJuros: { required },
			vlrPrazo: { required },
		},
	}
	const $v = useVuelidate(rules, { form })

	// Script
	const sendForm = () => {
		isSubmitForm.value = true

		$v.value.form.$touch()

		if ($v.value.form.$invalid) {
			return false
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Simulador', 'Calculadora']" />
		<div class="panel mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo title="Calculadora de Empréstimos Financeiros" />
			</div>

			<div class="panel mt-6">
				<p class="mb-8 text-primary_3 text-base font-semibold">
					Dados para o Cálculo
				</p>

				<form
					class="flex justify-between flex-wrap"
					@submit.prevent="sendForm()"
				>
					<div>
						<p
							class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4"
						>
							<step-by-number value="1" />
							Digite o valor do empréstimo ou da parcela desejada.
						</p>

						<div class="flex gap-9">
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation
									id="vlrEmprestimo"
									label="Valor do Empréstimo"
									placeholder="R$"
									message-error="Insira o valor do empréstimo"
									:is-submit-form="isSubmitForm"
									:error="$v.form.vlrEmprestimo.$error"
								/>
							</div>
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation
									id="vlrParcela"
									label="Valor da Parcela"
									placeholder="R$"
									message-error="Insira o valor da parcela"
									:is-submit-form="isSubmitForm"
									:error="$v.form.vlrParcela.$error"
								/>
							</div>
						</div>
					</div>
					<div>
						<p
							class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4"
						>
							<step-by-number value="2" />
							Digite a taxa de juros.
						</p>

						<div class="flex gap-9">
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation
									id="vlrJuros"
									label="Taxa de Juros"
									placeholder="% ao mês"
									message-error="Insira a taxa "
									:is-submit-form="isSubmitForm"
									:error="$v.form.vlrJuros.$error"
									style-class="placeholder:text-right"
								/>
							</div>
						</div>
					</div>
					<div>
						<p
							class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4"
						>
							<step-by-number value="3" />
							Digite a quantidade de parcelas.
						</p>

						<div class="flex gap-9">
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation
									id="vlrPrazo"
									label="Prazo / nº parcelas"
									placeholder="0"
									message-error="Insira o prazo"
									:is-submit-form="isSubmitForm"
									:error="$v.form.vlrPrazo.$error"
								/>
							</div>
						</div>
					</div>
					<div class="flex flex-row justify-between">
						<p
							class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4"
						>
							<step-by-number value="4" />
							Clique em calcular.
						</p>

						<div class="flex gap-9">
							<div class="grid grid-cols-1 sm:flex justify-between gap-5">
								<button
									type="button"
									class="btn bg-primary_3 text-white shadow-none w-32"
								>
									Calcular
								</button>
								<button
									type="button"
									class="btn btn-outline-primary_3 text-primary_3 shadow-none"
								>
									Limpar
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</main>
</template>
<style lang="scss" scoped></style>
