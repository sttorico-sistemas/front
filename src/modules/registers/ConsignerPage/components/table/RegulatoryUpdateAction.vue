<script lang="ts" setup>
	import { ref, watch } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import * as z from 'zod'

	import { FormWrapper } from '@/core/components/form-wrapper'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { regulatoryRepository } from '@/core/stores'
	import RegulatoryForm from './RegulatoryForm.vue'
	import { RegulatoryModel } from '@/core/models'
	import { validateCalendar } from '@/core/utils'
	import { DateValue, parseDate } from '@internationalized/date'

	const properties = defineProps({
		dataId: { type: Number, required: true },
		tableRegulatoryName: { type: String, required: true },
		isLoading: { type: Boolean, default: () => false },
		isActive: { type: Boolean, required: true },
	})
	const emits = defineEmits(['on-edit'])

	const openUpdateModal = ref(false)
	const isDataLoading = ref(false)
	const loadCities = ref<Record<string, string>>({})

	const formSchema = toTypedSchema(
		z.object({
			number: z
				.string({ message: 'O numero é obrigatório' })
				.min(1, { message: 'O numero é obrigatório.' }),
			typeId: z
				.string({ message: 'O tipo é obrigatório' })
				.min(1, { message: 'O tipo é obrigatório.' }),
			publicationAt: z.custom<DateValue>(validateCalendar, {
				message: 'Esse campo é obrigatório.',
			}),
			target: z
				.string({ message: 'O objeto é obrigatório' })
				.min(1, { message: 'O objeto é obrigatório.' }),
			subject: z
				.string({ message: 'O assunto é obrigatório' })
				.min(1, { message: 'O assunto é obrigatório.' }),
			revocationAt: z
				.custom<DateValue>(validateCalendar, {
					message: 'Esse campo é obrigatório.',
				})
				.optional(),
			observation: z.string({ message: 'O assunto é obrigatório' }).optional(),
		}),
	)

	const form = useForm({
		validationSchema: formSchema,
	})

	async function setNewData() {
		if (!properties.dataId) return
		isDataLoading.value = true
		try {
			const data = await regulatoryRepository.getRegulatoryById(
				properties.dataId,
			)

			form.setValues({
				number: data.number,
				target: data.target,
				subject: data.subject,
				publicationAt: parseDate(data.publicationAt),
				typeId: data.typeId.toString(),
				revocationAt: data.revocationAt
					? parseDate(data.revocationAt)
					: undefined,
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
		tooltip="Editar averbador"
		v-model="openUpdateModal"
		:is-loading="isLoading || isDataLoading"
		:title="`Editar averbador ${tableRegulatoryName}`"
		description="Atualize o conteúdo do averbador."
		class="sm:max-w-[650px]"
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
			<regulatory-form
				:metadata="form.values"
				:loadCities="loadCities"
				:disabled="isLoading"
			/>
		</template>
	</form-wrapper>
</template>
