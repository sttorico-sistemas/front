<script lang="ts" setup>
import { FormWrapper } from '@/core/components/form-wrapper'
import { ButtonRoot } from '@/core/components/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod'
import TableTypeForm from './TableTypeForm.vue';

const properties = defineProps({
	dataId: {
		type: Number,
		required: true,
	},
	tableTypeName: {
		type: String,
		required: true,
	},
	isLoading: {
		type: Boolean,
		default: () => false
	}
});
const emits = defineEmits(["on-edit"]);
const openUpdateModal = ref(false)
const isDataLoading = ref(false)

async function setNewData() {
	isDataLoading.value = false
	return
}

const formSchema = toTypedSchema(
	z
		.object({
			name: z.string({ message: 'Esse campo é obrigatório.' }),
		})
)

const form = useForm({
	validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
	emits('on-edit', properties.dataId, values)
})


</script>

<template>
	<form-wrapper tooltip="Editar tipo" model="openUpdateModal" :is-loading="isLoading" :title="`Editar tipo ${tableTypeName}`"
		description="Atualize o conteúdo da tipo." class="sm:max-w-[780px]" @form-submit="onSubmit">

		<template #trigger>
			<button-root variant="ghost" @click="setNewData">
				<font-awesome-icon class="text-primary_3-table w-4 h-4" :icon="['fas', 'pen']" />
			</button-root>
		</template>

		<template #fields>
			<TableTypeForm :metadata="form.values" :disabled="isLoading" />
		</template>
	</form-wrapper>
</template>