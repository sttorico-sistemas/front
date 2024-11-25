<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import IconClear from 'src/core/components/Icons/IconClear.vue';
import CadastroEndereco from 'src/modules/consultas/components/CadastroEndereco.vue';
import AppSelectInput from 'src/core/components/Inputs/AppSelectInput.vue';
import { consignanteMasterStore as _consignanteMasterStore } from 'src/modules/consultas/stores/consignante_master.store';
import { tabelasAuxiliaresStore as _tabelasAuxiliaresStore } from 'src/modules/configuracoes/stores/auxiliary-table.store';
import { TabelasAuxiliaresRepository } from 'src/modules/configuracoes/repositories/tabelas_auxiliares.repository';
import { type TableValue } from 'src/modules/configuracoes/types';
import FormField from 'src/core/components/FormField.vue';
import AppButton from 'src/core/components/AppButton.vue';
import { consignanteStore } from '../../stores/consignante.store';

const emits = defineEmits(['btnSave', 'btnCancelar']);

const store = consignanteStore();

const loadingEntidades = ref(false);

const consignanteMaster = ref<string>('');
const entidades = ref<TableValue[]>([]);
const consignanteMasterStore = _consignanteMasterStore();
const tabelasAuxiliaresRepository = new TabelasAuxiliaresRepository();

onMounted(async () => {
	loadingEntidades.value = true;
	await consignanteMasterStore.getAllConsignantes();
	entidades.value =
		await tabelasAuxiliaresRepository.getAllTableValues('tipo-entidade');
	loadingEntidades.value = false;
});

const updateEntidadeId = (nome: string) => {
	store.updateEditingConsignante({
		tipoEntidadeId: entidades.value.find((e) => e.nome === nome)?.id,
	});
};

const updateConsignanteMasterId = (nome: string) => {
	store.updateEditingConsignante({
		consignanteMasterId: consignanteMasterStore.consignantesMaster.find(
			(e) => e.nome === nome,
		)?.id,
	});
};

const clearOption = () => (consignanteMaster.value = '');
</script>

<template>
	<main>
		<div
			class="panel mt-5 border border-primary_3-table flex items-center md:gap-12"
		>
			<label
				for="consignante_master"
				class="text-sm md:text-base text-primary_3-table m-0"
				>Consignante Master</label
			>
			<div class="flex items-center gap-6">
				<app-select-input
					:model-value="
						consignanteMasterStore.consignantesMaster.find(
							(e) => e.id === store.editingConsignante.consignanteMasterId,
						)?.nome
					"
					@update:model-value="updateConsignanteMasterId"
					width="500px"
					placeholder="Selecione uma opção"
					:disabled="consignanteMasterStore.loadingConsignantesMaster"
					:items="consignanteMasterStore.consignantesMaster.map((e) => e.nome)"
				/>
				<button @click="clearOption">
					<icon-clear class="w-5 h-5 text-primary_3-table" />
				</button>
			</div>
		</div>

		<div class="panel border mt-5 border-primary_3-table">
			<h3 class="text-base font-semibold text-primary_3-table mb-7">
				Consignante
			</h3>

			<div class="flex flex-col md:flex-row items-center mb-3">
				<label
					for="cnpj"
					class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left"
					v-text="'CNPJ'"
				/>
				<form-field
					mask="cnpj"
					:model-value="store.editingConsignante.cnpj"
					@update:model-value="store.updateEditingConsignante({ cnpj: $event })"
				/>

				<label
					for="tipo_entidade"
					class="mb-0 md:ml-3 md:mr-2 w-full md:w-auto text-sm text-left"
					v-text="'Tipo de Entidade'"
				/>
				<app-select-input
					:items="entidades.map((e) => e.nome)"
					:model-value="
						entidades.find(
							(e) => e.id === store.editingConsignante.tipoEntidadeId,
						)?.nome ?? '---'
					"
					@update:model-value="updateEntidadeId"
					min-width="250px"
				/>
			</div>

			<div class="flex flex-col md:flex-row items-center mb-3">
				<label
					for="nome"
					class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left"
					v-text="'Nome'"
				/>
				<form-field
					id="nome"
					:model-value="store.editingConsignante.nome"
					@update:model-value="store.updateEditingConsignante({ nome: $event })"
					:max-width="{ md: '420px' }"
				/>
			</div>
			<div class="flex flex-col md:flex-row items-center mb-5">
				<label
					for="nome_curto"
					class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left"
					v-text="'Nome curto'"
				/>
				<form-field
					:model-value="store.editingConsignante.nomeCurto"
					@update:model-value="
						store.updateEditingConsignante({ nomeCurto: $event })
					"
					id="nome_curto"
					:max-width="{ md: '250px' }"
				/>
			</div>
			<cadastro-endereco
				:model-value="store.editingConsignante.enderecos"
				@update:model-value="
					store.updateEditingConsignante({ enderecos: $event })
				"
				flat
				:show-title="false"
				class="my-3"
			/>

			<div class="flex flex-col md:flex-row items-center mb-3">
				<label
					for="expediente"
					class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left"
					v-text="'Expediente'"
				/>
				<form-field
					id="expediente"
					class="mb-3 md:mb-0"
					:model-value="store.editingConsignante.expediente.de"
					@update:model-value="
						store.updateEditingConsignante({
							expediente: {
								de: $event,
								ate: store.editingConsignante.expediente.ate,
							},
						})
					"
					:mask="{
						custom: '##:##',
					}"
					:max-width="{ md: '80px' }"
					height="38px"
				/>

				<label for="ate" class="mb-0 md:mx-2 w-full md:w-auto text-sm text-left"
					>Até</label
				>
				<form-field
					id="ate"
					:model-value="store.editingConsignante.expediente.ate"
					@update:model-value="
						store.updateEditingConsignante({
							expediente: {
								de: store.editingConsignante.expediente.de,
								ate: $event,
							},
						})
					"
					class="mb-3 md:mb-0"
					:mask="{
						custom: '##:##',
					}"
					:max-width="{ md: '80px' }"
					height="38px"
				/>
			</div>

			<div class="flex justify-center items-center gap-12 mt-8">
				<app-button
					variant="outlined"
					density="comfortable"
					width="86px"
					@click="store.toggleEditor()"
					:disabled="store.saving"
					>Cancelar</app-button
				>
				<app-button
					density="comfortable"
					width="86px"
					@click="store.saveConsignante()"
					:loading="store.saving"
					>Salvar</app-button
				>
			</div>
		</div>
	</main>
</template>
