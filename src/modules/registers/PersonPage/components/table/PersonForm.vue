<script lang="ts" setup>
	import { computed, ref, type PropType } from 'vue'
	import * as z from 'zod'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { useQuery } from '@tanstack/vue-query'
	import { toTypedSchema } from '@vee-validate/zod'

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
	import {
		Form as FormRoot,
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { ButtonRoot } from '@/core/components/button'
	import { Separator } from '@/core/components/separator'
	import { InputRoot } from '@/core/components/fields/input'
	import { cn } from '@/core/utils'
	import { auxiliaryRepository } from '@/core/stores'

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

	const { data: contactTypeData, isLoading: isContactTypeLoading } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('contact-type'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllContactTypes({
				signal,
			}),
	})

	const { data: addressesTypeData, isLoading: isAddressTypeLoading } = useQuery(
		{
			queryKey: auxiliaryRepository.getQueryKey('address-type'),
			queryFn: ({ signal }) =>
				auxiliaryRepository.getAllAddressTypes({
					signal,
				}),
		},
	)

	const formattedAllStates = computed(() => {
		return (statesData.value ?? []).map(({ id, uf }) => ({
			id: id as number,
			name: uf,
		}))
	})

	const formattedAllCities = computed(() => {
		return (citiesData.value ?? []).map(({ id, name }) => ({
			id: id as number,
			name,
		}))
	})

	const formattedAllAddressesType = computed(() => {
		return (addressesTypeData.value ?? []).map(({ id, name }) => ({
			id: id as number,
			name,
		}))
	})

	const formattedAllContactType = computed(() => {
		return (contactTypeData.value ?? []).map(({ id, name }) => ({
			id: id as number,
			name,
		}))
	})

	const formattedAllStatesMap = computed(() => {
		return Object.fromEntries(
			(statesData.value ?? []).map(({ id, uf }) => [id, uf]),
		)
	})

	const formattedAllCitiesTempMap = computed(() => {
		return Object.fromEntries(
			(citiesData.value ?? []).map(({ id, name }) => [id, name]),
		)
	})

	const formattedAllContactsTypeMap = computed(() => {
		return Object.fromEntries(
			(contactTypeData.value ?? []).map(({ id, name }) => [id, name]),
		)
	})

	const formattedAllAddressesTypeMap = computed(() => {
		return Object.fromEntries(
			(addressesTypeData.value ?? []).map(({ id, name }) => [id, name]),
		)
	})

	const formAddressSchema = z.object({
		formCityId: z.string({ message: 'Cidade  é obrigatória.' }),
		formStateId: z.string({ message: 'Cidade  é obrigatória.' }),
		formStreet: z.string({ message: 'Logradouro é obrigatório.' }),
		formZipCode: z.string({ message: 'CEP é obrigatório.' }),
		formAddressTypeId: z.string({ message: 'Estado é obrigatório.' }),
	})

	const formContactSchema = z.object({
		formPhoneTypeId: z.string({ message: 'Tipo é obrigatório.' }),
		formPhone: z.string({ message: 'Telefone é obrigatório.' }),
		formEmail: z
			.string({ message: 'E-mail é obrigatório.' })
			.email({ message: 'Tem que ser e-mail válido' }),
		formCellphone: z.string({ message: 'Celular é obrigatório.' }),
	})
</script>

<template>
	<div class="flex flex-col">
		<form-field v-slot="{ componentField }" name="name">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left">Nome</form-label>
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

		<form-field v-slot="{ componentField }" name="cpf">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left">CPF</form-label>
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

		<form-field v-slot="{ componentField }" name="birthday">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left">Data de nascimento</form-label>
				<form-control>
					<input-root
						v-maska="'##/##/####'"
						:disabled="disabled"
						type="text"
						placeholder="Digite o data de nascimento..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-2" />
			</form-item>
		</form-field>

		<form-field
			v-slot="{
				componentField: contactsComponentField,
				handleChange: contactsHandleChange,
				setErrors: contactsSetErrors,
			}"
			name="contacts"
		>
			<Separator class="my-4" label="Contatos" />

			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-root
					:validation-schema="toTypedSchema(formContactSchema)"
					class="grid col-span-12 gap-2 grid-cols-12 mt-4"
					@submit="
						(values, context) => {
							const isInvalid = ((metadata?.contacts ?? []) as Array<any>).some(
								({ email, cellphone, phone }) =>
									email === values.formEmail ||
									cellphone === values.formPhoneTypeId ||
									phone === values.formPhone,
							)

							if (isInvalid) {
								contactsSetErrors('Não é permitido adicionar contatos iguais.')
								return
							}

							contactsHandleChange(
								[
									...(metadata?.contacts ?? []),
									{
										phoneTypeId: values.formPhoneTypeId,
										phone: values.formPhone,
										email: values.formEmail,
										cellphone: values.formCellphone,
									},
								],
								true,
							)
							context.resetForm()
						}
					"
				>
					<form-field v-slot="{ componentField }" name="formPhoneTypeId">
						<form-item
							class="grid grid-cols-4 col-span-3 items-start justify-start gap-x-4 gap-y-1"
						>
							<form-label class="text-left col-span-4">Tipo contato</form-label>
							<form-control>
								<select-root
									class="items-start justify-start"
									:disabled="disabled || isContactTypeLoading"
									v-bind="componentField"
								>
									<select-trigger class="col-span-4">
										<select-value placeholder="Selecione o tipo..." />
									</select-trigger>
									<select-content>
										<select-group>
											<select-label>Tipos de contato:</select-label>
											<select-item
												v-for="contactType of formattedAllContactType"
												:key="contactType.id"
												:value="contactType.id.toString()"
												>{{ contactType.name }}</select-item
											>
										</select-group>
									</select-content>
								</select-root>
							</form-control>

							<form-message class="col-span-4" />
						</form-item>
					</form-field>

					<form-field v-slot="{ componentField }" name="formPhone">
						<form-item
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<form-label class="text-left">Telefone</form-label>
							<form-control>
								<input-root
									:disabled="disabled"
									type="text"
									v-maska="'(##) ####-####'"
									placeholder="Digite o telefone..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</form-control>

							<form-message class="col-span-4" />
						</form-item>
					</form-field>

					<form-field v-slot="{ componentField }" name="formCellphone">
						<form-item
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<form-label class="text-left">Celular</form-label>
							<form-control>
								<input-root
									:disabled="disabled"
									type="text"
									v-maska="'(##) # ####-####'"
									placeholder="Digite o celular..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</form-control>

							<form-message class="col-span-4" />
						</form-item>
					</form-field>

					<form-field v-slot="{ componentField }" name="formEmail">
						<form-item
							class="grid grid-cols-4 col-span-4 items-center gap-x-4 gap-y-1"
						>
							<form-label class="text-left">E-mail</form-label>
							<form-control>
								<input-root
									:disabled="disabled"
									type="text"
									placeholder="Digite o e-mail..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</form-control>

							<form-message class="col-span-4" />
						</form-item>
					</form-field>

					<button-root
						:disabled="false"
						variant="outline"
						type="submit"
						class="mt-auto gap-2 mb-8"
					>
						<font-awesome-icon
							v-if="false"
							:icon="['fas', 'spinner']"
							class="animate-spin"
						/>
						<font-awesome-icon v-else :icon="['fas', 'plus']" />
					</button-root>
				</form-root>

				<form-message class="col-span-12" />
			</form-item>

			<div
				v-if="contactsComponentField.modelValue?.length > 0"
				class="mt-4 mb-4 gap-y-4 flex flex-col"
			>
				<article
					class="grid gap-2 grid-cols-12"
					v-for="contact of contactsComponentField.modelValue"
					:key="`contact-${contact.email}`"
				>
					<form-item
						class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">Tipo contato</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ formattedAllContactsTypeMap[contact.phoneTypeId] }}
							</p>
						</form-control>
					</form-item>

					<form-item
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">Telefone</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ contact.phone }}
							</p>
						</form-control>
					</form-item>

					<form-item
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">Celular</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ contact.cellphone }}
							</p>
						</form-control>
					</form-item>

					<form-item
						class="grid grid-cols-4 col-span-4 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">E-mail</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ contact.email }}
							</p>
						</form-control>
					</form-item>

					<button-root
						:disabled="false"
						variant="outline"
						type="button"
						class="mt-auto gap-2"
						@click="
							() => {
								contactsHandleChange(
									(metadata.contacts as Array<{ email: string }>).filter(
										({ email }) => email !== contact.email,
									),
									true,
								)
							}
						"
					>
						<font-awesome-icon :icon="['fas', 'trash-can']" />
					</button-root>
				</article>
			</div>
		</form-field>

		<form-field
			v-slot="{
				componentField: addressComponentField,
				handleChange: addressHandleChange,
			}"
			name="addresses"
		>
			<Separator class="my-4 mb-4" label="Endereços" />

			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1 mt-4">
				<form-root
					:validation-schema="toTypedSchema(formAddressSchema)"
					class="grid col-span-12 gap-2 grid-cols-12"
					@submit="
						(values, context) => {
							addressHandleChange(
								[
									...(metadata?.addresses ?? []),
									{
										cityId: values.formCityId,
										stateId: values.formStateId,
										street: values.formStreet,
										zipCode: values.formZipCode,
										addressTypeId: values.formAddressTypeId,
									},
								],
								true,
							)
							const citiesMap = new Map(Object.entries(formattedAllCitiesMap))
							citiesMap.set(
								values.formCityId,
								formattedAllCitiesTempMap[values.formCityId],
							)
							formattedAllCitiesMap = Object.fromEntries(citiesMap.entries())
							context.resetForm()
						}
					"
				>
					<form-field v-slot="{ componentField }" name="formAddressTypeId">
						<form-item
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<form-label class="text-left col-span-4"
								>Tipo de endereço</form-label
							>
							<form-control>
								<select-root :disabled="disabled" v-bind="componentField">
									<select-trigger class="col-span-4">
										<select-value placeholder="Tipos..." />
									</select-trigger>
									<select-content>
										<select-group>
											<select-label>Tipos de endereços:</select-label>
											<select-item
												v-for="state of formattedAllAddressesType"
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

					<form-field v-slot="{ componentField }" name="formStreet">
						<form-item
							class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
						>
							<form-label class="text-left">Logadouro</form-label>
							<form-control>
								<input-root
									:disabled="disabled"
									type="text"
									placeholder="Digite o logadouro..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</form-control>

							<form-message class="col-span-4" />
						</form-item>
					</form-field>

					<form-field v-slot="{ componentField }" name="formZipCode">
						<form-item
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<form-label class="text-left">CEP</form-label>
							<form-control>
								<input-root
									:disabled="disabled"
									type="text"
									v-maska="'#####-###'"
									placeholder="Digite o cep..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</form-control>

							<form-message class="col-span-4" />
						</form-item>
					</form-field>

					<form-field v-slot="{ componentField }" name="formStateId">
						<form-item
							class="grid grid-cols-4 col-span-1 items-center gap-x-4 gap-y-1"
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

					<form-field v-slot="{ componentField }" name="formCityId">
						<form-item
							class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
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
												disabled ||
												isCityLoading ||
												formattedAllCities.length <= 0
											"
										>
											{{
												formattedAllCitiesMap[componentField.modelValue] ??
												'Selecione a cidade...'
											}}
											<font-awesome-icon
												v-if="openCityBox"
												:icon="['fas', 'chevron-up']"
											/>
											<font-awesome-icon
												v-else
												:icon="['fas', 'chevron-down']"
											/>
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
														:value="searchCities.name"
														@select="
															(ev) => {
																if (typeof ev.detail.value === 'string') {
																	componentField.modelValue = ev.detail.value
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
																	componentField.modelValue ===
																		searchCities.name
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

					<button-root
						:disabled="false"
						variant="outline"
						type="submit"
						class="mt-auto gap-2 mb-8"
					>
						<font-awesome-icon
							v-if="false"
							:icon="['fas', 'spinner']"
							class="animate-spin"
						/>
						<font-awesome-icon v-else :icon="['fas', 'plus']" />
					</button-root>
				</form-root>

				<form-message class="col-span-12" />
			</form-item>

			<div
				v-if="addressComponentField.modelValue?.length > 0"
				class="mt-4 mb-4 gap-y-4 flex flex-col"
			>
				<article
					class="grid gap-2 grid-cols-12"
					v-for="address of addressComponentField.modelValue"
					:key="`contact-${address.email}`"
				>
					<form-item
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4"
							>Tipo de endereço</form-label
						>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ formattedAllAddressesTypeMap[address.addressTypeId] }}
							</p>
						</form-control>
					</form-item>

					<form-item
						class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">Logradouro</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ address.street }}
							</p>
						</form-control>
					</form-item>

					<form-item
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">CEP</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ address.zipCode }}
							</p>
						</form-control>
					</form-item>

					<form-item
						class="grid grid-cols-4 col-span-1 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">Estado</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ formattedAllStatesMap[address.stateId] }}
							</p>
						</form-control>
					</form-item>

					<form-item
						class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
					>
						<form-label class="text-left col-span-4">Cidade</form-label>
						<form-control>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{
									formattedAllCitiesMap[address.cityId] ??
									props.loadCities[address.cityId]
								}}
							</p>
						</form-control>
					</form-item>

					<button-root
						:disabled="false"
						variant="outline"
						type="button"
						class="mt-auto gap-2"
						@click="
							() => {
								addressHandleChange(
									(
										metadata.addresses as Array<{
											cityId: string
											zipCode: string
											addressTypeId: string
										}>
									).filter(
										({ addressTypeId, cityId, zipCode }) =>
											`${addressTypeId}|${cityId}|${zipCode}` !==
											`${address.addressTypeId}|${address.cityId}|${address.zipCode}`,
									),
									true,
								)
							}
						"
					>
						<font-awesome-icon :icon="['fas', 'trash-can']" />
					</button-root>
				</article>
			</div>
		</form-field>
	</div>
</template>
