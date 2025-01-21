<script lang="ts" setup>
	import { computed, ref, type PropType } from 'vue'
	import { useQuery } from '@tanstack/vue-query'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { fas } from '@fortawesome/free-solid-svg-icons'
	import { far } from '@fortawesome/free-regular-svg-icons'

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
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import {
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { InputRoot } from '@/core/components/fields/input'
	import { ButtonRoot } from '@/core/components/button'
	import { generalRepository, iamRepository } from '@/core/stores'
	import { SingleCheckboxTree } from '@/core/components/fields/checkbox-tree'
	import { Separator } from '@/core/components/separator'
	import { cn } from '@/core/utils'

	const openIconNameBox = ref(false)

	const props = defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})

	const formattedAllThemes = [
		{
			id: 'light',
			name: 'Claro (Ícone preto)',
		},
		{
			id: 'dark',
			name: 'Escuro (Ícone branco)',
		},
	]

	const formattedAllIconFamily = [
		{
			id: 'far',
			name: 'Far (Ícones regular)',
		},
		{
			id: 'fas',
			name: 'Fas (Ícones sólidos)',
		},
	]

	const formattedAllIconNames = computed(() => {
		const family = props.metadata.iconFamily
		const icons = family === 'far' ? far : fas
		const iconsName = new Set(
			Object.entries(icons).map(([_, iconMeta]) => iconMeta.iconName),
		)
		return Array.from(iconsName).map((name) => ({ id: name, name }))
	})

	const { data: allPages, isLoading: isAllPagesLoading } = useQuery({
		queryKey: generalRepository.getQueryKey('all-pages'),
		queryFn: ({ signal }) => generalRepository.getAllPages({ signal }),
	})

	const { data: treePermissions, isLoading: isTreePermissionsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('tree-permissions'),
			queryFn: ({ signal }) => iamRepository.getTreePermissions({ signal }),
		})

	const formattedAllTreePermissions = computed(() => {
		return (treePermissions.value ?? []).map((data) => data.toList())
	})

	const formattedAllPages = computed(() => {
		return (allPages.value ?? []).map(({ id, name }) => ({ id: `${id}`, name }))
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

		<form-field v-slot="{ componentField }" name="color">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Cor de fundo</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="color"
						placeholder="Digite a cor de fundo..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="theme">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Tema do ícone</form-label>
				<form-control>
					<select-root
						class="items-start justify-start"
						:disabled="disabled"
						v-bind="componentField"
					>
						<select-trigger class="col-span-5">
							<select-value placeholder="Selecione o tipo..." />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Tipos de entidade:</select-label>
								<select-item
									v-for="theme of formattedAllThemes"
									:key="theme.id"
									:value="theme.id.toString()"
									>{{ theme.name }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<div class="grid grid-cols-12 gap-x-4">
			<form-field v-slot="{ componentField }" name="iconFamily">
				<form-item
					class="grid grid-cols-12 col-span-6 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12"
						>Família do ícone</form-label
					>
					<form-control>
						<select-root
							class="items-start justify-start"
							:disabled="disabled"
							v-bind="componentField"
						>
							<select-trigger class="col-span-12">
								<select-value placeholder="Selecione a família..." />
							</select-trigger>
							<select-content>
								<select-group>
									<select-label>Família disponíveis:</select-label>
									<select-item
										v-for="theme of formattedAllIconFamily"
										:key="theme.id"
										:value="theme.id.toString()"
										>{{ theme.name }}</select-item
									>
								</select-group>
							</select-content>
						</select-root>
					</form-control>

					<form-message class="col-span-12 col-start-3" />
				</form-item>
			</form-field>

			<form-field v-slot="{ componentField, handleChange }" name="iconName">
				<form-item
					class="grid grid-cols-12 col-span-6 items-center gap-x-4 gap-y-1"
				>
					<form-label class="text-left col-span-12">Ícone</form-label>
					<form-control>
						<popover v-model:open="openIconNameBox">
							<popover-trigger as-child>
								<button-root
									variant="outline"
									role="combobox"
									:aria-expanded="openIconNameBox"
									class="lg:max-w-96 flex-[3] justify-between col-span-12"
									:disabled="
										disabled ||
										!metadata?.iconFamily ||
										formattedAllIconNames.length <= 0
									"
								>
									{{ metadata.iconName ?? 'Selecione o ícone...' }}
									<font-awesome-icon
										v-if="openIconNameBox"
										:icon="['fas', 'chevron-up']"
									/>
									<font-awesome-icon v-else :icon="['fas', 'chevron-down']" />
								</button-root>
							</popover-trigger>
							<popover-content class="lg:max-w-96 flex-[3]A p-0">
								<command>
									<command-input
										class="h-9"
										placeholder="Busque um ícone pelo nome (inglês)..."
									/>
									<command-empty>Nenhuma ícone encontrada.</command-empty>
									<command-list>
										<command-group>
											<command-item
												v-for="icon in formattedAllIconNames"
												:key="icon.id"
												:value="icon.id"
												@select="
													(ev) => {
														if (typeof ev.detail.value === 'string') {
															handleChange(ev.detail.value)
														}
														openIconNameBox = false
													}
												"
											>
												{{ icon.name }}
												<font-awesome-icon
													:class="
														cn(
															'ml-auto h-4 w-4',
															componentField.modelValue === icon.id
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

					<form-message class="col-span-12 col-start-3" />
				</form-item>
			</form-field>
		</div>

		<div class="flex gap-10 items-center">
			<p class="text-left font-semibold text-base">
				Pré-visualização do ícone:
			</p>

			<div
				class="flex border-2 rounded-md w-14 h-14 justify-center items-center"
			>
				<div
					v-if="
						metadata?.color &&
						metadata?.theme &&
						metadata?.iconFamily &&
						metadata?.iconName
					"
					:style="{ backgroundColor: metadata.color }"
					class="w-7 h-7 rounded-full flex justify-center items-center"
				>
					<font-awesome-icon
						:style="{
							color: metadata.theme === 'dark' ? '#FFFFFF' : '#000000',
						}"
						class="w-4 h-4"
						:icon="[metadata.iconFamily, metadata.iconName]"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
