<script lang="ts" setup>
	import { computed, type PropType } from 'vue'
	import { useQuery } from '@tanstack/vue-query'

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
		FormControl,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from '@/core/components/form'
	import { InputRoot } from '@/core/components/fields/input'
	import { auxiliaryRepository } from '@/core/stores'

	defineProps({
		disabled: { type: Boolean, default: () => false },
		metadata: {
			type: Object as PropType<Record<string, string>>,
			default: () => ({}),
		},
	})

	const { data: statesData } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('states'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllStates({
				signal,
				params: { perPage: 27 },
			}),
	})

	const formattedAllStates = computed(() => {
		return (statesData.value ?? []).map(({ id, name }) => ({ id: `${id}`, name }))
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

		<form-field v-slot="{ componentField }" name="stateId">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Estado</form-label>
				<form-control>
					<select-root :disabled="disabled" v-bind="componentField">
						<select-trigger class="col-span-5">
							<select-value placeholder="Selecione o estado..." />
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
				<form-Message class="col-span-3 col-start-3" />
			</form-item>
		</form-field>

		<form-field v-slot="{ componentField }" name="ibgeCode">
			<form-item class="grid grid-cols-12 items-center gap-x-4 gap-y-1">
				<form-label class="text-left col-span-2">Código IBGE</form-label>
				<form-control>
					<input-root
						:disabled="disabled"
						type="text"
						placeholder="Digite o código..."
						class="col-span-5"
						v-bind="componentField"
					/>
				</form-control>

				<form-message class="col-span-5 col-start-3" />
			</form-item>
		</form-field>
	</div>
</template>
