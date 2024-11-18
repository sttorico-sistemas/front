<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

// Componentes
import Modal from 'src/core/components/Modal.vue';
import InputLabel from 'src/core/components/Inputs/InputLabel.vue';

// Estado para controle do modal e do formulário
const isOpenDialog = ref<boolean>(false);
const isEditMode = ref<boolean>(false);
const components = ref<any[]>([]); // Lista de componentes para exibição
const pages = ref<any[]>([]); // Lista de páginas para selecionar no formulário

const componentForm = reactive({
  id: null,
  name: '',
  type: '',
  page_id: null,
  parent_id: null,
  slug: '',
});

// Fetch de componentes
const fetchComponents = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) throw new Error('Token não encontrado no storage.');

    const response = await axios.get('https://dev-02-apiv2.management.infoconsig.tec.br/api/organize/components', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    components.value = response.data.data;
  } catch (error) {
    console.error('Erro ao buscar dados dos componentes:', error);
  }
};

// Fetch de páginas para o formulário
const fetchPages = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) throw new Error('Token não encontrado no storage.');

    const response = await axios.get('https://dev-02-apiv2.management.infoconsig.tec.br/api/organize/pages', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    pages.value = response.data.data;
  } catch (error) {
    console.error('Erro ao buscar dados das páginas:', error);
  }
};

// Submeter formulário (adicionar ou editar componente)
const submitComponent = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) throw new Error('Token não encontrado no storage.');

    const method = isEditMode.value ? 'put' : 'post';
    const url = isEditMode.value
      ? `https://dev-02-apiv2.management.infoconsig.tec.br/api/organize/components/${componentForm.id}`
      : 'https://dev-02-apiv2.management.infoconsig.tec.br/api/organize/components';

    await axios[method](url, componentForm, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    await fetchComponents();
    isOpenDialog.value = false;
    clearComponentForm();
  } catch (error) {
    console.error('Erro ao salvar componente:', error);
  }
};

// Abrir modal de edição com dados do componente
const openEditComponentModal = (component: any) => {
  clearComponentForm();
  isEditMode.value = true;
  isOpenDialog.value = true;

  componentForm.id = component.id;
  componentForm.name = component.name;
  componentForm.type = component.type;
  componentForm.page_id = component.page_id || null;
  componentForm.parent_id = component.parent_id || null;
  componentForm.slug = component.slug;
};

// Limpar formulário
const clearComponentForm = () => {
  componentForm.id = null;
  componentForm.name = '';
  componentForm.type = '';
  componentForm.page_id = null;
  componentForm.parent_id = null;
  componentForm.slug = '';
};

// Inicializar ao montar o componente
onMounted(() => {
  fetchComponents();
  fetchPages();
});
</script>
<template>
  <main>
    <div class="panel mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <div class="flex items-center gap-14">
          <h2 class="text-lg font-bold">Componentes</h2>
          <button @click="isOpenDialog = true; isEditMode = false; clearComponentForm()" class="btn btn-primary">
            Adicionar Componente
          </button>
        </div>
      </div>

      <!-- Tabela de componentes -->
      <div class="datatable pb-1">
        <div class="table-responsive my-3">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Tipo</th>
                <th>Página</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="component in components" :key="component.id">
                <td>{{ component.name }}</td>
                <td>{{ component.slug }}</td>
                <td>{{ component.type }}</td>
                <td>{{ component.page?.name || 'Nenhuma' }}</td>
                <td>
                  <button class="btn btn-primary" @click="openEditComponentModal(component)">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para cadastrar ou editar componente -->
    <modal :is-open="isOpenDialog" :title="isEditMode ? 'Editar Componente' : 'Adicionar Componente'"
      size="max-w-[650px]" @btn-close="isOpenDialog = false">
      <form @submit.prevent="submitComponent">
        <input-label :id="'component-name'" label="Nome do Componente" required v-model="componentForm.name" />

        <input-label
  :id="'component-slug'"
  label="Slug"
  required
  v-model="componentForm.slug"
/>

<input-label
  :id="'component-type'"
  label="Tipo"
  v-model="componentForm.type"
/>

        <div class="form-group">
          <label for="pagina">Página</label>
          <select v-model="componentForm.page_id" class="form-select">
            <option value="">Nenhuma</option>
            <option v-for="page in pages" :key="page.id" :value="page.id">{{ page.name }}</option>
          </select>
        </div>



        <div class="form-group">
          <label for="pagina">Componente Pai</label>
          <select v-model="componentForm.parent_id" class="form-select">
            <option value="">Nenhum</option>
            <option v-for="component in components" :key="component.id" :value="component.id">{{ component.name }}
            </option>
          </select>
        </div>




        <div class="flex justify-end mt-4">
          <button type="button" class="btn btn-secondary mr-2" @click="isOpenDialog = false">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar</button>
        </div>
      </form>
    </modal>
  </main>
</template>

---

#### Estilos

```vue
<style scoped>
.table-responsive {
  overflow-x: auto;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-secondary {
  background-color: #d1d5db;
  color: #1f2937;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>
