<script lang="ts" setup>
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import { ref } from 'vue'
	import * as z from 'zod'
	import TableTypeForm from './TableTypeForm.vue'
	import { tabelasAuxiliaresRepository } from '@/modules/configuracoes/stores'

	const properties = defineProps({
		dataId: {
			type: Number,
			required: true,
		},
		tableUrl: {
			type: String,
			required: true,
		},
		tableTypeName: {
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
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await tabelasAuxiliaresRepository.getAllTableValueById(
				properties.dataId,
				properties.tableUrl,
			)
			form.setValues({
				name: data.nome.toString(),
			})
		} catch (error) {
			console.log(error)
		} finally {
			isDataLoading.value = false
		}
	}

	const onSubmit = form.handleSubmit(async (values) => {
		emits('on-edit', properties.dataId, values)
	})
</script>

<template>
	<form-wrapper
		tooltip="Editar tipo"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar tipo ${tableTypeName}`"
		description="Atualize o conteúdo da tipo."
		class="sm:max-w-[780px]"
		@form-submit="onSubmit"
	>
		<template #trigger>
			<button-root variant="ghost" @click="setNewData">
				<font-awesome-icon
					class="text-primary_3-table w-4 h-4"
					:icon="['fas', 'pen']"
				/>
			</button-root>
		</template>

		<template #fields>
			<TableTypeForm :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>
