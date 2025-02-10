<script lang="ts" setup>
	import { ref, watch } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { masterConsignerRepository } from '@/core/stores'
	import MasterConsignerForm from './MasterConsignerForm.vue'
	import { MasterConsignerModel } from '@/core/models'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableMasterConsignerName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-edit'])

	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)
	const currentData = ref<MasterConsignerModel | undefined>()

	const formSchema = toTypedSchema(
		z.object({
			name: z
				.string({ message: 'O nome é obrigatório.' })
				.min(1, { message: 'O nome é obrigatório.' }),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await masterConsignerRepository.getMasterConsignerById(
				properties.dataId,
			)
			currentData.value = data
			form.setValues({ name: data.name })
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
		tooltip="Editar consignante master"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar Consignante Master`"
		class="sm:max-w-[458px]"
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
			<master-consigner-form :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>
