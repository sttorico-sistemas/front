<template>
  <div>
    <h2>{{ isEditing ? 'Editar Página' : 'Cadastrar Página' }}</h2>

    <!-- Nome da Página -->
    <InputLabel
      v-model="formData.nome"
      type="text"
      id="nome"
      label="Nome da Página"
      class-label="text-sm"
      class-input="md:w-[300px]"
      layout="row"
    />

    <!-- URL da Página -->
    <InputLabel
      v-model="formData.url"
      type="text"
      id="url"
      label="URL da Página"
      class-label="text-sm"
      class-input="md:w-[300px]"
      layout="row"
    />

    <!-- Página Pai -->
    <div>
      <label for="paginaPai">Página Principal</label>
      <select ref="select2Ref" v-model="formData.pagina_principal" class="w-64 h-10" aria-label="Página Principal">
        <option :value="null">Nenhuma</option>
        <option v-for="page in paginas" :key="page.id" :value="page.id">
          {{ page.nome }}
        </option>
      </select>
    </div>

    <!-- Selecionar Ícone -->
    <div>
      <label for="icon">Ícone</label>
      <select v-model="formData.icone" class="w-64 h-10" aria-label="Ícone">
        <option v-for="icon in icons" :key="icon.value" :value="icon.value">
          <FontAwesomeIcon :icon="['fas', icon.value]" /> {{ icon.name }}
        </option>
      </select>
    </div>

    <!-- Exibir Ícone Selecionado -->
    <div v-if="formData.icone" class="mt-4">
      <p>Ícone Selecionado:</p>
      <FontAwesomeIcon :icon="['fas', formData.icone]" size="2x" />
    </div>

    <!-- Botões de ação -->
    <div class="flex items-center space-x-4 mt-6">
      <button @click="savePage" class="px-4 py-2 bg-blue-500 text-white rounded">
        {{ isEditing ? 'Salvar Alterações' : 'Cadastrar' }}
      </button>
      <button @click="cancel" class="px-4 py-2 bg-gray-300 text-black rounded">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, defineProps, defineEmits } from 'vue';
import InputLabel from 'src/core/components/Inputs/InputLabel.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { savePage, getPageById, updatePage } from '../../../api/pageService';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';

// Props para o componente
const props = defineProps<{
  paginas: Array<{ id: number; nome: string; slug: string }>;
  editId?: number;
}>();

const emits = defineEmits(['saveSuccess', 'cancel']);

// Estado de edição
const isEditing = ref(!!props.editId);

// Dados do formulário
const formData = ref({
  nome: '',
  url: '',
  pagina_principal: null,
  icone: '',
});

// Ícones disponíveis
const icons = [
  { name: 'Coffee', value: 'coffee' },
  { name: 'Home', value: 'home' },
  { name: 'User', value: 'user' },
];

// Referência para o select2
const select2Ref = ref<HTMLElement | null>(null);

// Inicialização do componente
onMounted(async () => {
  if (isEditing.value && props.editId) {
    try {
      const data = await getPageById(props.editId);
      formData.value = {
        nome: data.nome,
        url: data.url,
        pagina_principal: data.pagina_principal,
        icone: data.icone,
      };
    } catch (error) {
      Swal.fire('Erro', 'Erro ao carregar os dados da página.', 'error');
    }
  }

  // Inicializar o select2
  await nextTick();
  if (select2Ref.value) {
    $(select2Ref.value).select2();
    $(select2Ref.value).on('change', () => {
      formData.value.pagina_principal = $(select2Ref.value).val() as string;
    });
  }
});

// Salvar a página
const savePage = async () => {
  try {
    if (!formData.value.nome || !formData.value.url) {
      Swal.fire('Erro', 'Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (isEditing.value) {
      await updatePage(props.editId!, formData.value);
    } else {
      await savePage(formData.value);
    }

    Swal.fire('Sucesso', 'A página foi salva com sucesso.', 'success');
    emits('saveSuccess');
  } catch (error) {
    Swal.fire('Erro', 'Não foi possível salvar a página.', 'error');
  }
};

// Cancelar
const cancel = () => {
  emits('cancel');
};
</script>

<style scoped>
/* Estilos personalizados */
</style>
