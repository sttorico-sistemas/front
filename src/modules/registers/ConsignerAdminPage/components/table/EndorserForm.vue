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
	import { auxiliaryRepository } from '@/core/stores'

	const props = defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
	})
	const selectedManager = ref<string | undefined>(undefined)

	const { data: managersData, isLoading: isManagerLoading } = useQuery({
		enabled: false,
		queryKey: auxiliaryRepository.getQueryKey('managers'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllStates({
				signal,
				params: { perPage: '27' },
			}),
	})

	const formattedAllManagers = computed(() => {
		return (managersData.value ?? []).map(({ id, uf }) => ({
			id: `${id}`,
			name: uf,
		}))
	})
</script>

<template>
	<div class="flex flex-col">
		<form-field v-slot="{ componentField }" name="name">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Averbador</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o averbador..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

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

		<form-field v-slot="{ componentField }" name="phone">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Telefone</form-label>
				<form-control>
					<input-root
						:disabled="true"
						type="text"
						v-maska="'(##) ####-####'"
						placeholder="Digite o telefone..."
						class="col-span-5 disabled:opacity-80"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="cellphone">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Celular</form-label>
				<form-control>
					<input-root
						:disabled="true"
						type="text"
						v-maska="'(##) # ####-####'"
						placeholder="Digite o celular..."
						class="col-span-5 disabled:opacity-80"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="email">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">E-mail</form-label>
				<form-control>
					<input-root
						:disabled="true"
						type="text"
						placeholder="Digite o E-mail..."
						class="col-span-5 disabled:opacity-80"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>
	</div>
</template>
