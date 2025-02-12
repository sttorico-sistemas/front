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
	import { InputRoot } from '@/core/components/fields/input'
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
		consignerAdminRepository,
		consignerRepository,
		masterConsignerRepository,
	} from '@/core/stores'
	import { cn, debounceAsync } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import { accordionItems } from '@/modules/registers/ConsignerAdminPage/constants'

	import { RenderElement } from '@/core/components/render-element'

	type ConsignerTable = {
		id: number
		name: string
		cnpj: string
		entityTypeId: string
		status: number
	}

	const formSchema = z.object({
		shortName: z
			.string({ message: 'O nome curto é obrigatório' })
			.min(1, { message: 'O nome curto é obrigatório.' }),
		entityTypeId: z
			.string({ message: 'A entidade é obrigatória' })
			.min(1, { message: 'A entidade é obrigatória.' }),
		consignerAdminId: z
			.string({ message: 'O consignatária é obrigatória.' })
			.min(1, { message: 'O consignatária é obrigatória.' }),
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

	const currentShortName = computed(() => {
		return +(form.values.shortName as string)
	})

	const currentEntityTypeId = computed(() => {
		return +(form.values.entityTypeId as string)
	})

	const { data: consigner, isLoading: isConsignerLoading } = useQuery({
		queryKey: consignerAdminRepository.getQueryKey('consigner-admin-by-id', {}, currentId),
		queryFn: ({ signal }) =>
		consignerAdminRepository.getConsignerAdminById(currentId.value, {
				signal,
				metaCallback: (meta, data) => {
					tmpConsigner.value = {
						id: data.id?.toString() as string,
						name: data.name,
					}
					form.setValues({
						consignerAdminId: data.id?.toString() as string,
						shortName: data.shortName.toString(),
						entityTypeId: data.entityTypeId.toString(),
					})
				},
			}),
	})

	const { data: consignerAdmin, isLoading: isConsignerAdminLoading } =
		useQuery({
			queryKey: consignerAdminRepository.getQueryKey('consigner-admins'),
			queryFn: ({ signal }) =>
			consignerAdminRepository.getAllConsignerAdmins({
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

	const formattedAllConsignerAdmin = computed(() => {
		return (consignerAdmin.value ?? []).map(({ id, name }) => ({
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
		if (currentId.value.toString() === value.consignerAdminId) return
		console.log(value)
		router.replace({ params: { id: value.consignerAdminId } })
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
					consignante_master_id: currentShortName.value,
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
		<breadcrumbs :paginas="['Cadastro', 'Consignatária']" />

		<div class="panel pb-1 mt-6 bg-[#EAEAEC]">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<tooltip-provider>
					<tooltip>
						<tooltip-trigger as-child>
							<button-root
								variant="default"
								@click="goToBack"
								class="rounded-3xl"
							>
								<font-awesome-icon
									class="text-white w-5 h-5"
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
						id="shortName"
						name="shortName"
					>
						<form-item class="flex-1 max-w-96">
							<form-control>
								<select-root
									class="items-start justify-start"
									:disabled="isConsignerAdminLoading"
									v-bind="componentField"
								>
									<select-trigger class="col-span-5">
										<select-value placeholder="Selecione a consignatária..." />
									</select-trigger>
									<select-content>
										<select-group>
											<select-label>Consignatárias:</select-label>
											<select-item
												v-for="masterConsigner of formattedAllConsignerAdmin"
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
										<select-value
											placeholder="Selecione o tipo de instituição..."
										/>
									</select-trigger>
									<select-content>
										<select-group>
											<select-label>Tipos de instituições:</select-label>
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
						id="consignerAdminId"
						name="consignerAdminId"
					>
						<form-item class="flex-1 max-w-96">
							<form-control>
								<input-root placeholder="Nome curto" />
							</form-control>
						</form-item>
					</form-field>

					<button-root
						variant="default"
						type="submit"
						class="flex ml-40 rounded-3xl justify-center items-center"
					>
						<p class="text-white font-semibold text-xs">Nova consulta</p>
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
