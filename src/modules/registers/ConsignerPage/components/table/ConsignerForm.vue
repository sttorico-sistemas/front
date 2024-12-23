<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import { computed } from 'vue'
	import { useQuery } from '@tanstack/vue-query'

	import { InputRoot } from '@/core/components/fields/input'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
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
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '@/core/components/popover'
	import { ButtonRoot } from '@/core/components/button'
	import { Separator } from '@/core/components/separator'
	import { auxiliaryRepository, masterConsignerRepository } from '@/core/stores'
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
	const formattedAllCitiesMap = ref<Record<string, string>>({})

	const { data: statesData, isLoading: isStateLoading } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('states'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllStates({
				signal,
				params: { perPage: '27' },
			}),
	})

	const isActive = computed(() => {
		selectedState.value = props.metadata.stateId
		return !!selectedState.value || Object.values(props.loadCities).length >= 0
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

	const { data: masterConsigners, isLoading: isMasterConsignersLoading } =
		useQuery({
			queryKey: masterConsignerRepository.getQueryKey('master-consigners'),
			queryFn: ({ signal }) =>
				masterConsignerRepository.getAllMasterConsigners({
					signal,
					params: { perPage: '100' },
				}),
		})

	const { data: entityTypes, isLoading: isEntityTypesLoading } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('entity-types'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllEntityTypes({
				signal,
				params: { perPage: '100' },
			}),
	})

	const formattedAllStates = computed(() => {
		return (statesData.value ?? []).map(({ id, uf }) => ({
			id: `${id}`,
			name: uf,
		}))
	})

	const formattedAllCities = computed(() => {
		return (
			citiesData.value ??
			Object.entries(props.loadCities).map(([id, name]) => ({ id, name })) ??
			[]
		).map(({ id, name }) => ({
			id: `${id}`,
			name,
		}))
	})

	const formattedAllMasterConsigners = computed(() => {
		return (masterConsigners.value ?? []).map(({ id, name }) => ({
			id: `${id}`,
			name,
		}))
	})

	const formattedAllEntityTypes = computed(() => {
		return (entityTypes.value ?? []).map(({ id, name }) => ({
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
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="shortName">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Nome curto</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome curto..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="cnpj">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">CNPJ</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						v-maska="'##.###.###/####-##'"
						placeholder="Digite o CNPJ..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="masterConsignerId">
			<form-item
				class="grid grid-cols-12 items-center justify-center gap-x-4 gap-y-1"
			>
				<form-label class="text-left col-span-2">Consignante master</form-label>
				<form-control>
					<select-root
						class="items-start justify-start"
						:disabled="disabled || isMasterConsignersLoading"
						v-bind="componentField"
					>
						<select-trigger class="col-span-5">
							<select-value placeholder="Selecione o consignante master..." />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Consignante masters:</select-label>
								<select-item
									v-for="masterConsigner of formattedAllMasterConsigners"
									:key="masterConsigner.id"
									:value="masterConsigner.id.toString()"
									>{{ masterConsigner.name }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="entityTypeId">
			<form-item
				class="grid grid-cols-12 items-center justify-center gap-x-4 gap-y-1"
			>
				<form-label class="text-left col-span-2">Tipo de entidade</form-label>
				<form-control>
					<select-root
						class="items-start justify-start"
						:disabled="disabled || isEntityTypesLoading"
						v-bind="componentField"
					>
						<select-trigger class="col-span-5">
							<select-value placeholder="Selecione o tipo..." />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Tipos de entidade:</select-label>
								<select-item
									v-for="entityType of formattedAllEntityTypes"
									:key="entityType.id"
									:value="entityType.id.toString()"
									>{{ entityType.name }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<Separator class="mt-4 mb-6" label="Expediente" />

		<div class="grid grid-cols-12 gap-x-4 items-center">
			<form-field v-slot="{ componentField }" name="startOfBusiness">
				<form-item
					class="grid grid-cols-12 col-span-3 items-center gap-x-4 gap-y-1"
				>
					<form-control>
						<input-root
							:disabled="disabled"
							type="time"
							placeholder="Início..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<div class="flex justify-center items-center ml-4 h-full">
				<h1 class="text-sm mb-8">Até</h1>
			</div>

			<form-field v-slot="{ componentField }" name="endOfBusiness">
				<form-item
					class="grid grid-cols-12 col-span-3 items-center gap-x-4 gap-y-1"
				>
					<form-control>
						<input-root
							:disabled="disabled"
							type="time"
							placeholder="Fim..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>
		</div>

		<Separator class="my-4" label="Endereço" />

		<div class="grid grid-cols-12 gap-x-4">
			<form-field v-slot="{ componentField }" name="stateId">
				<form-item
					class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-4">UF</form-label>
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

			<form-field v-slot="{ componentField, handleChange }" name="cityId">
				<form-item
					class="grid grid-cols-4 col-span-5 items-center gap-x-4 gap-y-1"
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
										(disabled ||
											isCityLoading ||
											formattedAllCities.length <= 0) &&
										!componentField.modelValue
									"
								>
									{{
										formattedAllCitiesTempMap[componentField.modelValue] ??
										loadCities[componentField.modelValue] ??
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

			<form-field v-slot="{ componentField }" name="zipCode">
				<form-item
					class="grid grid-cols-12 col-span-4 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12">CEP</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							v-maska="'#####-###'"
							placeholder="Digite o CEP..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="street">
				<form-item
					class="grid grid-cols-12 col-span-12 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12">Logradouro</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o logradouro..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12" />
				</form-item>
			</form-field>
		</div>
	</div>
</template>
