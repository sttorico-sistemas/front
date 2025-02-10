<script lang="ts" setup>
	import { ref } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { personRepository } from '@/core/stores'
	import {
		AddressList,
		AddressModel,
		ContactList,
		ContactModel,
		PersonModel,
	} from '@/core/models'
	import PersonForm from './PersonForm.vue'
	import { formatCEP, formatCPF, formatPhone } from '@/core/utils'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tablePersonName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-edit'])

	const loadCities = ref<Record<string, string>>({})
	const selectData = ref<PersonModel | undefined>(undefined)
	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)

	const formSchema = toTypedSchema(
		z.object({
			name: z
				.string({ message: 'O nome é obrigatório.' })
				.min(1, { message: 'O nome é obrigatório.' }),
			birthday: z
				.string({ message: 'O aniversário é obrigatório.' })
				.min(1, { message: 'O aniversário é obrigatório.' }),
			cpf: z
				.string({ message: 'O CPF é obrigatório.' })
				.min(1, { message: 'O CPF é obrigatório.' }),
			addresses: z
				.array(
					z.object({
						id: z.string({ message: 'O id é obrigatório.' }).optional(),
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
						addressTypeId: z
							.string({ message: 'O tipo é obrigatório.' })
							.min(1, { message: 'O tipo é obrigatório.' }),
					}),
					{ message: 'Deve haver pelo menos 1 endereço.' },
				)
				.min(1, 'Deve haver pelo menos 1 endereço.'),
			contacts: z
				.array(
					z.object({
						id: z.string({ message: 'O id é obrigatório.' }).optional(),
						phoneTypeId: z
							.string({ message: 'O tipo é obrigatório.' })
							.min(1, { message: 'O tipo é obrigatório.' }),
						phone: z
							.string({ message: 'O telefone é obrigatório.' })
							.min(1, { message: 'O telefone é obrigatório.' }),
						email: z
							.string({ message: 'O e-mail é obrigatório.' })
							.min(1, { message: 'O e-mail é obrigatório.' }),
						cellphone: z
							.string({ message: 'O celular é obrigatório.' })
							.min(1, { message: 'O celular é obrigatório.' }),
					}),
					{ message: 'Deve haver pelo menos 1 contato.' },
				)
				.min(1, 'Deve haver pelo menos 1 contato.'),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
		initialValues: {
			contacts: [],
			addresses: [],
		},
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await personRepository.getPersonById(properties.dataId)
			selectData.value = data
			form.setValues({
				name: data.name,
				birthday: Intl.DateTimeFormat('pt-BR', {
					dateStyle: 'short',
				}).format(new Date(data.birthday)),
				cpf: formatCPF(data.cpf),
				addresses: data.addresses.map(
					({
						id,
						addressTypeId,
						cityId,
						cityName,
						stateId,
						street,
						zipCode,
					}) => {
						loadCities.value[`${cityId}`] = cityName as string
						return {
							id: id ? `${id}` : undefined,
							addressTypeId: `${addressTypeId}`,
							cityId: `${cityId}`,
							stateId: `${stateId}`,
							street,
							zipCode: formatCEP(zipCode),
						}
					},
				),
				contacts: data.contacts.map(
					({ id, cellphone, phone, email, phoneTypeId }) => ({
						id: id ? `${id}` : undefined,
						cellphone: formatPhone(cellphone),
						phone: formatPhone(phone),
						email,
						phoneTypeId: `${phoneTypeId}`,
					}),
				),
			})
		} catch (error) {
			console.log(error)
		} finally {
			isDataLoading.value = false
		}
	}

	const onSubmit = form.handleSubmit(async (values) => {
		const addressList = new AddressList(selectData.value?.addresses)
		addressList.update(values.addresses.map((data) => new AddressModel(data)))
		const contactList = new ContactList(selectData.value?.contacts)
		contactList.update(values.contacts.map((data) => new ContactModel(data)))

		emits(
			'on-edit',
			properties.dataId,
			{
				...values,
				contacts: contactList.getItems(),
				deletedContacts: contactList.getRemovedItems().map((data) => data.id),
				addresses: addressList.getItems(),
				deletedAddresses: addressList.getRemovedItems().map((data) => data.id),
			},
			() => {
				openUpdateModal.value = false
			},
		)
	})
</script>

<template>
	<form-wrapper
		tooltip="Editar pessoa"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar pessoa ${tablePersonName}`"
		description="Atualize o conteúdo da pessoa."
		class="sm:max-w-[1100px]"
		@form-submit="onSubmit"
	>
		<template #trigger>
			<button-root :disabled="!isActive" variant="outline" @click="setNewData">
				<font-awesome-icon
					class="text-primary w-4 h-4"
					:icon="['fas', 'pen']"
				/>
			</button-root>
		</template>

		<template #fields>
			<person-form
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
			/>
		</template>
	</form-wrapper>
</template>
