<script lang="ts" setup>
	import { ref } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { serviceRepository } from '@/core/stores'
	import ServiceForm from './ServiceForm.vue'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableServiceName: { type: String, required: true },
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
			color: z
				.string({ message: 'O icon é obrigatório.' })
				.min(1, { message: 'O icon é obrigatório.' }),
			theme: z
				.string({ message: 'A url é obrigatória.' })
				.min(1, { message: 'A url é obrigatória.' }),
			iconFamily: z
				.string({ message: 'A url é obrigatória.' })
				.min(1, { message: 'A url é obrigatória.' }),
			iconName: z
				.string({ message: 'A url é obrigatória.' })
				.min(1, { message: 'A url é obrigatória.' }),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await serviceRepository.getServiceById(properties.dataId)
			form.setValues({
				name: data.name,
				color: data.color,
				theme: data.theme,
				iconFamily: data.icon.family,
				iconName: data.icon.name
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
		tooltip="Editar serviço"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar página ${tableServiceName}`"
		description="Atualize o conteúdo do serviço."
		class="sm:max-w-[780px]"
		@form-submit="onSubmit"
	>
		<template #trigger>
			<button-root variant="outline" @click="setNewData">
				<font-awesome-icon
					class="text-primary w-4 h-4"
					:icon="['fas', 'pen']"
				/>
			</button-root>
		</template>

		<template #fields>
			<service-form :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>
