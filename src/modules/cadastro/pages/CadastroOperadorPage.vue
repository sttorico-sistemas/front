<script lang="ts" setup>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

import breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import titulo from 'src/core/components/Titulo.vue';
import LabelInput from 'src/core/components/Inputs/InputLabel.vue';

// Estados
const isDisabled = ref(true);
const tipoOperadores = ref<Array<{ id: number; nome: string; permissao: number[] }>>([]);
const permissions = ref<Array<{ id: number; related_name: string }>>([]);
const perfilSelect = ref<number | null>(null);
const selectedPermissions = ref<number[]>([]);
const showDropdown = ref(false);

// Estados para busca de CPF
const cpf = ref<string>('');
const nome = ref<string>('');
const options = ref<Array<{ id: number; label: string; nome: string }>>([]);
const pessoaId = ref<number | null>(null);

// Computed para carregar permissões do operador selecionado
const operadorPermissoes = computed(() => {
  const operadorSelecionado = tipoOperadores.value.find(option => option.id === perfilSelect.value);
  return operadorSelecionado ? operadorSelecionado.permissao : [];
});

// Watcher para atualizar permissões ao selecionar um perfil de operador
watch(perfilSelect, (newPerfilId) => {
  const perfil = tipoOperadores.value.find(option => option.id === newPerfilId);
  if (perfil) {
    selectedPermissions.value = [...perfil.permissao];
  } else {
    selectedPermissions.value = [];
  }
});

// Função para buscar pessoas pelo CPF
async function searchCPF() {
  if (cpf.value.length < 3) {
    showDropdown.value = false;
    return;
  }

  try {
    const response = await axios.get(`https://dev-02-apiv2.management.infoconsig.tec.br/api/pessoa/search?cpf=${cpf.value}`);
    options.value = response.data.map((item: any) => ({
      id: item.id,
      label: `${item.nome} - ${item.cpf}`,
      nome: item.nome,
    }));
    showDropdown.value = true;
  } catch (error) {
    console.error('Erro ao buscar CPF:', error);
    showDropdown.value = false;
  }
}

// Função para selecionar CPF e preencher o campo "Nome"
function selectCPF(option: { id: number; label: string; nome: string }) {
  nome.value = option.nome;
  pessoaId.value = option.id;
  cpf.value = option.label.split(' - ')[1]; // Atualiza o CPF com base na seleção
  showDropdown.value = false;
}

// Carregar perfis do operador
async function loadTipoOperadores() {
  try {
    const response = await axios.get('https://dev-02-apiv2.management.infoconsig.tec.br/api/profile/tipo-operador');
    tipoOperadores.value = response.data.data.map((item: any) => ({
      id: item.id,
      nome: item.name,
      permissao: item.permissions.map((p: any) => p.id) || [],
    }));
  } catch (error) {
    console.error('Erro ao carregar tipos de operador:', error);
  }
}

// Carregar todas as permissões
async function loadPermissions() {
  try {
    const response = await axios.get('https://dev-02-apiv2.management.infoconsig.tec.br/api/profile/permissions');
    permissions.value = response.data.map((item: any) => ({
      id: item.id,
      related_name: item.related_name || 'Desconhecido',
    }));
  } catch (error) {
    console.error('Erro ao carregar permissões:', error);
  }
}

// Salvar permissões selecionadas para o operador
async function savePermissions() {
  if (!pessoaId.value || !perfilSelect.value) {
    alert('Selecione uma pessoa e um perfil de operador antes de salvar.');
    return;
  }

  try {
    await axios.post('https://dev-02-apiv2.management.infoconsig.tec.br/api/permissao', {
      pessoa_id: pessoaId.value,
      tipo_operador_id: perfilSelect.value,
      permissoes: selectedPermissions.value,
    });
    alert('Permissões salvas com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar permissões:', error);
    alert('Erro ao salvar permissões.');
  }
}

// Inicialização
onMounted(() => {
  loadTipoOperadores();
  loadPermissions();
});
</script>
<template>
  <main>
    <breadcrumbs :paginas="['Configurações', 'Permissões']" />
    <div class="panel mt-6">
      <div class="flex items-center gap-14">
        <titulo title="Gerenciar Permissões do Operador" />
      </div>

      <!-- Busca por CPF -->
      <div class="flex flex-col md:flex-row gap-5 mt-3">
        <div>
          <label for="cpf" class="text-sm">Digite o nº do CPF</label>
          <input
            id="cpf"
            v-model="cpf"
            @input="searchCPF"
            placeholder="Digite o nº do CPF"
            class="border border-gray-300 p-2 md:w-[300px]"
            type="text"
          />
          <div
            v-if="showDropdown"
            class="absolute bg-white border border-gray-300 mt-1 w-full md:w-[300px] z-10 rounded-md shadow-md"
          >
            <ul>
              <li
                v-for="option in options"
                :key="option.id"
                @click="selectCPF(option)"
                class="p-2 cursor-pointer hover:bg-gray-100"
              >
                {{ option.label }}
              </li>
            </ul>
          </div>
        </div>

        <label-input
          id="nome"
          v-model="nome"
          label="Nome"
          :disabled="true"
          class-label="text-sm"
          class-input="md:w-[400px]"
          layout="row"
        />
      </div>

      <!-- Seleção de Perfil -->
      <div class="flex flex-col md:flex-row gap-5 mt-3">
        <div>
          <label for="perfil_operador" class="text-sm">Selecione Perfil do Operador</label>
          <select id="perfil_operador" v-model="perfilSelect" class="p-2 border border-gray-300 md:w-[300px]">
            <option value="" disabled>Selecione um perfil</option>
            <option v-for="option in tipoOperadores" :key="option.id" :value="option.id">
              {{ option.nome }}
            </option>
          </select>
        </div>
      </div>

      <!-- Lista de Permissões -->
      <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#fff] p-4">
        <h2 class="text-lg font-semibold mb-4">Permissões Disponíveis</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left border-b p-2">Permissão</th>
              <th class="text-left border-b p-2">Selecionar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="permission in permissions" :key="permission.id">
              <td class="p-2 border-b">{{ permission.related_name }}</td>
              <td class="p-2 border-b">
                <input
                  type="checkbox"
                  :value="permission.id"
                  v-model="selectedPermissions"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botão para salvar -->
      <div class="flex justify-center mt-6">
        <button @click="savePermissions" class="btn bg-primary_3-table text-white text-xs">
          Salvar Permissões
        </button>
      </div>
    </div>
  </main>
</template>
