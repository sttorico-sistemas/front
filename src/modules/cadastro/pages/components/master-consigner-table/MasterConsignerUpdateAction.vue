<script lang="ts" setup>
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import { ref } from 'vue'
	import * as z from 'zod'
	import MasterConsignerRegistrationForm from './MasterConsignerForm.vue'
	import { masterConsignerRepository } from '@/core/stores'
	import { MasterConsignerModel } from '@/core/models'

	const properties = defineProps({
		dataId: {
			type: Number,
			required: true,
		},
		tableMasterConsignerName: {
			type: String,
			required: true,
		},
		isLoading: {
			type: Boolean,
			default: () => false,
		},
	})
	const emits = defineEmits(['on-edit'])
	const loadCities = ref<Record<string, string>>({})
	const selectData = ref<MasterConsignerModel | undefined>(undefined)
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
			const data = await masterConsignerRepository.getMasterConsignerById(
				properties.dataId,
			)
			selectData.value = data
			console.log(data)
			form.setValues({ name: data.name })
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
		tooltip="Editar consignante master"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar consignante master ${tableMasterConsignerName}`"
		description="Atualize o conteúdo do consignante master."
		class="sm:max-w-[1100px]"
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
			<MasterConsignerRegistrationForm
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
			/>
		</template>
	</form-wrapper>
</template>
