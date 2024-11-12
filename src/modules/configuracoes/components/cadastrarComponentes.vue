<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import InputLabel from 'src/core/components/Inputs/InputLabel.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import Swal from 'sweetalert2';

const props = defineProps<{
  componentes: Array<{ id: number; nome: string; slug: string }>,
  pageId: number | null,
}>();

const selectedPage = ref<number | null>(props.pageId);

// Observa mudanças em `props.pageId` e atualiza `selectedPage` caso ele não tenha sido definido inicialmente
watch(
  () => props.pageId,
  (newPageId) => {
    if (selectedPage.value === null && newPageId !== null) {
      selectedPage.value = newPageId;
    }
  },
  { immediate: true }
);

const emits = defineEmits<{
  (e: 'btnSave', componentes: Array<{ id: number | null; nome: string; status: string }>): void;
  (e: 'btnCancelar'): void;
}>();

// Lista inicial com os componentes existentes
const components = ref<Array<{ id: number | null; key: number; value: string; isRemoved: boolean }>>([]);

// Observa mudanças em `props.componentes` e atualiza `components`
watch(
  () => props.componentes,
  (newComponents) => {
    components.value = newComponents.map(component => ({
      id: component.id,
      key: component.id || Date.now(), // usa o ID existente ou um timestamp como chave
      value: component.nome,
      isRemoved: false,
    }));
  },
  { immediate: true }
);

// Função para adicionar um novo campo de entrada
const addComponentInput = () => {
  components.value.push({ id: null, key: Date.now(), value: '', isRemoved: false }); // id é null para novos componentes
};

// Função para marcar um campo como removido pelo ID
const removeComponentInput = (id: number | null) => {
  const component = components.value.find(c => c.id === id);
  if (component) component.isRemoved = !component.isRemoved; // Alterna entre remover e restaurar
};

// Função para emitir o evento de salvar e enviar dados para a API
const saveComponents = async () => {
  const pageData = {
    pageId: selectedPage.value,
    componentes: components.value.map(component => ({
      id: component.id,
      nome: component.value,
      status: component.isRemoved ? 'removed' : (component.id ? 'existing' : 'added') // Define o status com base no ID
    }))
  };

  try {
    const response = await fetch('https://dev-02-apiv2.management.infoconsig.tec.br/api/componentes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(pageData),
    });

    if (response.ok) {
      Swal.fire('Sucesso!', 'Ação concluída com sucesso.', 'success');
      emits('btnSave', pageData.componentes);
    } else {
      Swal.fire('Erro!', 'Ocorreu um problema ao enviar os dados.', 'error');
    }
  } catch (error) {
    Swal.fire('Erro!', 'Ocorreu um erro ao tentar enviar os dados.', 'error');
  }
};

// Função para emitir o evento de cancelar
const cancelComponents = () => {
  emits('btnCancelar');
};
</script>

<template>
  <!-- Botão para adicionar novos campos -->
  <div class="flex items-center space-x-2 mt-4">
    <button @click="addComponentInput" class="flex items-center space-x-2 text-blue-500">
      <IconAdd />
      <span>Adicionar Componente</span>
    </button>
  </div>

  <!-- Renderização dinâmica dos campos de entrada com controle de remoção -->
  <div v-for="component in components" :key="component.key" class="flex items-center space-x-2 mt-2">
    <InputLabel
      v-model="component.value"
      type="text"
      :id="'nome-' + (component.id ?? `new-${component.key}`)"
      label="Digite o nome do componente"
      class-label="text-sm"
      class-input="md:w-[300px]"
      layout="row"
      v-show="!component.isRemoved"
    />
    <button @click="removeComponentInput(component.id)" class="text-red-500 text-sm">
      {{ component.isRemoved ? 'Restaurar' : 'Remover' }}
    </button>
  </div>

  <!-- Botões de Cadastrar e Cancelar -->
  <div class="flex items-center space-x-4 mt-6">
    <button @click="saveComponents" class="px-4 py-2 bg-blue-500 text-white rounded">
      Cadastrar
    </button>
    <button @click="cancelComponents" class="px-4 py-2 bg-gray-300 text-black rounded">
      Cancelar
    </button>
  </div>
</template>
