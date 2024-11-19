<template>
    <div class="modal-overlay">
      <div class="modal-content w-[600px]">
        <h2 class="text-lg font-semibold mb-4">
          {{ operador ? 'Editar Operador' : 'Novo Operador' }}
        </h2>
  
        <!-- CPF -->
        <label for="cpf" class="text-sm">CPF</label>
        <input
          id="cpf"
          v-model="cpf"
          placeholder="Digite o CPF"
          class="border border-gray-300 p-2 w-full"
          type="text"
          :disabled="!!operador"
        />
  
        <!-- Nome -->
        <label for="nome" class="text-sm mt-2">Nome</label>
        <input
          id="nome"
          v-model="nome"
          placeholder="Digite o nome"
          class="border border-gray-300 p-2 w-full"
          type="text"
          :disabled="true"
        />
  
        <!-- Tipo Operador -->
        <label for="tipo_operador" class="text-sm mt-2">Tipo de Operador</label>
        <select v-model="form.tipo_operador_id" class="border border-gray-300 p-2 w-full">
          <option value="" disabled>Selecione um tipo de operador</option>
          <option v-for="tipo in tiposOperadores" :key="tipo.id" :value="tipo.id">
            {{ tipo.nome }}
          </option>
        </select>
  
        <!-- Permissões -->
        <div class="mt-4">
          <h3 class="text-md font-semibold">Permissões do Operador</h3>
          <div class="border border-gray-300 p-4 rounded-md">
            <ul>
              <li
                v-for="permission in allPermissions"
                :key="permission.id"
                class="flex items-center justify-between"
              >
                <span>{{ permission.related_name }}</span>
                <input
                  type="checkbox"
                  :value="permission.id"
                  v-model="selectedPermissions"
                />
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Botões -->
        <div class="flex justify-end gap-4 mt-6">
          <button @click="$emit('close')" class="btn bg-gray-300 text-black">Cancelar</button>
          <button @click="saveOperador" class="btn bg-blue-500 text-white">Salvar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  
  // Props
  const props = defineProps({
    operador: { type: Object, required: false },
  });
  
  const emit = defineEmits(['close', 'refresh']);
  
  // Estados
  const cpf = ref('');
  const nome = ref('');
  const form = ref({
    tipo_operador_id: null,
  });
  const tiposOperadores = ref([]);
  const allPermissions = ref([]); // Todas as permissões disponíveis
  const selectedPermissions = ref([]); // Permissões selecionadas pelo operador
  
  // Buscar tipos de operadores
  const fetchTiposOperadores = async () => {
    try {
      const response = await axios.get(
        'https://dev-02-apiv2.management.infoconsig.tec.br/api/profile/tipo-operador'
      );
      tiposOperadores.value = response.data.data.map((tipo) => ({
        id: tipo.id,
        nome: tipo.name,
        permissao_ids: tipo.permissions.map((p) => p.id),
      }));
    } catch (error) {
      console.error('Erro ao buscar tipos de operadores:', error);
    }
  };
  
  // Buscar todas as permissões
  const fetchAllPermissions = async () => {
    try {
      const response = await axios.get(
        'https://dev-02-apiv2.management.infoconsig.tec.br/api/profile/permissions'
      );
      allPermissions.value = response.data.map((perm) => ({
        id: perm.id,
        related_name: perm.related_name || 'Permissão Desconhecida',
      }));
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
    }
  };
  
  // Preencher dados ao editar
  watch(
    () => props.operador,
    (operador) => {
      if (operador) {
        cpf.value = operador.user.cpf || '';
        nome.value = operador.user.nome || '';
        form.value.tipo_operador_id = operador.tipo_operador.id || null;
        selectedPermissions.value = operador.tipo_operador.permissions
          ? operador.tipo_operador.permissions.map((p) => p.id)
          : [];
      } else {
        cpf.value = '';
        nome.value = '';
        form.value.tipo_operador_id = null;
        selectedPermissions.value = [];
      }
    },
    { immediate: true }
  );
  
  // Atualizar permissões ao trocar manualmente o tipo de operador
  watch(
    () => form.value.tipo_operador_id,
    (newTipoId) => {
      if (!props.operador || props.operador.tipo_operador.id !== newTipoId) {
        const tipoOperador = tiposOperadores.value.find((tipo) => tipo.id === newTipoId);
        if (tipoOperador) {
          selectedPermissions.value = tipoOperador.permissao_ids;
        } else {
          selectedPermissions.value = [];
        }
      }
    }
  );
  
  // Salvar operador
  const saveOperador = async () => {
    try {
      const endpoint = props.operador
        ? `https://dev-02-apiv2.management.infoconsig.tec.br/api/profile/operador/${props.operador.id}`
        : `https://dev-02-apiv2.management.infoconsig.tec.br/api/profile/operador`;
  
      const method = props.operador ? 'put' : 'post';
      const payload = {
        pessoa_id: props.operador?.user?.pessoa_id || null,
        tipo_operador_id: form.value.tipo_operador_id,
        permissoes: selectedPermissions.value,
        ...(props.operador ? { id: props.operador.id, user_id: props.operador.user.id } : {}),
      };
  
      await axios[method](endpoint, payload);
      emit('refresh');
      emit('close');
    } catch (error) {
      console.error('Erro ao salvar operador:', error);
    }
  };
  
  // Inicializar
  onMounted(() => {
    fetchTiposOperadores();
    fetchAllPermissions();
  });
  </script>
  