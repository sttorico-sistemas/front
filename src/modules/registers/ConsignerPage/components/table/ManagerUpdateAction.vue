<script lang="ts" setup>
	import { ref, watch } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { managerRepository } from '@/core/stores'
	import ManagerForm from './ManagerForm.vue'
	import { ManagerModel } from '@/core/models'
import { formatCPF } from '@/core/utils'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableManagerName: { type: String, required: true },
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
			position: z
				.string({ message: 'O função é obrigatório' })
				.min(1, { message: 'O função é obrigatório.' }),
			department: z
				.string({ message: 'O departamento é obrigatório' })
				.min(1, { message: 'O departamento é obrigatório.' }),
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
			const data = await managerRepository.getManagerById(properties.dataId)
			console.log(data)
			form.setValues({
				name: data.name,
				email: data.email ?? undefined,
				cellphone: data.cellphone,
				phone: data.phone,
				department: data.department,
				position: data.position
			})
			console.log(data)
		} catch (error) {
			console.log(error)
		} finally {
			isDataLoading.value = false
		}
	}

	const onSubmit = form.handleSubmit(async (values) => {
		console.log(values)
		emits('on-edit', properties.dataId, values, () => {
			openUpdateModal.value = false
		})
	})
</script>

<template>
	<form-wrapper
		tooltip="Editar averbador"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		title="Editar Gestor"
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
			{{ JSON.stringify(form.errors.value) }}
			<manager-form
				edited
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
				@on-close="openUpdateModal = false"
			/>
		</template>
	</form-wrapper>
</template>
