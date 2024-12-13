<script lang="ts" setup>
	import { ref } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { generalRepository } from '@/core/stores'
	import RouteManagerForm from './RouteManagerForm.vue'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableRouteManagerName: { type: String, required: true },
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
			slug: z
				.string({ message: 'O slug é obrigatório.' })
				.min(1, { message: 'O slug é obrigatório.' }),
			url: z
				.string({ message: 'A url é obrigatória.' })
				.min(1, { message: 'A url é obrigatória.' }),
			permissions: z
				.object(
					{
						id: z.string({ message: 'Esse campo é obrigatório.' }),
						title: z.string({ message: 'Esse campo é obrigatório.' }),
					},
					{ message: 'Esse campo é obrigatório.' },
				)
				.optional(),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await generalRepository.getPageById(properties.dataId)
			console.log({
				name: data.name,
				permissions: data?.parentId
					? {
							id: data?.parentId.toString(),
							title: data,
						}
					: undefined,
				slug: data.slug,
				url: data.url,
			})
			form.setValues({
				name: data.name,
				permissions: data?.parentId
					? {
							id: data?.parentId.toString(),
							title: '',
						}
					: undefined,
				slug: data.slug,
				url: data.url,
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
		tooltip="Editar página"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar página ${tableRouteManagerName}`"
		description="Atualize o conteúdo da página."
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
			<route-manager-form :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>
