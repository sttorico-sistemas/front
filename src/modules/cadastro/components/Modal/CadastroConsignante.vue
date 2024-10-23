<script lang="ts" setup>
import { ref } from 'vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import CadastroEndereco from 'src/modules/consultas/components/CadastroEndereco.vue';
import FormField from 'src/core/components/FormField.vue';

const consignanteMaster = ref<string>('')
const clearOption = () => consignanteMaster.value = ''
const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>

<template>
  <main>
    <div class="panel mt-5 border border-primary_3-table flex items-center md:gap-12">
      <label for="consignante_master" class="text-sm md:text-base text-primary_3-table m-0">Consignante Master</label>
      <div class="flex items-center gap-6">
        <select v-model="consignanteMaster" id="consignante_master"
          class="form-select w-auto md:w-[500px] h-[38px] font-normal" required>
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
      <h3 class="text-base font-semibold text-primary_3-table mb-7">Consignante Master</h3>

      <div class="flex flex-col md:flex-row items-center mb-3">
        <label for="cnpj" class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left">CNPJ</label>
        <input id="cnpj" type="text" class="form-input mb-3 md:mb-0 md:max-w-[200px] h-[38px]" />

        <label for="tipo_entidade" class="mb-0 md:ml-3 md:mr-2 w-full md:w-auto text-sm text-left">Tipo de
          Entidade</label>
        <select id="tipo_entidade" class="form-select md:max-w-[250px] h-[38px]">
          <option value=""></option>
          <option value="Entidade 1">Entidade 1</option>
          <option value="Entidade 2">Entidade 2</option>
          <option value="Entidade 3">Entidade 3</option>
          <option value="Entidade 4">Entidade 4</option>
        </select>
      </div>

      <label-input id="nome" label="Nome" class-label="text-sm" class-input="md:max-w-[420px]" layout="col" />
      <label-input id="nome_curto" label="Nome curto" class-label="text-sm" class-input="md:max-w-[250px]"
        layout="col" />
      <cadastro-endereco flat :show-title="false" class="my-3"></cadastro-endereco>

      <div class="flex flex-col md:flex-row items-center mb-3">
        <label for="cep" class="mb-0 md:mr-11 w-full md:w-1/5 text-sm text-left">CEP</label>
        <input id="cep" type="text" class="form-input mb-3 md:mb-0 md:max-w-full h-[38px]" />
        <!-- <form-field label="CEP"></form-field> -->
      </div>

      <div class="flex flex-col md:flex-row items-center mb-3">
        <label for="expediente" class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left">Expediente</label>
        <input id="expediente" type="text" class="form-input mb-3 md:mb-0 md:max-w-[80px] h-[38px]" />

        <label for="ate" class="mb-0 md:mx-2 w-full md:w-auto text-sm text-left">Até</label>
        <input id="ate" type="text" class="form-input md:max-w-[80px] h-[38px]" />
      </div>

      <div class="flex justify-center items-center gap-12 mt-8">
        <button type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="emits('btnCancelar', false)">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </div>
  </main>
</template>