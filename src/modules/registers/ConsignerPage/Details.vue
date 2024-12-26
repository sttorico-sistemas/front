<script lang="ts" setup>
	import { computed, h, onMounted, ref } from 'vue'
	import * as z from 'zod'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useRouteQuery } from '@vueuse/router'
	import { keepPreviousData, useQuery } from '@tanstack/vue-query'
	import { useRoute, useRouter } from 'vue-router'
	import { useLocalStorage } from '@vueuse/core'

	import { FormControl, FormField, FormItem } from '@/core/components/form'
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
		SelectRoot,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
	} from '@/core/components/fields/select'
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger,
	} from '@/core/components/accordion'
	import Breadcrumbs from '@/core/components/Breadcrumbs.vue'
	import {
		auxiliaryRepository,
		consignerRepository,
		masterConsignerRepository,
	} from '@/core/stores'
	import { cn, debounceAsync } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import { accordionItems } from '@/modules/registers/ConsignerPage/constants'

	import { RenderElement } from '@/core/components/render-element'

	type ConsignerTable = {
		id: number
		name: string
		cnpj: string
		entityTypeId: string
		status: number
	}

	const formSchema = z.object({
		masterConsignerId: z
			.string({ message: 'O consignante master é obrigatório' })
			.min(1, { message: 'O consignante master é obrigatório.' }),
		entityTypeId: z
			.string({ message: 'A entidade é obrigatória' })
			.min(1, { message: 'A entidade é obrigatória.' }),
		consignerId: z
			.string({ message: 'O consignante é obrigatório.' })
			.min(1, { message: 'O consignante é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const openConsignerBox = ref(false)
	const tmpConsigner = ref<{ id: string; name: string } | undefined>(undefined)
	const status = useRouteQuery<string | undefined>('cgn-status', undefined)
	const formattedSearchConsigners = useLocalStorage<
		{ id: string; name: string }[]
	>('dtl-consigner', [])
	const route = useRoute()
	const router = useRouter()

	const currentId = computed(() => {
		return +(route.params.id as string)
	})

	const currentMasterConsignerId = computed(() => {
		return +(form.values.masterConsignerId as string)
	})

	const currentEntityTypeId = computed(() => {
		return +(form.values.entityTypeId as string)
	})

	const { data: consigner, isLoading: isConsignerLoading } = useQuery({
		queryKey: consignerRepository.getQueryKey('consigner-by-id', {}, currentId),
		queryFn: ({ signal }) =>
			consignerRepository.getConsignerById(currentId.value, {
				signal,
				metaCallback: (meta, data) => {
					tmpConsigner.value = {
						id: data.id?.toString() as string,
						name: data.name,
					}
					form.setValues({
						consignerId: data.id?.toString() as string,
						masterConsignerId: data.masterConsignerId.toString(),
						entityTypeId: data.entityTypeId.toString(),
					})
				},
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

	const onSubmit = form.handleSubmit((value) => {
		if (currentId.value.toString() === value.consignerId) return
		console.log(value)
		router.replace({ params: { id: value.consignerId } })
	})

	function goToBack() {
		router.back()
	}

	const handleSearchConsigners = debounceAsync(async (value: string) => {
		return consignerRepository
			.getAllConsigners({
				params: {
					search: value,
					per_page: 10,
					consignante_master_id: currentMasterConsignerId.value,
					tipo_entidade_id: currentEntityTypeId.value,
				},
			})
			.then((response) => {
				formattedSearchConsigners.value = response.map(({ id, name }) => ({
					id: `${id}`,
					name,
				}))
				return response
			})
	}, 500)
</script>
<template>
	<main class="mb-4">
		<breadcrumbs :paginas="['Cadastro', 'Consignante']" />

		<div class="panel pb-1 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<tooltip-provider>
					<tooltip>
						<tooltip-trigger as-child>
							<button-root variant="outline" @click="goToBack">
								<font-awesome-icon
									class="text-primary_3-table w-5 h-5"
									:icon="['fas', 'arrow-left']"
								/>
							</button-root>
						</tooltip-trigger>
						<tooltip-content side="right">
							<p>Voltar</p>
						</tooltip-content>
					</tooltip>
				</tooltip-provider>

				<form
					class="header_actions flex items-center gap-4 flex-1 justify-start"
					@submit="onSubmit"
				>
					<form-field
						v-slot="{ componentField }"
						id="masterConsignerId"
						name="masterConsignerId"
					>
						<form-item class="flex-1 max-w-96">
							<form-control>
								<select-root
									class="items-start justify-start"
									:disabled="isMasterConsignersLoading"
									v-bind="componentField"
								>
									<select-trigger class="col-span-5">
										<select-value
											placeholder="Selecione o consignante master..."
										/>
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
						</form-item>
					</form-field>

					<form-field
						v-slot="{ componentField }"
						id="entityTypeId"
						name="entityTypeId"
					>
						<form-item class="flex-1 max-w-96">
							<form-control>
								<select-root
									class="items-start justify-start"
									:disabled="isEntityTypesLoading"
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
						</form-item>
					</form-field>

					<form-field
						v-slot="{ componentField, handleChange }"
						id="consignerId"
						name="consignerId"
					>
						<form-item class="flex-1 max-w-96">
							<form-control>
								<Popover v-model:open="openConsignerBox">
									<PopoverTrigger as-child>
										<ButtonRoot
											variant="outline"
											role="combobox"
											:aria-expanded="openConsignerBox"
											class="w-full justify-between"
										>
											{{ tmpConsigner?.name ?? 'Selecione o consignante...' }}
											<font-awesome-icon
												v-if="openConsignerBox"
												:icon="['fas', 'chevron-up']"
											/>
											<font-awesome-icon
												v-else
												:icon="['fas', 'chevron-down']"
											/>
										</ButtonRoot>
									</PopoverTrigger>
									<PopoverContent class="lg:max-w-96 flex-[3]A p-0">
										<Command @update:searchTerm="handleSearchConsigners">
											<CommandInput
												name="search-input"
												class="h-9"
												placeholder="Busque um consignante..."
											/>

											<CommandEmpty>
												Nenhum consignante encontrada.
											</CommandEmpty>

											<CommandList>
												<CommandGroup>
													<CommandItem
														v-for="searchConsigner in formattedSearchConsigners"
														:key="searchConsigner.id"
														:value="searchConsigner.name"
														@select="
															(ev) => {
																handleChange(searchConsigner.id)
																tmpConsigner = searchConsigner
																openConsignerBox = false
															}
														"
													>
														{{ searchConsigner.name }}
														<font-awesome-icon
															:class="
																cn(
																	'ml-auto h-4 w-4',
																	componentField.modelValue ===
																		searchConsigner.id
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
							</form-control>
						</form-item>
					</form-field>

					<button-root variant="outline" type="submit">
						<font-awesome-icon
							class="text-primary_3-table w-5 h-5"
							:icon="['fas', 'magnifying-glass']"
						/>

						<p class="text-primary_3-table font-semibold ml-4 text-md">
							Nova consulta
						</p>
					</button-root>
				</form>
			</div>
		</div>

		<div
			v-if="isConsignerLoading"
			class="flex justify-center items-center py-4"
		>
			<font-awesome-icon :icon="['fas', 'spinner']" class="animate-spin" />
		</div>

		<section class="">
			<accordion type="single" class="w-full mt-6" collapsible>
				<accordion-item
					v-for="item in accordionItems"
					:key="item.value"
					:value="item.value"
					class="border-none relative rounded-md shadow dark:bg-[#0e1726] bg-white py-1 mt-2"
					:disabled="item.disabled"
				>
					<accordion-trigger
						class="text-lg font-medium justify-between gap-4a px-4"
					>
						{{ item.title }}
						<template #iconRight></template>
					</accordion-trigger>
					<accordion-content
						class="border-t bg-white pt-8 flex justify-start px-4"
					>
						<render-element
							:element="item.component"
							:props="{
								dataId: +route.params.id,
							}"
						></render-element>
					</accordion-content>
				</accordion-item>
			</accordion>
		</section>
	</main>
</template>
