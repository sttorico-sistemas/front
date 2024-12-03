<script lang="ts" setup>
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import { ref } from 'vue'
	import * as z from 'zod'
	import TablePageForm from './TablePerfilForm.vue'
	import { iamRepository } from '@/core/stores'

	const properties = defineProps({
		dataId: {
			type: Number,
			required: true,
		},
		tablePerfilName: {
			type: String,
			required: true,
		},
		isLoading: {
			type: Boolean,
			default: () => false,
		},
	})
	const emits = defineEmits(['on-edit'])
	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)

	const formSchema = toTypedSchema(
		z.object({
			name: z.string({ message: 'Esse campo é obrigatório.' }),
			description: z.string({ message: 'Esse campo é obrigatório.' }),
			permissions: z.array(
				z.string({ message: 'Esse campo é obrigatório 2.' }),
				{
					message: 'Esse campo é obrigatório 3.',
				},
			),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
		initialValues: {
			permissions: [],
		},
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await iamRepository.getTypeOfOperatorById(properties.dataId)
			form.setValues({
				name: data.name,
				description: data?.description,
				permissions: data?.permissions?.map(({ id }) => `${id}`) ?? [],
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
		tooltip="Editar perdil"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar cidade ${tablePerfilName}`"
		description="Atualize o conteúdo da cidade."
		class="sm:max-w-[780px] max-w-"
		@form-submit="onSubmit"
	>
		<template #trigger>
			<button-root variant="outline" @click="setNewData">
				<font-awesome-icon
					class="text-primary_3-table w-4 h-4"
					:icon="['fas', 'pen']"
				/>
			</button-root>
		</template>

		<template #fields>
			<TablePageForm :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>