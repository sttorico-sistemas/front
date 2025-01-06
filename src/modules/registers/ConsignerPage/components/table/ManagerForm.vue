<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import { computed } from 'vue'
	import { useQuery } from '@tanstack/vue-query'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { InputRoot } from '@/core/components/fields/input'
	import { UploadFileRoot } from '@/core/components/fields/upload-file'
	import { DownloadFileRoot } from '@/core/components/fields/download-file'
	import { Separator } from '@/core/components/separator'
	import { ButtonRoot } from '@/core/components/button'
	import { TextareaRoot } from '@/core/components/fields/textarea'
	import { Calendar } from '@/core/components/calendar'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '@/core/components/popover'
	import {
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
		SelectRoot,
	} from '@/core/components/fields/select'
	import { auxiliaryRepository } from '@/core/stores'
	import { cn } from '@/core/utils'
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

	const props = defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})
	const selectedManager = ref<string | undefined>(undefined)

	const { data: managersData, isLoading: isManagerLoading } = useQuery({
		enabled: false,
		queryKey: auxiliaryRepository.getQueryKey('managers'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllStates({
				signal,
				params: { perPage: '27' },
			}),
	})

	const formattedAllManagers = computed(() => {
		return (managersData.value ?? []).map(({ id, uf }) => ({
			id: `${id}`,
			name: uf,
		}))
	})

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'long',
	})
</script>

<template>
	<div class="flex flex-col">
		<form-field v-slot="{ componentField }" name="cpf">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">CPF</form-label>
				<form-control>
					<input-root
						v-maska="'###.###.###-##'"
						:disabled="disabled"
						type="text"
						placeholder="Digite o CPF..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-2" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="name">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Nome</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-2" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="position">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Função</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o função..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="department">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Departamento</form-label>
				<form-control>
					<textarea-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o departamento..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-10 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="phone">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Telefone</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						v-maska="'(##) ####-####'"
						placeholder="Digite o telefone..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="cellphone">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Celular</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						v-maska="'(##) # ####-####'"
						placeholder="Digite o celular..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="formEmail">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">E-mail</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o e-mail..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5" />
			</form-item>
		</form-field>
	</div>
</template>

<!-- <font-awesome-icon :icon="['fas', 'chevron-right']" /> -->
