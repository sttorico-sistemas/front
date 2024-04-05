<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'
	
	// Componentes
  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
	import titulo from '@components/layout/tituloLayout.vue'
	
	// Icons
  import IconClear from '@icons/iconClear.vue'

	// Declarações
  const consignanteMaster = ref<string>('')

	// Script
  const clearOption = () => consignanteMaster.value = ''

  const emits = defineEmits(['btnSave', 'btnCancelar'])

</script>
<template>
	<main>
    <div class="panel mt-5 border border-primary_3-table flex items-center gap-12">
      <label for="consignante_master" class="text-base text-primary_3-table m-0">Consignante Master</label>
      <div class="flex items-center gap-6">
        <select 
          v-model="consignanteMaster" 
          id="consignante_master" 
          class="form-select w-[500px] h-[38px] font-normal" 
          required
        >
          <option value="">Selecione uma opção</option>
          <option value="Consignante 1">Consignante 1</option>
          <option value="Consignante 2">Consignante 2</option>
          <option value="Consignante 3">Consignante 3</option>
        </select>
        <button @click="clearOption">
          <icon-clear class="w-5 h-5 text-primary_3-table" />
        </button>
      </div>
    </div>

    <div class="panel border mt-5 border-primary_3-table">
      <h3 class="text-base font-semibold text-primary_3-table m-0">Consignante Master</h3>

      <div class="flex justify-center items-center gap-12 mt-8">
        <button 
          type="button" 
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs" 
          @click="emits('btnCancelar', false)"
        >Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </div>
	</main>
</template>