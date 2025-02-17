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

	const emits =  defineEmits(['on-close'])
	const props = defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})
	const selectedRegulatoryType = ref<string | undefined>(undefined)

	const { data: regulatoryTypesData, isLoading: isRegulatoryTypeLoading } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('regulatory-types'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllRegulators({
				signal,
				params: { perPage: '27' },
			}),
	})

	const formattedAllRegulatoryTypes = computed(() => {
		return (regulatoryTypesData.value ?? []).map(({ id, name }) => ({
			id: `${id}`,
			name,
		}))
	})

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'long',
	})

	function onClose() {
		emits('on-close')
	}
</script>

<template>
	<div class="flex flex-col">
		<div class="border border-primary rounded-md p-5 pb-1">
			<div class="grid grid-cols-24 gap-x-4">
				<form-field v-slot="{ componentField }" name="typeId">
					<form-item
						class="grid grid-cols-1 items-center col-span-9 gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-1">Tipo Normativo</form-label>
						<form-control>
							<select-root
								@update:model-value="
									(value) => {
										selectedRegulatoryType = value
									}
								"
								:disabled="disabled || isRegulatoryTypeLoading"
								v-bind="componentField"
							>
								<select-trigger class="col-span-1">
									<select-value placeholder="Tipo do Normativo" />
								</select-trigger>
								<select-content>
									<select-group>
										<select-label>Tipos dos Normativo:</select-label>
										<select-item
											v-for="regulatorytype of formattedAllRegulatoryTypes"
											:key="regulatorytype.id"
											:value="regulatorytype.id.toString()"
											>{{ regulatorytype.name }}</select-item
										>
									</select-group>
								</select-content>
							</select-root>
						</form-control>

						<form-message class="col-span-1" />
					</form-item>
				</form-field>

				<form-field v-slot="{ componentField }" name="number">
					<form-item
						class="grid grid-cols-1 items-center col-span-5 gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-1">Número</form-label>
						<form-control>
							<input-root
								:disabled="disabled"
								type="text"
								placeholder="Número..."
								class="col-span-1"
								v-bind="componentField"
							/>
						</form-control>

						<form-message class="col-span-1" />
					</form-item>
				</form-field>

				<form-field v-slot="{ componentField, value }" name="publicationAt">
					<form-item
						class="grid grid-cols-1 items-center col-span-10 gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-1">
							Data da publicação
						</form-label>

						<form-control>
							<popover>
								<popover-trigger as-child>
									<button-root
										:disabled="disabled"
										variant="outline"
										:class="
											cn(
												'col-span-1 flex justify-start text-left font-normal items-center',
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

						<form-message class="col-span-1" />
					</form-item>
				</form-field>
			</div>

			<form-field v-slot="{ componentField }" name="target">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Objeto</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o objeto..."
							class="col-span-18"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="subject">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Assunto</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o assunto..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<div class="grid grid-cols-8">
				<upload-file-root
					:disabled="disabled"
					type="file"
					placeholder="Digite o averbador file..."
					class="col-span-3"
				/>

				<download-file-root
					url="https://eppg.fgv.br/sites/default/files/teste.pdf"
					suggestedName="teste.pdf"
					class="col-span-3 col-start-6"
				/>
			</div>
		</div>

		<div class="border border-primary rounded-md p-5 mt-5">
			<p class="text-left col-span-3 text-base text-primary font-bold mb-4">
				Consignante master
			</p>

			<form-field v-slot="{ componentField, value }" name="revocationAt">
				<form-item
					class="grid grid-cols-12 items-center col-span-3 gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12"> Data Final</form-label>

					<form-control>
						<popover>
							<popover-trigger as-child>
								<button-root
									:disabled="disabled"
									variant="outline"
									:class="
										cn(
											'col-span-5 flex justify-start text-left font-normal items-center',
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

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="observation">
				<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
					<form-label class="text-left col-span-12">Observação</form-label>
					<form-control>
						<textarea-root
							:disabled="disabled"
							type="text"
							placeholder="Digite a observação..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<div class="flex gap-12 justify-center -mt-4">
				<button-root
					:disabled="disabled"
					type="button"
					variant="outline"
					class="mt-4 gap-2 border border-primary text-primary font-semibold text-xs"
					@click="onClose"
				>
					Cancelar
				</button-root>

				<button-root
					:disabled="disabled"
					type="submit"
					class="mt-4 bg-primary text-white gap-2 font-semibold text-xs"
				>
					Salvar
				</button-root>
			</div>
		</div>
	</div>
</template>

<!-- <font-awesome-icon :icon="['fas', 'chevron-right']" /> -->
