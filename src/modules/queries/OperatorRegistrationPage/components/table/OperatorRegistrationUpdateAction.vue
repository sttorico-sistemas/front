<script lang="ts" setup>
	import { ref } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { operatorRepository } from '@/core/stores/operator.store'
	import { formatCPF } from '@/core/utils'
	import { OperatorModel, PermissionList, PermissionModel } from '@/core/models'
	import OperatorRegistrationForm from './OperatorRegistrationForm.vue'
	import { personRepository } from '@/core/stores'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableOperatorName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-edit'])

	const loadCities = ref<Record<string, string>>({})
	const selectPermissions = ref<PermissionModel[]>([])
	const selectData = ref<OperatorModel | undefined>(undefined)
	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)

	const formSchema = toTypedSchema(
		z.object({
			userId: z
				.string({ message: 'O usuário é obrigatório.' })
				.min(1, { message: 'O usuário é obrigatório.' }),
			name: z
				.string({ message: 'O nome é obrigatório.' })
				.min(1, { message: 'O nome é obrigatório.' }),
			cpf: z
				.string({ message: 'O CPF é obrigatório.' })
				.min(1, { message: 'O CPF é obrigatório.' }),
			typeId: z
				.string({ message: 'O tipo é obrigatório.' })
				.min(1, { message: 'O tipo é obrigatório.' }),
			permissions: z
				.array(
					z.object(
						{
							id: z.string({ message: 'Esse campo é obrigatório.' }),
							title: z.string({ message: 'Esse campo é obrigatório.' }),
						},
						{ message: 'Esse campo é obrigatório.' },
					),
					{ message: 'Deve haver pelo menos 1 permissão.' },
				)
				.min(1, { message: 'Deve haver pelo menos 1 permissão.' }),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
		initialValues: {
			permissions: [],
		},
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await operatorRepository.getOperatorById(properties.dataId)
			selectData.value = data
			form.setValues({
				userId: `${data.userId}`,
				name: data.name,
				cpf: formatCPF(data.cpf),
				typeId: `${data.typeId}`,
				permissions: data.permissionsRaw,
			})
			selectPermissions.value = (data.permissionsRaw ?? []).map(
				({ id, title }) =>
					new PermissionModel({
						id: +id,
						relatedName: title,
						action: '',
						permissibleId: '1',
						permissibleType: '',
					}),
			)
		} catch (error) {
			console.log(error)
		} finally {
			isDataLoading.value = false
		}
	}

	async function handlePermissions(value: PermissionModel[]) {
		selectPermissions.value = value
		form.setValues({
			permissions: value.map(({ id, relatedName }) => ({
				id: `${id}`,
				title: relatedName,
			})),
		})
	}

	const onSubmit = form.handleSubmit(async (values) => {
		const generatePermissions = values.permissions.map(
			({ id, title }) =>
				new PermissionModel({
					id: +id,
					relatedName: title,
					action: '',
					permissibleId: '1',
					permissibleType: '',
				}),
		)
		const permissionsList = new PermissionList(
			selectPermissions.value as PermissionModel[],
		)
		permissionsList.update(generatePermissions)
		emits(
			'on-edit',
			properties.dataId,
			{
				...values,
				addPermissions: permissionsList.getItems().map(({ id }) => Number(id)),
				deletedPermissions: permissionsList
					.getRemovedItems()
					.map(({ id }) => Number(id)),
			},
			() => {
				openUpdateModal.value = false
			},
		)
	})
</script>

<template>
	<form-wrapper
		tooltip="Editar operador"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar Operador`"
		class="sm:max-w-[1100px]"
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
			<operator-registration-form
				edited
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
				@update-permissions="handlePermissions"
				@on-close="openUpdateModal=false"
			/>
		</template>
	</form-wrapper>
</template>
