<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import breadcrumbs from '@/core/components/Breadcrumbs.vue'
import titulo from '@/core/components/Titulo.vue'
import InputValidation from '@/core/components/InputValidation.vue'
import modalLayout from '@/core/components/Modal.vue'
import StepByNumber from '@/core/components/StepByNumber.vue'

import SimuladorResultadoEmprestimo from '../components/ResultadoEmprestimo.vue'

// Icons

// Declarações
const isOpenDialog = ref<boolean>(false)
const isSubmitForm = ref(false)
const form = reactive({
	vlrEmprestimo: '',
	vlrParcela: '',
	vlrPrazo: '',
})
const rules = {
	form: {
		vlrEmprestimo: { required },
		vlrParcela: { required },
		vlrPrazo: { required },
	},
}
const $v = useVuelidate(rules, { form })

// Script
const clear = () => {
	$v.value.form.$reset()
	isSubmitForm.value = false

	form.vlrEmprestimo = ''
	form.vlrParcela = ''
	form.vlrPrazo = ''
}

const simulate = () => {
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
		<breadcrumbs :paginas="['Simulador', 'Empréstimos']" />
		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<titulo title="Simulador de Empréstimos Financeiros" />
			</div>

			<div class="panel mt-6">
				<p class="mb-8 text-primary_3 text-base font-semibold">
					Dados para a simulação
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
							Clique em simular.
						</p>

						<div class="flex gap-9 mt-4">
							<div class="grid grid-cols-1 sm:flex justify-between gap-5">
								<button type="button" class="btn bg-primary_3-table text-white shadow-none w-32" @click="simulate">
									Simular
								</button>
								<button type="button" class="btn border-primary_3-table text-primary_3-table shadow-none"
									@click="clear">
									Limpar
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		<modal-layout :is-open="isOpenDialog" size="w-full" title="Resultado do Cálculo" @btn-close="isOpenDialog = false">
			<simulador-resultado-emprestimo @btn-close="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
<style lang="scss" scoped></style>
