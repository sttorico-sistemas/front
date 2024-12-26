<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import { computed } from 'vue'
	import { useQuery } from '@tanstack/vue-query'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { InputRoot } from '@/core/components/fields/input'
	import { UploadFileRoot } from '@/core/components/fields/upload-file'
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
		<form-field v-slot="{ componentField }" name="number">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Número</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o número..."
						class="col-span-8"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="instruction">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Instrução</form-label>
				<form-control>
					<textarea-root
						:disabled="disabled"
						type="text"
						placeholder="Digite a instrução..."
						class="col-span-10"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<separator class="my-6" label="Período" />

		<div class="grid grid-cols-12 gap-x-4">
			<form-field v-slot="{ componentField, value }" name="publicationAt">
				<form-item
					class="grid grid-cols-12 items-center col-span-4 gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12">
						Data de publicação</form-label
					>

					<form-control>
						<popover>
							<popover-trigger as-child>
								<button-root
									:disabled="disabled"
									variant="outline"
									:class="
										cn(
											'col-span-12 justify-start text-left font-normal items-center',
											!value && 'text-muted-foreground',
										)
									"
								>
									<font-awesome-icon
										class="mr-2 h-4 w-4 flex"
										:icon="['far', 'calendar']"
									/>

									{{
										value
											? df.format(value.toDate(getLocalTimeZone()))
											: 'Selecione uma data'
									}}
								</button-root>
							</popover-trigger>
							<popover-Content class="w-auto p-0">
								<calendar
									v-model="componentField.modelValue"
									v-bind="componentField"
									initial-focus
									class="col-span-3"
								/>
							</popover-Content>
						</popover>
					</form-control>

					<form-message class="col-span-4 col-start-3" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField, value }" name="revocationAt">
				<form-item
					class="grid grid-cols-12 items-center col-span-4 gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12"
						>Data de revogação</form-label
					>

					<form-control>
						<popover>
							<popover-trigger as-child>
								<button-root
									:disabled="disabled"
									variant="outline"
									:class="
										cn(
											'col-span-12 justify-start text-left font-normal items-center',
											!value && 'text-muted-foreground',
										)
									"
								>
									<font-awesome-icon
										class="mr-2 h-4 w-4 flex"
										:icon="['far', 'calendar']"
									/>

									{{
										value
											? df.format(value.toDate(getLocalTimeZone()))
											: 'Selecione uma data'
									}}
								</button-root>
							</popover-trigger>
							<popover-Content class="w-auto p-0">
								<calendar
									v-model="componentField.modelValue"
									v-bind="componentField"
									initial-focus
									class="col-span-3"
								/>
							</popover-Content>
						</popover>
					</form-control>

					<form-message class="col-span-4 col-start-3" />
				</form-item>
			</form-field>
		</div>

		<separator class="mb-6" label="Anexo" />

		<div class="flex justify-between items-center">
			<upload-file-root
				:disabled="disabled"
				type="file"
				placeholder="Digite o averbador file..."
				class="col-span-2"
			/>
		</div>
	</div>
</template>
