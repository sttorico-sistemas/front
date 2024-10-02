<script lang="ts" setup>
// Core
import { reactive, ref } from 'vue'

// Componentes
import LabelInput from '@/core/components/layout/forms/inputs/inputLabel.vue'
import LabelSelect from '@/core/components/layout/forms/inputs/selectLabel.vue'

// Icons

// Declarações

// Script

</script>
<template>
  <main>
    <div class="panel py-4 mt-6 bg-[#EAEAEC]">
      <form class="">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <label-select id="consignante_master" label="Consignante Master" class-label="text-[10px]"
            class-select="w-full md:w-[300px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <label-select id="consignante" label="Consignante" class-label="text-[10px]"
            class-wrapper="w-full md:w-[420px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <label-select id="tipo_instituicao" label="Tipo Instituição" class-label="text-[10px]"
            class-wrapper="w-full md:w-[245px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <div class="ml-40">
            <button type="button"
              class="w-[140px] h-10 btn bg-primary_3-table mt-3 text-white text-xs rounded-full">Nova Consulta</button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
