<script lang="ts" setup>
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import { ref } from 'vue'
	import * as z from 'zod'
	import TableCityForm from './TableRegisterPersonForm.vue'
	import { personRepository } from '@/core/stores/person.store'
	import { formatCPF, formatCEP, formatPhone } from '@/core/utils'
	import {
		AddressList,
		AddressModel,
		ContactList,
		ContactModel,
		PersonModel,
	} from '@/core/models'

	const properties = defineProps({
		dataId: {
			type: Number,
			required: true,
		},
		tablePersonName: {
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
	const selectData = ref<PersonModel | undefined>(undefined)
	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)

	const formSchema = toTypedSchema(
		z.object({
			name: z.string({ message: 'Esse campo é obrigatório.' }),
			birthday: z.string({ message: 'Esse campo é obrigatório.' }),
			cpf: z.string({ message: 'Esse campo é obrigatório.' }),
			addresses: z
				.array(
					z.object({
						id: z.string().optional(),
						cityId: z.string({ message: 'Esse campo é obrigatório.' }),
						stateId: z.string({ message: 'Esse campo é obrigatório.' }),
						street: z.string({ message: 'Esse campo é obrigatório.' }),
						zipCode: z.string({ message: 'Esse campo é obrigatório.' }),
						addressTypeId: z.string({ message: 'Esse campo é obrigatório.' }),
					}),
					{ message: 'Deve haver pelo menos 1 endereço.' },
				)
				.min(1, 'Deve haver pelo menos 1 endereço.'),
			contacts: z
				.array(
					z.object({
						id: z.string().optional(),
						phoneTypeId: z.string({ message: 'Esse campo é obrigatório.' }),
						phone: z.string({ message: 'Esse campo é obrigatório.' }),
						email: z.string({ message: 'Esse campo é obrigatório.' }),
						cellphone: z.string({ message: 'Esse campo é obrigatório.' }),
					}),
					{ message: 'Deve haver pelo menos 1 contato.' },
				)
				.min(1, 'Deve haver pelo menos 1 contato.'),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await personRepository.getPersonById(properties.dataId)
			selectData.value = data
			console.log(data)
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
						console
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
		console.log(values)
		const addressList = new AddressList(selectData.value?.addresses)
		addressList.update(values.addresses.map((data) => new AddressModel(data)))
		const contactList = new ContactList(selectData.value?.contacts)
		contactList.update(values.contacts.map((data) => new ContactModel(data)))

		console.log({
			addressList,
			contactList,
		})

		emits('on-edit', properties.dataId, {
			...values,
			contacts: contactList.getItems(),
			deletedContacts: contactList.getRemovedItems().map((data) => data.id),
			addresses: addressList.getItems(),
			deletedAddresses: addressList.getRemovedItems().map((data) => data.id),
		})
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
			<button-root variant="outline" @click="setNewData">
				<font-awesome-icon
					class="text-primary w-4 h-4"
					:icon="['fas', 'pen']"
				/>
			</button-root>
		</template>

		<template #fields>
			<TableCityForm
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
			/>
		</template>
	</form-wrapper>
</template>
