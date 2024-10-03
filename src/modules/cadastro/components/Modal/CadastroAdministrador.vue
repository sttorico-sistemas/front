<script lang="ts" setup>
// Componentes
import LabelInput from '@/core/components/layout/forms/inputs/inputLabel.vue'
import LabelSelect from '@/core/components/layout/forms/inputs/selectLabel.vue'

const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>
<template>
  <main>
    <div class="panel border mt-5 border-primary_3-table">
      <h3 class="text-base font-semibold text-primary_3-table mb-7">Dados do Administrador</h3>

      <div class="flex flex-col md:flex-row items-center mb-3">
        <label for="cnpj" class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left">CNPJ</label>
        <input id="cnpj" type="text" class="form-input mb-3 md:mb-0 md:max-w-[200px] h-[38px]" />
      </div>

      <label-input id="nome" label="Nome" class-label="text-sm" class-input="md:max-w-[420px]" layout="col" />
      <label-input id="nome_curto" label="Nome curto" class-label="text-sm" class-input="md:max-w-[250px]"
        layout="col" />
      <label-select id="tipo_endereco" label="Tipo de Endereço" class-label="text-sm" class-select="md:max-w-[250px]"
        layout="col" :options="['Av', 'Alameda', 'Beco', 'Comunidade', 'Estrada', 'Rua']" />
      <label-input id="endereco" label="Endereço Completo" class-label="text-sm" class-input="md:max-w-[620px]"
        layout="col" />

      <div class="flex flex-col md:flex-row items-center mb-3">
        <label for="cidade" class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left">Cidade</label>
        <input id="cidade" type="text" class="form-input mb-3 md:mb-0 md:max-w-[250px] h-[38px]" />

        <label for="uf" class="mb-0 md:mr-4 md:ml-8 w-full md:w-auto text-sm text-left">UF</label>
        <input id="uf" type="text" class="form-input mb-3 md:mb-0 md:max-w-[50px] h-[38px]" />

        <label for="cep" class="mb-0 md:mr-4 md:ml-8 w-full md:w-auto text-sm text-left">CEP</label>
        <input id="cep" type="text" class="form-input mb-3 md:mb-0 md:max-w-[150px] h-[38px]" />
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
