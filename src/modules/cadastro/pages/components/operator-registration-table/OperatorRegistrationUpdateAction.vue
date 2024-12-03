<script lang="ts" setup>
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import { ref } from 'vue'
	import * as z from 'zod'
	import OperatorRegistrationForm from './OperatorRegistrationForm.vue'
	import { operatorRepository } from '@/core/stores/operator.store'
	import { formatCPF } from '@/core/utils'
	import { OperatorModel } from '@/core/models'

	const properties = defineProps({
		dataId: {
			type: Number,
			required: true,
		},
		tableOperatorName: {
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
	const selectData = ref<OperatorModel | undefined>(undefined)
	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)

	const formSchema = toTypedSchema(
		z.object({
			name: z.string({ message: 'Esse campo é obrigatório.' }),
			cpf: z.string({ message: 'Esse campo é obrigatório.' }),
			typeId: z.string({ message: 'Esse campo é obrigatório.' }),
			permissions: z
				.array(
					z.object(
						{
							id: z.string({ message: 'Esse campo é obrigatório.' }),
							title: z.string({ message: 'Esse campo é obrigatório.' }),
						},
						{ message: 'Esse campo é obrigatório.' },
					),
					{
						message: 'Deve haver pelo menos 1 endereço.',
					},
				)
				.min(1, 'Deve haver pelo menos 1 endereço.'),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await operatorRepository.getOperatorById(properties.dataId)
			selectData.value = data
			console.log(data)
			form.setValues({
				name: data.name,
				cpf: formatCPF(data.cpf),
				typeId: `${data.typeId}`,
				permissions: data.permissionsRaw,
			})
		} catch (error) {
			console.log(error)
		} finally {
			isDataLoading.value = false
		}
	}

	async function handlePermissions(value: { id: string; title: string }[]) {
		form.setValues({
			permissions: value,
		})
	}

	const onSubmit = form.handleSubmit(async (values) => {
		emits('on-edit', properties.dataId, values)
	})
</script>

<template>
	<form-wrapper
		tooltip="Editar cidade"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar cidade ${tableOperatorName}`"
		description="Atualize o conteúdo da pessoa."
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
			<OperatorRegistrationForm
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
				@update-permissions="handlePermissions"
			/>
		</template>
	</form-wrapper>
</template>
