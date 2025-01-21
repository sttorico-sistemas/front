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
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from '@/core/components/command'
	import { auxiliaryRepository, consignerRepository } from '@/core/stores'
	import { cn } from '@/core/utils'
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

	const props = defineProps({
		disabled: { type: Boolean, default: () => false },
		loadConsigner: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})
	const search = ref<string | undefined>(undefined)
	const openCityBox = ref(false)
	const formattedAllConsignersMap = ref<Record<string, string>>({})

	// TODO: Verificar se precisa de uma pesquisa de nomes
	const { data: consigners, isLoading: isConsignersLoading } = useQuery({
		queryKey: consignerRepository.getQueryKey('consigners', {}, search),
		queryFn: ({ signal }) =>
			consignerRepository.getAllConsigners({
				signal,
				params: { search: search.value, perPage: 20 },
			}),
	})

	const formattedAllConsignersTempMap = computed(() => {
		return Object.fromEntries(
			(consigners.value ?? []).map(({ id, name }) => [id, name]),
		)
	})

	const formattedAllConsigners = computed(() => {
		return (
			consigners.value ??
			Object.entries(props.loadConsigner).map(([id, name]) => ({ id, name })) ??
			[]
		).map(({ id, name }) => ({
			id: `${id}`,
			name,
		}))
	})
</script>

<template>
	<div class="flex flex-col">
		<form-field v-slot="{ componentField, handleChange }" name="cityId">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Consignante</form-label>
				<form-control>
					<popover v-model:open="openCityBox">
						<popover-trigger as-child>
							<button-root
								variant="outline"
								role="combobox"
								:aria-expanded="openCityBox"
								class="lg:max-w-96 flex-[3] justify-between col-span-6"
								:disabled="
									(disabled ||
										isConsignersLoading ||
										formattedAllConsigners.length <= 0) &&
									!componentField.modelValue
								"
							>
								{{
									formattedAllConsignersTempMap[componentField.modelValue] ??
									loadConsigner[componentField.modelValue] ??
									'Selecione o consignante...'
								}}
								<font-awesome-icon
									v-if="openCityBox"
									:icon="['fas', 'chevron-up']"
								/>
								<font-awesome-icon v-else :icon="['fas', 'chevron-down']" />
							</button-root>
						</popover-trigger>
						<popover-content class="lg:max-w-96 flex-[3]A p-0">
							<command>
								<command-input
									class="h-9"
									placeholder="Busque um consignante..."
								/>
								<command-empty>Nenhum consignante encontrado.</command-empty>
								<command-list>
									<command-group>
										<command-item
											v-for="searchConsigners in formattedAllConsigners"
											:key="searchConsigners.id"
											:value="searchConsigners.name"
											@select="
												(ev) => {
													if (typeof ev.detail.value === 'string') {
														handleChange(searchConsigners.id)
													}
													openCityBox = false
												}
											"
										>
											{{ searchConsigners.name }}
											<font-awesome-icon
												:class="
													cn(
														'ml-auto h-4 w-4',
														componentField.modelValue === searchConsigners.id
															? 'opacity-100'
															: 'opacity-0',
													)
												"
												:icon="['fas', 'check']"
											/>
										</command-item>
									</command-group>
								</command-list>
							</command>
						</popover-content>
					</popover>
				</form-control>

				<form-message class="col-span-4" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="title">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Título</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o título..."
						class="col-span-6"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="annotation">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Nota</form-label>
				<form-control>
					<textarea-root
						:disabled="disabled"
						type="text"
						placeholder="Digite a nota..."
						class="col-span-10"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>
	</div>
</template>

<!-- <font-awesome-icon :icon="['fas', 'chevron-right']" /> -->
