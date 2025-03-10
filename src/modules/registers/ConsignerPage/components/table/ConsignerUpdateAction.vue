<script lang="ts" setup>
	import { ref, watch } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { consignerRepository } from '@/core/stores'
	import ConsignerForm from './ConsignerForm.vue'
	import { ConsignerModel } from '@/core/models'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableConsignerName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-edit'])

	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)
	const loadCities = ref<Record<string, string>>({})

	const formSchema = toTypedSchema(
		z
			.object({
				name: z
					.string({ message: 'O nome é obrigatório' })
					.min(1, { message: 'O nome é obrigatório.' }),
				shortName: z
					.string({ message: 'O nome é obrigatório' })
					.min(1, { message: 'O nome é obrigatório.' }),
				startOfBusiness: z
					.string({ message: 'O inicio é obrigatório' })
					.optional()
					.nullable(),
				endOfBusiness: z
					.string({ message: 'O fim é obrigatório' })
					.optional()
					.nullable(),
				cnpj: z
					.string({ message: 'O CNPJ é obrigatório.' })
					.min(1, { message: 'O CNPJ é obrigatório.' }),
				masterConsignerId: z
					.string({ message: 'O consignante master é obrigatório' })
					.min(1, { message: 'O consignante master é obrigatório.' }),
				entityTypeId: z
					.string({ message: 'A entidade é obrigatória' })
					.min(1, { message: 'A entidade é obrigatória.' }),
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
			})
			.refine(
				({ startOfBusiness, endOfBusiness }) => {
					if (
						startOfBusiness === null ||
						startOfBusiness === undefined ||
						endOfBusiness === null ||
						endOfBusiness === undefined
					) {
						return
					}

					const [h1, m1] = startOfBusiness.split(':').map(Number)
					const [h2, m2] = endOfBusiness.split(':').map(Number)

					const start = new Date()
					start.setHours(h1, m1, 0, 0)

					const end = new Date()
					end.setHours(h2, m2, 0, 0)

					return end > start
				},
				{
					path: ['endOfBusiness', 'startOfBusiness'],
					message: 'Expediente inválido.',
				},
			),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await consignerRepository.getConsignerById(properties.dataId)
			loadCities.value[`${data.addresses.cityId.toString()}`] = data.addresses
				.cityName as string
			console.log(data)
			form.setValues({
				name: data.name,
				cnpj: data.cnpj.replace(
					/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
					'$1.$2.$3/$4-$5',
				),
				shortName: data.shortName,
				startOfBusiness: data.startOfBusiness,
				endOfBusiness: data.endOfBusiness,
				entityTypeId: data.entityTypeId.toString(),
				masterConsignerId: data.masterConsignerId.toString(),
				addressId: data.addresses.id,

				stateId: data.addresses.stateId.toString(),
				cityId: data.addresses.cityId.toString(),
				street: data.addresses.street,
				zipCode: data.addresses.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2'),
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
		tooltip="Editar consignante"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar Consignante`"
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
			<consigner-form
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
				@on-close="
					() => {
						openUpdateModal = false
					}
				"
			/>
		</template>
	</form-wrapper>
</template>
