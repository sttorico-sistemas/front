<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import { computed } from 'vue'
	import { useQuery } from '@tanstack/vue-query'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { InputRoot } from '@/core/components/fields/input'
	import { ButtonRoot } from '@/core/components/button'
	import { TextareaRoot } from '@/core/components/fields/textarea'
	import {
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
		SelectRoot,
	} from '@/core/components/fields/select'
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from '@/core/components/command'
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

	const props = defineProps({
		disabled: { type: Boolean, default: () => false },
		loadCities: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})

	const openCityBox = ref(false)
	const selectedState = ref<string | undefined>(undefined)

	const { data: statesData, isLoading: isStateLoading } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('states'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllStates({
				signal,
				params: { perPage: '27' },
			}),
	})

	const isActive = computed(() => {
		return !!selectedState.value
	})

	const { data: citiesData, isLoading: isCityLoading } = useQuery({
		enabled: isActive,
		queryKey: auxiliaryRepository.getQueryKey('cities', {}, selectedState),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllCities({
				signal,
				params: { estado_id: selectedState.value, perPage: '853' },
			}),
	})

	const formattedAllStates = computed(() => {
		return (statesData.value ?? []).map(({ id, uf }) => ({
			id: `${id}`,
			name: uf,
		}))
	})

	const formattedAllCities = computed(() => {
		return (citiesData.value ?? []).map(({ id, name }) => ({
			id: `${id}`,
			name,
		}))
	})

	const formattedAllCitiesTempMap = computed(() => {
		return Object.fromEntries(
			(citiesData.value ?? []).map(({ id, name }) => [id, name]),
		)
	})
</script>

<template>
	<div class="flex flex-col">
		<form-field v-slot="{ componentField }" name="name">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Nome</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome..."
						class="col-span-8"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="sector">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Setor</form-label>
				<form-control>
					<textarea-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o setor..."
						class="col-span-10"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<div class="grid grid-cols-12 gap-x-4">
			<form-field v-slot="{ componentField, handleChange }" name="city">
				<form-item
					class="grid grid-cols-4 col-span-6 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-4">Cidade</form-label>
					<form-control>
						<popover v-model:open="openCityBox">
							<popover-trigger as-child>
								<button-root
									variant="outline"
									role="combobox"
									:aria-expanded="openCityBox"
									class="lg:max-w-96 flex-[3] justify-between col-span-4"
									:disabled="
										disabled || isCityLoading || formattedAllCities.length <= 0
									"
								>
									{{
										formattedAllCitiesTempMap[componentField.modelValue] ??
										'Selecione a cidade...'
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
										placeholder="Busque uma cidade..."
									/>
									<command-empty>Nenhuma cidades encontrada.</command-empty>
									<command-list>
										<command-group>
											<command-item
												v-for="searchCities in formattedAllCities"
												:key="searchCities.id"
												:value="searchCities.id"
												@select="
													(ev) => {
														if (typeof ev.detail.value === 'string') {
															handleChange(ev.detail.value)
														}
														openCityBox = false
													}
												"
											>
												{{ searchCities.name }}
												<font-awesome-icon
													:class="
														cn(
															'ml-auto h-4 w-4',
															componentField.modelValue === searchCities.id
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

			<form-field v-slot="{ componentField }" name="state">
				<form-item
					class="grid grid-cols-4 col-span-6 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-4">Estado</form-label>
					<form-control>
						<select-root
							@update:model-value="
								(value) => {
									selectedState = value
								}
							"
							:disabled="disabled || isStateLoading"
							v-bind="componentField"
						>
							<select-trigger class="col-span-4">
								<select-value placeholder="UF..." />
							</select-trigger>
							<select-content>
								<select-group>
									<select-label>Estados:</select-label>
									<select-item
										v-for="state of formattedAllStates"
										:key="state.id"
										:value="state.id.toString()"
										>{{ state.name }}</select-item
									>
								</select-group>
							</select-content>
						</select-root>
					</form-control>

					<form-message class="col-span-4" />
				</form-item>
			</form-field>
		</div>
	</div>
</template>
