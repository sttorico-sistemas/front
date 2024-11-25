<script lang="ts" setup>
import { Input } from '@/core/components/fields/input'
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	SelectRoot
} from '@/core/components/fields/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/form';
import { tabelasAuxiliaresRepository } from '@/modules/configuracoes/stores';
import { useQuery } from '@tanstack/vue-query';
import { computed, type PropType } from 'vue';

defineProps({
	disabled: { type: Boolean, default: () => false },
	metadata: {
		type: Object as PropType<Record<string, string>>,
		default: () => ({}),
	},
});

const { data: statesData } = useQuery({
	queryKey: tabelasAuxiliaresRepository.getQueryKey('states'),
	queryFn: ({ signal }) => tabelasAuxiliaresRepository.getAllTableValues('auxiliary/estados', {
		signal
	}),
})

const formattedAllStates = computed(() => {
	return (statesData.value ?? []).map(({ id, nome }) => ({ id, name: nome }))
})
</script>

<template>
	<div class="flex flex-col gap-4">
		<FormField v-slot="{ componentField }" name="name">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Nome</FormLabel>
				<FormControl>
					<Input :disabled="disabled" type="text" placeholder="Digite o nome..." class="col-span-3"
						v-bind="componentField" />
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="stateId">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Estado</FormLabel>
				<FormControl>
					<SelectRoot :disabled="disabled" v-bind="componentField">
						<SelectTrigger class="col-span-3">
							<SelectValue placeholder="Selecione o estado..." />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Estados:</SelectLabel>
								<SelectItem v-for="state of formattedAllStates" :key="state.id" :value="state.id.toString()">{{
									state.name }}</SelectItem>
							</SelectGroup>
						</SelectContent>
					</SelectRoot>
				</FormControl>
				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" name="ibgeCode">
			<FormItem class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
				<FormLabel class="text-right">Código IBGE</FormLabel>
				<FormControl>
					<Input :disabled="disabled" type="text" placeholder="Digite o código..." class="col-span-3"
						v-bind="componentField" />
				</FormControl>

				<FormMessage class="col-span-3 col-start-2" />
			</FormItem>
		</FormField>
	</div>
</template>