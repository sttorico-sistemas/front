<template>
    <div class="modal-overlay">
      <div class="modal-content w-[600px]">
        <h2 class="text-lg font-semibold mb-4">Permissões do Operador</h2>
  
        <!-- Permissões do Perfil -->
        <div>
          <h3 class="text-md font-semibold">Permissões do Perfil</h3>
          <ul class="list-disc ml-6">
            <li v-for="permission in perfilPermissions" :key="permission.id">
              {{ permission.related_name }}
            </li>
          </ul>
        </div>
  
        <!-- Exceções -->
        <div class="mt-6">
          <h3 class="text-md font-semibold">Exceções</h3>
          <ul class="list-disc ml-6">
            <li v-for="exception in exceptions" :key="exception.id" :class="exception.action === 'add' ? 'text-green-500' : 'text-red-500'">
              {{ exception.action === 'add' ? 'Adicionado: ' : 'Removido: ' }}{{ exception.related_name }}
            </li>
          </ul>
        </div>
  
        <!-- Botão de Fechar -->
        <div class="flex justify-end mt-6">
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-300 text-black rounded">Fechar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue';
  
  // Props
  const props = defineProps({
    operador: { type: Object, required: true },
  });
  
  const perfilPermissions = ref([]);
  const exceptions = ref([]);
  
  // Função para calcular exceções
  const calculateExceptions = (perfilPerms, operadorPerms) => {
    const perfilIds = perfilPerms.map((perm) => perm.id);
    const operadorIds = operadorPerms.map((perm) => perm.id);
  
    const added = operadorPerms.filter((perm) => !perfilIds.includes(perm.id));
    const removed = perfilPerms.filter((perm) => !operadorIds.includes(perm.id));
  
    return [
      ...added.map((perm) => ({ ...perm, action: 'add' })),
      ...removed.map((perm) => ({ ...perm, action: 'remove' })),
    ];
  };
  
  // Watch para atualizar permissões e exceções
  watch(
    () => props.operador,
    (operador) => {
      if (operador) {
        const perfilPerms = operador.tipo_operador.permissions || [];
        const operadorPerms = operador.permissions || [];
        perfilPermissions.value = perfilPerms;
  
        exceptions.value = calculateExceptions(perfilPerms, operadorPerms);
      }
    },
    { immediate: true }
  );
  </script>
  