<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits, nextTick } from 'vue';
import InputLabel from 'src/core/components/Inputs/InputLabel.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';

// Define o jQuery globalmente para que o select2 funcione corretamente
if (typeof window !== 'undefined') {
  window.$ = $;
}

const props = defineProps<{
  paginas: Array<{ id: number; nome: string; slug: string }>
}>();

const selectedPage = ref<string>('');
const nomePagina = ref<string>(''); // Campo para o nome da página
const urlPagina = ref<string>(''); // Campo para a URL da página
const select2Ref = ref<HTMLElement | null>(null);
const emits = defineEmits(['btnSave', 'btnCancelar']);

// Lista para armazenar os campos dinamicamente
const components = ref<Array<{ id: number; value: string }>>([]);
let idCounter = 1; // Contador para gerar IDs únicos para cada campo

// Função para adicionar um novo campo de entrada
const addComponentInput = () => {
  components.value.push({ id: idCounter++, value: '' });
};

// Função para remover um campo pelo ID
const removeComponentInput = (id: number) => {
  components.value = components.value.filter(component => component.id !== id);
};

// Função para emitir o evento de salvar e enviar dados para a API
const saveComponents = async () => {
  const pageData = {
    nome: nomePagina.value,
    url: urlPagina.value,
    pagina_principal: selectedPage.value,
    componentes: components.value.map(component => component.value),
  };

  try {
    const response = await fetch('https://dev-02-apiv2.management.infoconsig.tec.br/api/paginas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(pageData),
    });

    if (response.ok) {
      Swal.fire({
        title: 'Sucesso!',
        text: 'Ação concluída com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      emits('btnSave', components.value);
    } else {
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um problema ao enviar os dados.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Erro!',
      text: 'Ocorreu um erro ao tentar enviar os dados.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

// Função para emitir o evento de cancelar
const cancelComponents = () => {
  emits('btnCancelar');
};

// Inicialize o Select2 após o componente estar montado
onMounted(async () => {
  await nextTick(); // Aguarda até que o DOM seja completamente carregado
  if (select2Ref.value) {
    $(select2Ref.value).select2();
    $(select2Ref.value).on('change', () => {
      selectedPage.value = $(select2Ref.value).val() as string;
    });
  }
});

onBeforeUnmount(() => {
  // Destroi o select2 ao desmontar o componente
  if (select2Ref.value) {
    $(select2Ref.value).select2('destroy');
  }
});

// Observa mudanças em selectedPage para sincronizar com select2
watch(selectedPage, (newVal) => {
  if (select2Ref.value) {
    $(select2Ref.value).val(newVal).trigger('change');
  }
});
</script>

<template>
  <div>
    <InputLabel
      v-model="nomePagina"
      type="text"
      id="nome"
      label="Digite o nome da página"
      class-label="text-sm"
      class-input="md:w-[300px]"
      layout="row"
    />
  </div>
  <div>
    <InputLabel
      v-model="urlPagina"
      type="text"
      id="url"
      label="Digite a URL da página"
      class-label="text-sm"
      class-input="md:w-[300px]"
      layout="row"
    />
  </div>

  <div>
    <label for="pagina">Página Principal</label>
    <select ref="select2Ref" v-model="selectedPage" class="w-64 h-10">
      <option v-for="page in props.paginas" :key="page.id" :value="page.nome">
        {{ page.nome }}
      </option>
    </select>
  </div>

  <!-- Botão para adicionar novos campos -->
  <div class="flex items-center space-x-2 mt-4">
    <button @click="addComponentInput" class="flex items-center space-x-2 text-blue-500">
      <IconAdd />
      <span>Adicionar Componente</span>
    </button>
  </div>

  <!-- Renderização dinâmica dos campos de entrada -->
  <div v-for="component in components" :key="component.id" class="flex items-center space-x-2 mt-2">
    <InputLabel
      v-model="component.value"
      type="text"
      :id="'nome-' + component.id"
      label="Digite o nome do componente"
      class-label="text-sm"
      class-input="md:w-[300px]"
      layout="row"
    />
    <button @click="removeComponentInput(component.id)" class="text-red-500 text-sm">
      Remover
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
