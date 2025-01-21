<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import { computed } from 'vue'
	import { useQuery } from '@tanstack/vue-query'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { InputRoot } from '@/core/components/fields/input'
	import { Checkbox } from '@/core/components/fields/checkbox'
	import {
		FormControl,
		FormField,
		FormDescription,
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
	import {
		auxiliaryRepository,
		masterConsignerRepository,
		serviceRepository,
	} from '@/core/stores'
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

	const { data: servicesData, isLoading: isServiceLoading } = useQuery({
		queryKey: serviceRepository.getQueryKey('services'),
		queryFn: ({ signal }) =>
			serviceRepository.getAllServices({
				signal,
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

	const { data: addressTypes, isLoading: isAddressTypesLoading } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('address-types'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllAddressTypes({
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

	const formattedAllServices = computed(() => {
		return (servicesData.value ?? []).map(
			({ id, name, icon, theme, color }) => ({
				id: `${id}`,
				name,
				icon,
				theme,
				color,
			}),
		)
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

	const formattedAllAddressTypes = computed(() => {
		return (addressTypes.value ?? []).map(({ id, name }) => ({
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
		<div class="grid grid-cols-12 gap-x-4 items-center">
			<form-field v-slot="{ componentField }" name="cnpj">
				<form-item
					class="grid col-span-6 grid-cols-12 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12">CNPJ</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							v-maska="'##.###.###/####-##'"
							placeholder="Digite o CNPJ..."
							class="col-span-12"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-12 col-start-3" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField }" name="entityTypeId">
				<form-item
					class="grid grid-cols-12 col-span-6 items-center justify-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12"
						>Tipo de entidade</form-label
					>
					<form-control>
						<select-root
							class="items-start justify-start"
							:disabled="disabled || isEntityTypesLoading"
							v-bind="componentField"
						>
							<select-trigger class="col-span-12">
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

					<form-message class="col-span-12 col-start-3" />
				</form-item>
			</form-field>
		</div>

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

		<Separator class="my-4" label="Endereço" />

		<form-field v-slot="{ componentField }" name="masterConsignerId">
			<form-item
				class="grid grid-cols-12 items-center justify-center gap-x-4 gap-y-1"
			>
				<form-label class="text-left col-span-12">Tipo de endereço</form-label>
				<form-control>
					<select-root
						class="items-start justify-start"
						:disabled="disabled || isAddressTypesLoading"
						v-bind="componentField"
					>
						<select-trigger class="col-span-6">
							<select-value placeholder="Selecione o tipo de endereço..." />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Tipo de endereços:</select-label>
								<select-item
									v-for="masterConsigner of formattedAllAddressTypes"
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
		</div>

		<Separator class="my-4" label="Serviços" />

		<form-field name="items">
			<form-item>
				<div class="mb-4 col-span-12">
					<form-description> Selecione os Tipos de Serviços: </form-description>
				</div>

				<form-field
					v-for="item in formattedAllServices"
					v-slot="{ value, handleChange }"
					:key="item.id"
					type="checkbox"
					:value="item.id"
					:unchecked-value="false"
					name="services"
				>
					<form-item class="flex flex-row space-x-3 space-y-0 items-center">
						<form-control>
							<checkbox
								:checked="value.includes(item.id)"
								@update:checked="handleChange"
							/>
						</form-control>

						<div class="flex gap-2 items-center">
							<div
								:style="{ backgroundColor: item.color }"
								class="w-7 h-7 rounded-full flex justify-center items-center"
							>
								<font-awesome-icon
									:style="{
										color: item.theme === 'dark' ? '#FFFFFF' : '#000000',
									}"
									class="w-4 h-4"
									:icon="[item.icon.family, item.icon.name]"
								/>
							</div>

							<form-label class="m-0 font-semibold">
								{{ item.name }}
							</form-label>
						</div>
					</form-item>
				</form-field>
				<form-message />
			</form-item>
		</form-field>
	</div>
</template>
