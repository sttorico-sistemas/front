<script lang="ts" setup>
import { inject, onMounted, ref, watch } from 'vue';
import titulo from 'src/core/components/Titulo.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconClose from 'src/core/components/Icons/IconClose.vue';
import { Emitter, EventType } from 'mitt';
import { TableValue } from 'src/modules/configuracoes/types/table_value.d';
import { tabelasAuxiliaresStore } from '@/modules/configuracoes/stores';
import AppSelectInput from 'src/core/components/Inputs/AppSelectInput.vue';
import FormField from 'src/core/components/FormField.vue';

const store = tabelasAuxiliaresStore();

const props = withDefaults(
	defineProps<{
		modelValue?: {
			tipoContatoId: number;
			telefone: string;
			celular: string;
			email: string;
		}[];
	}>(),
	{
		modelValue: () => [
			{
				tipoContatoId: 0,
				telefone: '',
				celular: '',
				email: '',
			},
		],
	},
);

const emit = defineEmits(['update:modelValue']);

const eventBus = inject<Emitter<Record<EventType, unknown>>>('eventBus');
const isDisabled = ref(false);

const contactTypes = ref<TableValue[]>([]);

const contacts = ref(props.modelValue);

const getContactTypeName = (index: number) => {
	const contact = contactTypes.value.find(
		(e) => e.id === contacts.value[index].tipoContatoId,
	);
	return contact?.nome;
};

const updateContactTypeId = (nome: string, index: number) => {
	const contact = contactTypes.value.find((e) => e.nome === nome);
	contacts.value[index].tipoContatoId = contact?.id ?? 0;
};

const addContato = () => {
	if (!contacts.value[0].celular.length && !contacts.value[0].email.length) {
		eventBus?.emit('alert', {
			type: 'danger',
			message: 'Preencha os campos obrigatórios!',
		});

		return false;
	}

	contacts.value.push({
		tipoContatoId: 0,
		telefone: '',
		celular: '',
		email: '',
	});
};

const removeContato = (index: number) => {
	if (contacts.value.length === 1) {
		eventBus?.emit('alert', {
			type: 'danger',
			message: 'Não foi possivel remover contato',
		});
		return false;
	}

	contacts.value.splice(index, 1);
};

onMounted(async () => {
	if (!props.modelValue.length) {
		contacts.value.push({
			tipoContatoId: 0,
			telefone: '',
			celular: '',
			email: '',
		});
	}
	isDisabled.value = true;
	const contactTypesResponse = await store.getValues('tipo-contato');
	contactTypes.value = contactTypesResponse;
	isDisabled.value = false;
});

watch(
	() => props.modelValue,
	(value) => {
		contacts.value = value;
	},
	{
		deep: true,
	},
);

watch(
	contacts,
	(value) => {
		emit('update:modelValue', value);
	},
	{
		deep: true,
	},
);
</script>

<template>
	<div class="panel my-3">
		<titulo title="Contatos" class="mb-6" />
		<div
			v-for="(contato, index) in contacts"
			:key="`contato-${index}`"
			class="flex-col md:flex-row flex gap-2.5 mb-3"
		>
			<app-select-input
				label="Tipo contato"
				:disabled="isDisabled"
				:model-value="getContactTypeName(index) ?? ''"
				@update:model-value="updateContactTypeId($event, index)"
				width="200px"
				:items="contactTypes.map((e) => e.nome)"
			/>
			<form-field
				v-model="contato.telefone"
				type="tel"
				label="Telefone"
				:disabled="isDisabled"
				max-width="150px"
				mask="tel"
			/>
			<form-field
				v-model="contato.celular"
				type="tel"
				label="Celular"
				:disabled="isDisabled"
				max-width="150px"
				mask="cel"
			/>
			<form-field
				v-model="contato.email"
				type="email"
				label="E-mail"
				:disabled="isDisabled"
				max-width="400px"
			/>
			<div class="flex items-center gap-1">
				<button v-tippy:right class="flex self-end mb-2" @click="addContato()">
					<icon-add />
				</button>
				<button class="flex self-end mb-2" @click="removeContato(index)">
					<icon-close />
				</button>
				<tippy target="right" placement="right">Cadastre um novo Contato</tippy>
			</div>
		</div>
	</div>
</template>
