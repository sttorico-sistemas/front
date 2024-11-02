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
import { Endereco } from '../types/endereco';
import { pessoaStore as _pessoaStore } from '../stores/pessoa.store';

interface IEndereco extends Endereco {
	loadingCidades?: boolean;
	tipoEndereco?: string;
}

const props = withDefaults(
	defineProps<{
		flat?: boolean;
		showTitle?: boolean;
		modelValue?: IEndereco[];
	}>(),
	{
		flat: false,
		showTitle: true,
		modelValue: () => [
			{
				id: 0,
				cep: '',
				cidade: {
					id: 0,
					nome: '',
					estadoId: 0,
					estado: {
						id: 0,
						ibgeId: 0,
						nome: '',
						uf: 'RO',
						updatedAt: new Date(),
						createdAt: new Date(),
					},
					ibgeId: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				logradouro: '',
				tipoEnderecoId: 0,
				cidadeId: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
				loadingCidades: false,
				tipoEndereco: '',
			},
		],
	},
);

const emit = defineEmits(['update:modelValue']);

const tabelasAuxiliaresStore = _tabelasAuxiliaresStore();
const localizacaoStore = _localizacaoStore();
const pessoaStore = _pessoaStore();

const eventBus = inject<Emitter<Record<EventType, unknown>>>('eventBus');
const isDisabled = ref(true);

const addressTypes = ref<TableValue[]>([]);
const states = ref<Estado[]>([]);

const addresses = ref<
	{
		id?: number;
		tipoEndereco: string;
		logradouro: string;
		uf: EstadoUf;
		cidade: string;
		loadingCidades: boolean;
	}[]
>(
	props.modelValue.map((e) => ({
		id: e.id,
		tipoEndereco:
			pessoaStore.tipoEnderecos.find(
				(tipoEndereco) => tipoEndereco.id == e.tipoEnderecoId,
			)?.nome ?? '',
		logradouro: e.logradouro,
		uf: e.cidade.estado?.uf ?? 'RO',
		cidade: e.cidade.nome,
		loadingCidades: false,
	})),
);

const addAddress = () => {
	const lastAddress = addresses.value[addresses.value.length - 1];

	if (!lastAddress.logradouro || !lastAddress.cidade) {
		eventBus?.emit('alert', {
			type: 'danger',
			message: 'Preencha os campos obrigatórios!',
		});
		return false;
	}

	addresses.value.push({
		cidade: '',
		logradouro: '',
		tipoEndereco: '',
		uf: 'RO',
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
			cidade: '',
			logradouro: '',
			tipoEndereco: '',
			uf: 'RO',
			loadingCidades: false,
		});
	}
	isDisabled.value = true;
	addressTypes.value = await tabelasAuxiliaresStore.getValues('tipo-endereco');
	states.value = await localizacaoStore.getStates();
	loadCities('RO');
	isDisabled.value = false;
});

watch(
	() => props.modelValue,
	(value) => {
		addresses.value = value.map((e) => ({
			id: e.id,
			cidade: e.cidade.nome,
			logradouro: e.logradouro,
			tipoEndereco:
				pessoaStore.tipoEnderecos.find(
					(tipoEndereco) => e.tipoEnderecoId == tipoEndereco.id,
				)?.nome ?? '',
			uf: e.cidade.estado?.uf ?? 'RO',
			loadingCidades: false,
		}));
	},
	{
		deep: true,
	},
);

const updateEndereco = () => {
	emit(
		'update:modelValue',
		addresses.value.map((e): Endereco => {
			const currentEndereco = props.modelValue.find(
				(endereco) => endereco.id === e.id,
			);
			const updatedCidade = localizacaoStore.cities[e.uf]?.find(
				(city) => city.nome === e.cidade,
			);
			// TODO UF não está sendo alterado pois updatedCidade está vazio.
			console.log(updatedCidade);

			return {
				id: currentEndereco?.id ?? 0,
				cep: currentEndereco?.cep ?? '',
				cidade: {
					id: updatedCidade?.id ?? currentEndereco?.cidade.id ?? 0,
					nome: updatedCidade?.nome ?? currentEndereco?.cidade.nome ?? '',
					estadoId:
						updatedCidade?.estadoId ?? currentEndereco?.cidade.estadoId ?? 0,
					estado: {
						id:
							updatedCidade?.estado?.id ??
							currentEndereco?.cidade.estado?.id ??
							0,
						nome:
							updatedCidade?.estado?.nome ??
							currentEndereco?.cidade.estado?.nome ??
							'',
						uf:
							updatedCidade?.estado?.uf ??
							currentEndereco?.cidade.estado?.uf ??
							'RO',
						ibgeId:
							updatedCidade?.estado?.ibgeId ??
							currentEndereco?.cidade.estado?.ibgeId ??
							0,
						createdAt:
							updatedCidade?.estado?.createdAt ??
							currentEndereco?.cidade.estado?.createdAt ??
							new Date(),
						updatedAt:
							updatedCidade?.estado?.updatedAt ??
							currentEndereco?.cidade.estado?.updatedAt ??
							new Date(),
						deletedAt:
							updatedCidade?.estado?.deletedAt ??
							currentEndereco?.cidade.estado?.deletedAt ??
							new Date(),
					},
					ibgeId: updatedCidade?.ibgeId ?? currentEndereco?.cidade.ibgeId ?? 0,
					createdAt:
						updatedCidade?.createdAt ??
						currentEndereco?.cidade.createdAt ??
						new Date(),
					updatedAt:
						updatedCidade?.updatedAt ??
						currentEndereco?.cidade.updatedAt ??
						new Date(),
					deletedAt:
						updatedCidade?.deletedAt ??
						currentEndereco?.cidade.deletedAt ??
						new Date(),
				},
				cidadeId: updatedCidade?.id ?? currentEndereco?.cidadeId ?? 0,
				tipoEnderecoId:
					pessoaStore.tipoEnderecos.find(
						(tipoEndereco) => tipoEndereco.nome === e.tipoEndereco,
					)?.id ??
					currentEndereco?.tipoEnderecoId ??
					0,
				logradouro: e.logradouro,
				createdAt: currentEndereco?.createdAt ?? new Date(),
				updatedAt: currentEndereco?.updatedAt ?? new Date(),
				deletedAt: currentEndereco?.deletedAt,
			};
		}),
	);
};
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
				v-model="address.tipoEndereco"
				label="Tipo Endereço"
				:disabled="isDisabled"
				width="100px"
				:items="addressTypes.map((e) => e.nome)"
				@update:model-value="updateEndereco"
			/>
			<form-field
				v-model="address.logradouro"
				label="Endereço"
				:disabled="isDisabled"
				@update:model-value="updateEndereco"
			></form-field>
			<app-select-input
				v-model="address.uf"
				:items="states.map((e) => e.uf)"
				:disabled="isDisabled"
				label="UF"
				density="comfortable"
				width="100px"
				@update:model-value="updateEndereco()"
			/>
			<app-select-input
				v-model="address.cidade"
				width="180px"
				label="Cidade"
				@update:model-value="updateEndereco"
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
					@update:model-value="updateEndereco"
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
