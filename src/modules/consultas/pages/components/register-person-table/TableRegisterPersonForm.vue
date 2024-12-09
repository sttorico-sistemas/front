<script lang="ts" setup>
	import * as z from 'zod'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { ButtonRoot } from '@/core/components/button'
	import { Separator } from '@/core/components/separator'
	import { InputRoot } from '@/core/components/fields/input'
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
		Form,
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { tabelasAuxiliaresRepository } from '@/modules/configuracoes/stores'
	import { useQuery } from '@tanstack/vue-query'
	import { computed, ref, type PropType } from 'vue'
	import { toTypedSchema } from '@vee-validate/zod'
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
		queryKey: tabelasAuxiliaresRepository.getQueryKey('states'),
		queryFn: ({ signal }) =>
			tabelasAuxiliaresRepository.getAllStates({
				signal,
				params: { perPage: '27' },
			}),
	})

	const isActive = computed(() => {
		return !!selectedState.value
	})

	const { data: citiesData, isLoading: isCityLoading } = useQuery({
		enabled: isActive,
		queryKey: tabelasAuxiliaresRepository.getQueryKey(
			'cities',
			{},
			selectedState,
		),
		queryFn: ({ signal }) =>
			tabelasAuxiliaresRepository.getAllCities({
				signal,
				params: { estado_id: selectedState.value, perPage: '853' },
			}),
	})

	const { data: contactTypeData, isLoading: isContactTypeLoading } = useQuery({
		queryKey: tabelasAuxiliaresRepository.getQueryKey('contact-type'),
		queryFn: ({ signal }) =>
			tabelasAuxiliaresRepository.getAllTableValues('auxiliary/tipo-contato', {
				signal,
			}),
	})

	const { data: addressesTypeData, isLoading: isAddressTypeLoading } = useQuery(
		{
			queryKey: tabelasAuxiliaresRepository.getQueryKey('address-type'),
			queryFn: ({ signal }) =>
				tabelasAuxiliaresRepository.getAllTableValues(
					'auxiliary/tipo-endereco',
					{
						signal,
					},
				),
		},
	)

	const formattedAllStates = computed(() => {
		return (statesData.value ?? []).map(({ id, uf }) => ({ id, name: uf }))
	})

	const formattedAllCities = computed(() => {
		return (citiesData.value ?? []).map(({ id, name }) => ({ id, name }))
	})

	const formattedAllAddressesType = computed(() => {
		return (addressesTypeData.value ?? []).map(({ id, nome }) => ({
			id,
			name: nome,
		}))
	})

	const formattedAllContactType = computed(() => {
		return (contactTypeData.value ?? []).map(({ id, nome }) => ({
			id,
			name: nome,
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
			(contactTypeData.value ?? []).map(({ id, nome }) => [id, nome]),
		)
	})

	const formattedAllAddressesTypeMap = computed(() => {
		return Object.fromEntries(
			(addressesTypeData.value ?? []).map(({ id, nome }) => [id, nome]),
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
		<FormField v-slot="{ componentField }" name="name">
			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-left">Nome</FormLabel>
				<FormControl>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o nome..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-5 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="cpf">
			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-left">CPF</FormLabel>
				<FormControl>
					<input-root
						v-maska="'###.###.###-##'"
						:disabled="disabled"
						type="text"
						placeholder="Digite o CPF..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-5 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="birthday">
			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-left">Data de nascimento</FormLabel>
				<FormControl>
					<input-root
						v-maska="'##/##/####'"
						:disabled="disabled"
						type="text"
						placeholder="Digite o data de nascimento..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</FormControl>

				<FormMessage class="col-span-5 col-start-2" />
			</FormItem>
		</FormField>

		<FormField
			v-slot="{
				componentField: contactsComponentField,
				handleChange: contactsHandleChange,
				setErrors: contactsSetErrors,
			}"
			name="contacts"
		>
			<Separator class="my-4" label="Contatos" />

			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<Form
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
					<FormField v-slot="{ componentField }" name="formPhoneTypeId">
						<FormItem
							class="grid grid-cols-4 col-span-3 items-start justify-start gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left col-span-4">Tipo contato</FormLabel>
							<FormControl>
								<SelectRoot
									class="items-start justify-start"
									:disabled="disabled || isContactTypeLoading"
									v-bind="componentField"
								>
									<SelectTrigger class="col-span-4">
										<SelectValue placeholder="Selecione o tipo..." />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Tipos de contato:</SelectLabel>
											<SelectItem
												v-for="contactType of formattedAllContactType"
												:key="contactType.id"
												:value="contactType.id.toString()"
												>{{ contactType.name }}</SelectItem
											>
										</SelectGroup>
									</SelectContent>
								</SelectRoot>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="formPhone">
						<FormItem
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left">Telefone</FormLabel>
							<FormControl>
								<input-root
									:disabled="disabled"
									type="text"
									v-maska="'(##) ####-####'"
									placeholder="Digite o telefone..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="formCellphone">
						<FormItem
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left">Celular</FormLabel>
							<FormControl>
								<input-root
									:disabled="disabled"
									type="text"
									v-maska="'(##) # ####-####'"
									placeholder="Digite o celular..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="formEmail">
						<FormItem
							class="grid grid-cols-4 col-span-4 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left">E-mail</FormLabel>
							<FormControl>
								<input-root
									:disabled="disabled"
									type="text"
									placeholder="Digite o e-mail..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

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
				</Form>

				<FormMessage class="col-span-12" />
			</FormItem>

			<div
				v-if="contactsComponentField.modelValue?.length > 0"
				class="mt-4 mb-4 gap-y-4 flex flex-col"
			>
				<article
					class="grid gap-2 grid-cols-12"
					v-for="contact of contactsComponentField.modelValue"
					:key="`contact-${contact.email}`"
				>
					<FormItem
						class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">Tipo contato</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ formattedAllContactsTypeMap[contact.phoneTypeId] }}
							</p>
						</FormControl>
					</FormItem>

					<FormItem
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">Telefone</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ contact.phone }}
							</p>
						</FormControl>
					</FormItem>

					<FormItem
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">Celular</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ contact.cellphone }}
							</p>
						</FormControl>
					</FormItem>

					<FormItem
						class="grid grid-cols-4 col-span-4 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">E-mail</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ contact.email }}
							</p>
						</FormControl>
					</FormItem>

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
		</FormField>

		<FormField
			v-slot="{
				componentField: addressComponentField,
				handleChange: addressHandleChange,
			}"
			name="addresses"
		>
			<Separator class="my-4 mb-4" label="Endereços" />

			<FormItem class="grid grid-cols-12 items-center gap-x-4 gap-y-1 mt-4">
				<Form
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
					<FormField v-slot="{ componentField }" name="formAddressTypeId">
						<FormItem
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left col-span-4"
								>Tipo de endereço</FormLabel
							>
							<FormControl>
								<SelectRoot :disabled="disabled" v-bind="componentField">
									<SelectTrigger class="col-span-4">
										<SelectValue placeholder="Tipos..." />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Tipos de endereços:</SelectLabel>
											<SelectItem
												v-for="state of formattedAllAddressesType"
												:key="state.id"
												:value="state.id.toString()"
												>{{ state.name }}</SelectItem
											>
										</SelectGroup>
									</SelectContent>
								</SelectRoot>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="formStreet">
						<FormItem
							class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left">Logadouro</FormLabel>
							<FormControl>
								<input-root
									:disabled="disabled"
									type="text"
									placeholder="Digite o logadouro..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="formZipCode">
						<FormItem
							class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left">CEP</FormLabel>
							<FormControl>
								<input-root
									:disabled="disabled"
									type="text"
									v-maska="'#####-###'"
									placeholder="Digite o cep..."
									class="col-span-4"
									v-bind="componentField"
								/>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="formStateId">
						<FormItem
							class="grid grid-cols-4 col-span-1 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left col-span-4">UF</FormLabel>
							<FormControl>
								<SelectRoot
									@update:model-value="
										(value) => {
											selectedState = value
										}
									"
									:disabled="disabled || isCityLoading"
									v-bind="componentField"
								>
									<SelectTrigger class="col-span-4">
										<SelectValue placeholder="UF..." />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Estados:</SelectLabel>
											<SelectItem
												v-for="state of formattedAllStates"
												:key="state.id"
												:value="state.id.toString()"
												>{{ state.name }}</SelectItem
											>
										</SelectGroup>
									</SelectContent>
								</SelectRoot>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="formCityId">
						<FormItem
							class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
						>
							<FormLabel class="text-left col-span-4">Cidade</FormLabel>
							<FormControl>
								<Popover v-model:open="openCityBox">
									<PopoverTrigger as-child>
										<ButtonRoot
											variant="outline"
											role="combobox"
											:aria-expanded="openCityBox"
											class="lg:max-w-96 flex-[3] justify-between col-span-4"
											:disabled="disabled || formattedAllCities.length <= 0"
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
										</ButtonRoot>
									</PopoverTrigger>
									<PopoverContent class="lg:max-w-96 flex-[3]A p-0">
										<Command>
											<CommandInput
												class="h-9"
												placeholder="Busque uma cidade..."
											/>
											<CommandEmpty>Nenhuma cidades encontrada.</CommandEmpty>
											<CommandList>
												<CommandGroup>
													<CommandItem
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
													</CommandItem>
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</FormControl>

							<FormMessage class="col-span-4" />
						</FormItem>
					</FormField>

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
				</Form>

				<FormMessage class="col-span-12" />
			</FormItem>

			<div
				v-if="addressComponentField.modelValue?.length > 0"
				class="mt-4 mb-4 gap-y-4 flex flex-col"
			>
				<article
					class="grid gap-2 grid-cols-12"
					v-for="address of addressComponentField.modelValue"
					:key="`contact-${address.email}`"
				>
					<FormItem
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">Tipo de endereço</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ formattedAllAddressesTypeMap[address.addressTypeId] }}
							</p>
						</FormControl>
					</FormItem>

					<FormItem
						class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">Logradouro</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ address.street }}
							</p>
						</FormControl>
					</FormItem>

					<FormItem
						class="grid grid-cols-4 col-span-2 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">CEP</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ address.zipCode }}
							</p>
						</FormControl>
					</FormItem>

					<FormItem
						class="grid grid-cols-4 col-span-1 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">Estado</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{ formattedAllStatesMap[address.stateId] }}
							</p>
						</FormControl>
					</FormItem>

					<FormItem
						class="grid grid-cols-4 col-span-3 items-center gap-x-4 gap-y-1"
					>
						<FormLabel class="text-left col-span-4">Cidade</FormLabel>
						<FormControl>
							<p
								class="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
							>
								{{
									formattedAllCitiesMap[address.cityId] ??
									props.loadCities[address.cityId]
								}}
							</p>
						</FormControl>
					</FormItem>

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
		</FormField>
	</div>
</template>
