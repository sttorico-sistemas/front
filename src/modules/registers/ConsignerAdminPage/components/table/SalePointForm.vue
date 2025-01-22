<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import { computed } from 'vue'
	import { useQuery } from '@tanstack/vue-query'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { InputRoot } from '@/core/components/fields/input'
	import { Separator } from '@/core/components/separator'
	import { ButtonRoot } from '@/core/components/button'
	import { Checkbox } from '@/core/components/fields/checkbox'
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
	import { auxiliaryRepository, serviceRepository } from '@/core/stores'
	import { cn } from '@/core/utils'
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

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
	const selectedManager = ref<string | undefined>(undefined)
	const openCityBox = ref(false)
	const selectedState = ref<string | undefined>(undefined)

	const { data: managersData, isLoading: isManagerLoading } = useQuery({
		enabled: false,
		queryKey: auxiliaryRepository.getQueryKey('managers'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllStates({
				signal,
				params: { perPage: '27' },
			}),
	})

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

	const { data: servicesData, isLoading: isServiceLoading } = useQuery({
		queryKey: serviceRepository.getQueryKey('services'),
		queryFn: ({ signal }) =>
			serviceRepository.getAllServices({
				signal,
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

	const formattedAllManagers = computed(() => {
		return (managersData.value ?? []).map(({ id, uf }) => ({
			id: `${id}`,
			name: uf,
		}))
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

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'long',
	})
</script>

<template>
	<div class="flex flex-col">
		<form-field v-slot="{ componentField }" name="salePoint">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Ponto de venda</form-label>
				<form-control>
					<select-root
						@update:model-value="
							(value) => {
								selectedManager = value
							}
						"
						:disabled="disabled || isManagerLoading"
						v-bind="componentField"
					>
						<select-trigger class="col-span-5">
							<select-value placeholder="Ponto de venda..." />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Pontos de venda:</select-label>
								<select-item
									v-for="manager of [] as any[]"
									:key="manager.id"
									:value="manager.id.toString()"
									>{{ manager.name }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
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
						class="col-span-8"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

		<div class="grid grid-cols-12 gap-x-4">
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
		</div>

		<form-field v-slot="{ componentField }" name="managerId">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Gestor</form-label>
				<form-control>
					<select-root
						@update:model-value="
							(value) => {
								selectedManager = value
							}
						"
						:disabled="disabled || isManagerLoading"
						v-bind="componentField"
					>
						<select-trigger class="col-span-5">
							<select-value placeholder="Gestor..." />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Gestores:</select-label>
								<select-item
									v-for="manager of formattedAllManagers"
									:key="manager.id"
									:value="manager.id.toString()"
									>{{ manager.name }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<div class="grid grid-cols-12 gap-x-4">
			<form-field v-slot="{ componentField }" name="phone">
				<form-item
					class="grid grid-cols-4 col-span-6 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-4">Telefone</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o telefone..."
							class="col-span-8"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-4" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField, handleChange }" name="cellphone">
				<form-item
					class="grid grid-cols-4 col-span-6 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-4">Celular</form-label>
					<form-control>
						<input-root
							:disabled="disabled"
							type="text"
							placeholder="Digite o telefone..."
							class="col-span-8"
							v-bind="componentField"
						/>
					</form-control>

					<form-message class="col-span-4" />
				</form-item>
			</form-field>
		</div>

		<form-field v-slot="{ componentField }" name="email">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">E-mail</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o e-mail..."
						class="col-span-8"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-8 col-start-3" />
			</form-item>
		</form-field>

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
