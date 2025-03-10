<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import titulo from 'src/core/components/Titulo.vue'
import InputValidation from 'src/core/components/InputValidation.vue'
import modalLayout from 'src/core/components/Modal.vue'
import StepByNumber from 'src/core/components/StepByNumber.vue'
import SimuladorResultadoCalculo from '../components/ResultadoCalculo.vue'

const isOpenDialog = ref(false)
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

const clear = () => {
	$v.value.form.$reset()
	isSubmitForm.value = false

	form.vlrEmprestimo = ''
	form.vlrParcela = ''
	form.vlrJuros = ''
	form.vlrPrazo = ''
}

const calculate = () => {
	isSubmitForm.value = true

	$v.value.form.$touch()

	if ($v.value.form.$invalid) {
		return false
	}

	isOpenDialog.value = true
}

const sendForm = () => { }
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Simulador', 'Calculadora']" />
		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<titulo title="Calculadora de Empréstimos Financeiros" />
			</div>

			<div class="panel mt-6">
				<p class="mb-8 text-primary text-base font-semibold">
					Dados para o Cálculo
				</p>

				<form class="flex justify-between flex-wrap" @submit.prevent="sendForm()">
					<div class="mb-8">
						<p class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4">
							<step-by-number value="1" />
							Digite o valor do empréstimo ou da parcela desejada.
						</p>

						<div class="flex gap-9">
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation v-model="form.vlrEmprestimo" id="vlrEmprestimo" label="Valor do Empréstimo"
									placeholder="R$" message-error="Insira o valor do empréstimo" :is-submit-form="isSubmitForm"
									:error="$v.form.vlrEmprestimo.$error" />
							</div>
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation v-model="form.vlrParcela" id="vlrParcela" label="Valor da Parcela" placeholder="R$"
									message-error="Insira o valor da parcela" :is-submit-form="isSubmitForm"
									:error="$v.form.vlrParcela.$error" />
							</div>
						</div>
					</div>
					<div class="mb-8">
						<p class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4">
							<step-by-number value="2" />
							Digite a taxa de juros.
						</p>

						<div class="flex gap-9">
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation v-model="form.vlrJuros" id="vlrJuros" label="Taxa de Juros" placeholder="% ao mês"
									message-error="Insira a taxa " :is-submit-form="isSubmitForm" :error="$v.form.vlrJuros.$error"
									style-class="placeholder:text-right" />
							</div>
						</div>
					</div>
					<div class="mb-8">
						<p class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4">
							<step-by-number value="3" />
							Digite a quantidade de parcelas.
						</p>

						<div class="flex gap-9">
							<div class="grid grid-cols-1 sm:flex justify-between">
								<input-validation v-model="form.vlrPrazo" id="vlrPrazo" label="Prazo / nº parcelas" placeholder="0"
									message-error="Insira o prazo" :is-submit-form="isSubmitForm" :error="$v.form.vlrPrazo.$error" />
							</div>
						</div>
					</div>
					<div class="flex flex-col">
						<p class="text-sm font-semibold text-black-light flex items-center gap-1 mb-4">
							<step-by-number value="4" />
							Clique em calcular.
						</p>

						<div class="flex gap-9 mt-4">
							<div class="grid grid-cols-1 sm:flex justify-between gap-5">
								<button type="button" class="btn bg-primary text-white shadow-none w-32" @click="calculate">
									Calcular
								</button>
								<button type="button" class="btn border-primary text-primary shadow-none"
									@click="clear">
									Limpar
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		<modal-layout :is-open="isOpenDialog" size="max-w-4xl" title="Resultado do Cálculo"
			@btn-close="isOpenDialog = false">
			<simulador-resultado-calculo @btn-close="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
