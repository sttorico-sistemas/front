<script lang="ts" setup>
	import { ref, watch } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { endorserRepository } from '@/core/stores'
	import EndorserForm from './EndorserForm.vue'
	import { EndorserModel } from '@/core/models'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableEndorserName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-edit'])

	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)
	const loadCities = ref<Record<string, string>>({})

	const formSchema = toTypedSchema(
		z.object({
			name: z
				.string({ message: 'O nome é obrigatório' })
				.min(1, { message: 'O nome é obrigatório.' }),
			managerId: z
				.string({ message: 'O gestor é obrigatório' })
				.min(1, { message: 'O gestor é obrigatório.' }),
			endorserTypeId: z
				.string({ message: 'O tipo do averbador é obrigatório' })
				.min(1, { message: 'O tipo do averbador é obrigatório.' }),
			phone: z
				.string({ message: 'O telefone é obrigatório.' })
				.min(1, { message: 'O telefone é obrigatório.' }),
			cellphone: z
				.string({ message: 'O celular é obrigatório' })
				.min(1, { message: 'O celular é obrigatório.' }),
			email: z
				.string({ message: 'O e-mail é obrigatório' })
				.email({ message: 'O e-mail tem que ser válido.' })
				.min(1, { message: 'O e-mail é obrigatório.' }),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await endorserRepository.getEndorserById(properties.dataId)

			form.setValues({
				name: data.name,
				managerId: data.manager?.id?.toString(),
				endorserTypeId: data.endorserTypeId.toString(),
				cellphone: data.cellphone,
				email: data.email,
				phone: data.phone
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
		tooltip="Editar Averbador"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar Averbador`"
		class="sm:max-w-[526px]"
		@form-submit="onSubmit"
	>
		<template #trigger>
			<button-root
				:disabled="!isActive"
				variant="ghost"
				size="icon"
				@click="setNewData"
			>
				<font-awesome-icon
					class="text-primary w-5 h-5"
					:icon="['fas', 'pen']"
				/>
			</button-root>
		</template>

		<template #fields>
			<endorser-form
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
				@on-close="openUpdateModal = false"
			/>
		</template>
	</form-wrapper>
</template>
