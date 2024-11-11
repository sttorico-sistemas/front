<script lang="ts" setup>
import { ref } from 'vue';
import titulo from 'src/core/components/Titulo.vue';
import IconEdit from 'src/core/components/Icons/IconEdit.vue';
import CadastroEndereco from '../CadastroEndereco.vue';
import CadastroContato from '../CadastroContato.vue';
import { pessoaStore } from '../../stores/pessoa.store';
import FormField from 'src/core/components/FormField.vue';
import AppButton from 'src/core/components/AppButton.vue';
import AppDialog from 'src/core/components/AppDialog.vue';
import CircularProgress from 'src/core/components/CircularProgress.vue';

const props = withDefaults(
	defineProps<{
		disabled?: boolean;
	}>(),
	{
		disabled: true,
	},
);

const store = pessoaStore();

const isDisabled = ref(props.disabled || store.fetchingPessoa);
</script>

<template>
	<app-dialog
		max-width="100%"
		@update:model-value="store.toggleEditor($event)"
		:model-value="store.showEditor"
	>
		<div class="panel mt-5 border border-primary_3-table">
			<div class="flex items-center gap-14 mb-6">
				<titulo title="Cadastro Pessoa" />
				<button v-if="props.disabled" @click="isDisabled = false" v-tippy:right>
					<icon-edit />
				</button>
				<tippy v-if="props.disabled" target="right" placement="right"
					>Editar cadastro</tippy
				>
			</div>

			<div class="panel">
				<titulo title="Dados da Pessoa" class="mb-6" />
				<div class="flex flex-col md:flex-row gap-2.5">
					<form-field
						mask="cpf"
						:disabled="isDisabled"
						:model-value="store.editingPessoa.cpf"
						@update:model-value="store.updateEditingPessoa({ cpf: $event })"
						max-width="150px"
						label="CPF"
					/>
					<form-field
						:disabled="isDisabled"
						:model-value="store.editingPessoa.nome"
						@update:model-value="store.updateEditingPessoa({ nome: $event })"
						min-width="400px"
						label="Nome"
					/>
					<form-field
						:disabled="isDisabled"
						:model-value="store.editingPessoa.tpVinculo"
						@update:model-value="
							store.updateEditingPessoa({ tpVinculo: $event })
						"
						max-width="200px"
						label="Vínculo"
					/>
					<form-field
						:disabled="isDisabled"
						:model-value="store.editingPessoa.contratante"
						@update:model-value="
							store.updateEditingPessoa({ contratante: $event })
						"
						width="300px"
						label="Contratante"
					/>
					<form-field
						:disabled="isDisabled"
						label="Data de nascimento"
						:model-value="store.editingPessoa.dtNasc"
						@update:model-value="store.updateEditingPessoa({ dtNasc: $event })"
						max-width="150px"
						:mask="{
							custom: '##/##/####',
						}"
					/>
				</div>
			</div>

			<cadastro-contato
				v-if="!store.fetchingPessoa"
				:model-value="store.editingPessoa.contatos"
				@update:model-value="store.updateEditingPessoa({ contatos: $event })"
			/>
			<cadastro-endereco
				v-if="!store.fetchingPessoa"
				:model-value="store.editingPessoa.enderecos"
				@update:model-value="store.updateEditingPessoa({ enderecos: $event })"
			/>
			<div class="flex justify-center mt-8" v-else>
				<circular-progress :size="40" />
			</div>

			<div class="flex justify-center items-center gap-12 mt-8">
				<app-button
					width="86px"
					density="comfortable"
					variant="outlined"
					:disabled="store.saving"
					@click="store.toggleEditor()"
				>
					Cancelar
				</app-button>
				<app-button
					width="86px"
					density="comfortable"
					:loading="store.saving"
					@click="store.savePerson()"
				>
					Salvar
				</app-button>
			</div>
		</div>
	</app-dialog>
</template>
