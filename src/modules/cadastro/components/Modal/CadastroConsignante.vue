<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import LabelInput from 'src/core/components/Inputs/InputLabel.vue';
import IconClear from 'src/core/components/Icons/IconClear.vue';
import CadastroEndereco from 'src/modules/consultas/components/CadastroEndereco.vue';
import AppSelectInput from 'src/core/components/Inputs/AppSelectInput.vue';
import { consignanteMasterStore as _consignanteMasterStore } from 'src/modules/consultas/stores/consignante_master.store';
import { tabelasAuxiliaresStore as _tabelasAuxiliaresStore } from 'src/modules/configuracoes/stores/tabelas_auxiliares.store';
import { TabelasAuxiliaresRepository } from 'src/modules/configuracoes/repositories/tabelas_auxiliares.repository';
import { TableValue } from 'src/modules/configuracoes/types/table_value';

const emits = defineEmits(['btnSave', 'btnCancelar']);

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
					v-model="consignanteMaster"
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
				Consignante Master
			</h3>

			<div class="flex flex-col md:flex-row items-center mb-3">
				<label for="cnpj" class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left"
					>CNPJ</label
				>
				<input
					id="cnpj"
					type="text"
					class="form-input mb-3 md:mb-0 md:max-w-[200px] h-[38px]"
				/>

				<label
					for="tipo_entidade"
					class="mb-0 md:ml-3 md:mr-2 w-full md:w-auto text-sm text-left"
					>Tipo de Entidade</label
				>
				<app-select-input
					:items="entidades.map((e) => e.nome)"
					min-width="250px"
				/>
			</div>

			<label-input
				id="nome"
				label="Nome"
				class-label="text-sm"
				class-input="md:max-w-[420px]"
				layout="col"
			/>
			<label-input
				id="nome_curto"
				label="Nome curto"
				class-label="text-sm"
				class-input="md:max-w-[250px]"
				layout="col"
			/>
			<cadastro-endereco
				flat
				:show-title="false"
				class="my-3"
			></cadastro-endereco>

			<div class="flex flex-col md:flex-row items-center mb-3">
				<label
					for="expediente"
					class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left"
					>Expediente</label
				>
				<input
					id="expediente"
					type="text"
					class="form-input mb-3 md:mb-0 md:max-w-[80px] h-[38px]"
				/>

				<label for="ate" class="mb-0 md:mx-2 w-full md:w-auto text-sm text-left"
					>Até</label
				>
				<input
					id="ate"
					type="text"
					class="form-input md:max-w-[80px] h-[38px]"
				/>
			</div>

			<div class="flex justify-center items-center gap-12 mt-8">
				<button
					type="button"
					class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
					@click="emits('btnCancelar', false)"
				>
					Cancelar
				</button>
				<button
					type="button"
					class="w-[86px] btn bg-primary_3-table text-white text-xs"
				>
					Salvar
				</button>
			</div>
		</div>
	</main>
</template>
