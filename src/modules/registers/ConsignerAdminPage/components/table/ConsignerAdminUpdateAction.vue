<script lang="ts" setup>
	import { ref, watch } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { consignerAdminRepository, consignerRepository } from '@/core/stores'
	import Admin from './ConsignerAdminForm.vue'
	import { ConsignerModel } from '@/core/models'
	import { ConsignerAdminForm } from '@/modules/registers/ConsignerAdminPage/components/table'
	import { formatIcon } from '@/core/utils'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableConsignerAdminName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-edit'])

	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)
	const loadCities = ref<Record<string, string>>({})

	const formSchema = toTypedSchema(
		z.object({
			cnpj: z
				.string({ message: 'O CNPJ é obrigatório.' })
				.min(1, { message: 'O CNPJ é obrigatório.' }),
			entityTypeId: z
				.string({ message: 'A entidade é obrigatória' })
				.min(1, { message: 'A entidade é obrigatória.' }),
			name: z
				.string({ message: 'O nome é obrigatório' })
				.min(1, { message: 'O nome é obrigatório.' }),
			shortName: z
				.string({ message: 'O nome é obrigatório' })
				.min(1, { message: 'O nome é obrigatório.' }),
			addressId: z
				.number({ message: 'O id endereço é obrigatório.' })
				.min(1, { message: 'O id endereço é obrigatório.' }),
			cityId: z
				.string({ message: 'A cidade é obrigatória.' })
				.min(1, { message: 'A cidade é obrigatória.' }),
			stateId: z
				.string({ message: 'O estado é obrigatório.' })
				.min(1, { message: 'O estado é obrigatório.' }),
			street: z
				.string({ message: 'O logradouro é obrigatório.' })
				.min(1, { message: 'O logradouro é obrigatório.' }),
			zipCode: z
				.string({ message: 'O CEP é obrigatório.' })
				.min(1, { message: 'O CEP é obrigatório.' }),
			services: z
				.array(z.string())
				.refine((value) => value.some((item) => item), {
					message: 'Selecione pelo menos 1 serviço.',
				}),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
		initialValues: {
			services: [],
		},
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await consignerAdminRepository.getConsignerAdminById(
				properties.dataId,
			)
			// loadCities.value[`${data.addresses.cityId.toString()}`] = data.addresses
			// 	.cityName as string
			// console.log(data)
			form.setValues({
				name: data.name,
				cnpj: data.cnpj.replace(
					/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
					'$1.$2.$3/$4-$5',
				),
				shortName: data.shortName,
				entityTypeId: data.entityTypeId.toString(),
				addressId: data.address?.id,
				stateId: data.address?.stateId.toString(),
				cityId: data.address?.cityId.toString(),
				street: data.address?.street,
				zipCode: data.address?.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2'),
				services: data.services.map((data) => data.id?.toString() as string),
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
		tooltip="Editar Consignatária"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar Consignatária`"
		class="sm:max-w-[834px]"
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
			<consigner-admin-form
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
			/>
		</template>
	</form-wrapper>
</template>
