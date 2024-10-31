<script lang="ts" setup>
import { inject, onMounted, ref, watch } from 'vue';
import titulo from 'src/core/components/Titulo.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconClose from 'src/core/components/Icons/IconClose.vue';
import { Emitter, EventType } from 'mitt';
import { tabelasAuxiliaresStore as _tabelasAuxiliaresStore } from 'src/modules/configuracoes/stores/tabelas_auxiliares.store';
import { TableValue } from 'src/modules/configuracoes/types/table_value.d';
import AppSelectInput from 'src/core/components/Inputs/AppSelectInput.vue';
import FormField from 'src/core/components/FormField.vue';
import { Estado, EstadoUf } from '../types/estado.d';
import { localizacaoStore as _localizacaoStore } from '../stores/localizacao.store';

const props = withDefaults(
	defineProps<{
		flat?: boolean;
		showTitle?: boolean;
		modelValue?: {
			tipoEndereco: string;
			endereco: string;
			cidade: string;
			loadingCidades: boolean;
			uf?: EstadoUf;
		}[];
	}>(),
	{
		flat: false,
		showTitle: true,
		modelValue: () => [
			{
				endereco: '',
				tipoEndereco: '',
				loadingCidades: false,
				cidade: '',
			},
		],
	},
);

const emit = defineEmits(['update:modelValue']);

const tabelasAuxiliaresStore = _tabelasAuxiliaresStore();
const localizacaoStore = _localizacaoStore();

const eventBus = inject<Emitter<Record<EventType, unknown>>>('eventBus');
const isDisabled = ref(true);

const addressTypes = ref<TableValue[]>([]);
const states = ref<Estado[]>([]);

const addresses = ref(Array.from(props.modelValue));

const addAddress = () => {
	if (addresses.value.length >= 3) {
		eventBus?.emit('alert', {
			type: 'danger',
			message: 'Limite máximo de contato é de 3',
		});
		return false;
	}

	const lastAddress = addresses.value[addresses.value.length - 1];

	if (!lastAddress.endereco || !lastAddress.cidade) {
		eventBus?.emit('alert', {
			type: 'danger',
			message: 'Preencha os campos obrigatórios!',
		});
		return false;
	}

	addresses.value.push({
		tipoEndereco: '',
		endereco: '',
		cidade: '',
		loadingCidades: false,
	});
};

const removeAddress = (index: number) => {
	if (addresses.value.length === 1) {
		eventBus?.emit('alert', {
			type: 'danger',
			message: 'Não foi possível remover contato',
		});
		return false;
	}

	addresses.value.splice(index, 1);
};

const loadCities = async (stateUf?: EstadoUf) => {
	const state = states.value.find((e) => e.uf === stateUf);
	if (state) {
		const address = addresses.value.find((e) => e.uf === state.uf);
		address!.loadingCidades = true;
		await localizacaoStore.getStateCitites(state.id);
		address!.loadingCidades = false;
	}
};

onMounted(async () => {
	if (!props.modelValue.length) {
		addresses.value.push({
			endereco: '',
			tipoEndereco: '',
			loadingCidades: false,
			cidade: '',
		});
	}
	isDisabled.value = true;
	addressTypes.value = await tabelasAuxiliaresStore.getValues('tipo-endereco');
	states.value = await localizacaoStore.getStates();
	isDisabled.value = false;
});

watch(
	() => props.modelValue,
	(value) => {
		addresses.value = value;
	},
	{
		deep: true,
	},
);

watch(
	addresses,
	(value) => {
		emit('update:modelValue', value);
	},
	{
		deep: true,
	},
);
</script>

<template>
	<div :class="flat ? '' : 'panel my-3'">
		<titulo v-if="showTitle" title="Endereços" class="mb-6" />
		<div
			v-for="(address, index) in addresses"
			:key="`endereco-${index}`"
			class="flex flex-wrap gap-4 w-full my-3"
		>
			<app-select-input
				v-model="address.addressType"
				label="Tipo Endereço"
				:disabled="isDisabled"
				width="100px"
				:items="addressTypes.map((e) => e.nome)"
			/>
			<form-field
				v-model="address.address"
				label="Endereço"
				:disabled="isDisabled"
			></form-field>
			<app-select-input
				v-model="address.uf"
				:items="states.map((e) => e.uf)"
				:disabled="isDisabled"
				label="UF"
				density="comfortable"
				width="100px"
				@update:model-value="loadCities(address.uf)"
			/>
			<app-select-input
				v-model="address.city"
				width="180px"
				label="Cidade"
				:disabled="
					!address.uf ||
					isDisabled ||
					address.loadingCidades ||
					!localizacaoStore.cities[address.uf as EstadoUf]?.length
				"
				:items="
					address.uf
						? localizacaoStore.cities[address.uf as EstadoUf]?.map(
								(e) => e.nome,
							)
						: []
				"
			/>
			<div class="flex items-center gap-2 w-full md:w-auto">
				<button
					v-if="index === addresses.length - 1"
					v-tippy:right
					class="flex self-end"
					@click="addAddress()"
				>
					<icon-add />
				</button>
				<button class="flex self-end" @click="removeAddress(index)">
					<icon-close />
				</button>
			</div>
		</div>
	</div>
</template>
