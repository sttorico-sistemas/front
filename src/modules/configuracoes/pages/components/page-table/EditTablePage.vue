<script lang="ts" setup>
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import { ref } from 'vue'
	import * as z from 'zod'
	import TablePageForm from './TablePageForm.vue'
	import { generalRepository } from '@/core/stores/general.stores'

	const properties = defineProps({
		dataId: {
			type: Number,
			required: true,
		},
		tablePageName: {
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
			slug: z.string({ message: 'Esse campo é obrigatório.' }),
			url: z.string({ message: 'Esse campo é obrigatório.' }),
			parentId: z
				.string({ message: 'Esse campo é obrigatório.' })
				.optional()
				.nullable(),
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
			form.setValues({
				name: data.name,
				parentId: data?.parentId ? data.parentId.toString() : undefined,
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
		tooltip="Editar cidade"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar cidade ${tablePageName}`"
		description="Atualize o conteúdo da cidade."
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
			<TablePageForm :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>
