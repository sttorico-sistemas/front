<script lang="ts" setup>
	import { ref } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { auxiliaryRepository } from '@/core/stores'
	import CityForm from './CityForm.vue'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableCityName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
	})
	const emits = defineEmits(['on-edit'])

	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)

	const formSchema = toTypedSchema(
		z.object({
			name: z
				.string({ message: 'O nome é obrigatório.' })
				.min(1, { message: 'O nome é obrigatório.' }),
			stateId: z
				.string({ message: 'O estado é obrigatório.' })
				.min(1, { message: 'O estado é obrigatório.' }),
			ibgeCode: z
				.string({ message: 'O código IBGE é obrigatório.' })
				.min(1, { message: 'O código IBGE é obrigatório.' }),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await auxiliaryRepository.getCityById(properties.dataId)
			console.log('data', data)
			form.setValues({
				ibgeCode: data.ibgeId?.toString(),
				name: data.name?.toString(),
				stateId: data.stateId?.toString(),
			})
		} catch (error) {
			console.log(error)
		} finally {
			isDataLoading.value = false
		}
	}

	const onSubmit = form.handleSubmit(async (values) => {
		emits('on-edit', properties.dataId, values, () => {
			openUpdateModal.value = false
		})
	})
</script>

<template>
	<form-wrapper
		tooltip="Editar cidade"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar Cidade`"
		class="sm:max-w-[440px]"
		@form-submit="onSubmit"
	>
		<template #trigger>
			<button-root variant="ghost" size="icon" @click="setNewData">
				<font-awesome-icon
					class="text-primary w-5 h-5"
					:icon="['fas', 'pen']"
				/>
			</button-root>
		</template>

		<template #fields>
			<city-form :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>
