<script lang="ts" setup>
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'

withDefaults(defineProps<{
  typeScreen?: string;
}>(), {
  typeScreen: 'consignante',
});

const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>

<template>
  <main>
    <div class="panel mt-5 border border-primary">
      <label for="consignante_master" class="text-sm md:text-base text-primary m-0 mb-3">Dados do Gestor</label>

      <div class="flex flex-col gap-2.5">
        <label-input id="nome" label="Nome" class-label="text-sm" class-input="md:max-w-[400px]" layout="row" />
        <label-input id="cargo" label="Cargo" class-label="text-sm" class-input="md:max-w-[400px]" layout="row" />
        <label-input type="tel" id="telefone" label="Telefone" class-label="text-sm" class-input="md:max-w-[200px]"
          layout="row" />
        <label-input type="cel" id="celular" label="Celular" class-label="text-sm" class-input="md:max-w-[200px]"
          layout="row" />
        <label-input id="email" label="E-mail" class-label="text-sm" class-input="md:max-w-[400px]" layout="row" />
      </div>

      <div class="flex justify-center items-center gap-12 mt-8">
        <button type="button"
          class="w-[86px] btn border border-primary shadow-none text-primary text-xs"
          @click="emits('btnCancelar', false)">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary text-white text-xs">Salvar</button>
      </div>
    </div>
  </main>
</template>
