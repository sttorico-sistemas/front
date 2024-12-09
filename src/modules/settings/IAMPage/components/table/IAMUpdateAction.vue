<script lang="ts" setup>
	import { ref } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { iamRepository } from '@/core/stores'
	import IamForm from './IAMForm.vue'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableIamName: { type: String, required: true },
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
			description: z
				.string({ message: 'A descrição é obrigatória.' })
				.min(1, { message: 'A descrição é obrigatória.' }),
			permissions: z
				.array(z.string({ message: 'Esse campo é obrigatório.' }), {
					message: 'As permissões é obrigatória.',
				})
				.min(1, { message: 'É necessário pelo menos 1 permissão.' }),
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
		tooltip="Editar perfil"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar perfil ${tableIamName}`"
		description="Atualize o conteúdo da perfil."
		class="sm:max-w-[780px]"
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
			<iam-form
				:metadata="form.values"
				:disabled="isLoading"
			/>
		</template>
	</form-wrapper>
</template>
