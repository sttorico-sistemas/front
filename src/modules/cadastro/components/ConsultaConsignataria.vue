<script lang="ts" setup>
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'
</script>

<template>
  <main>
    <div class="panel py-4 mt-6 bg-[#EAEAEC]">
      <form class="">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <label-select id="consignataria" label="Consignatária" class-label="text-[10px]"
            class-select="w-full md:w-[420px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <label-select id="tipo_instituicao" label="Tipo de Instituição" class-label="text-[10px]"
            class-wrapper="w-full md:w-[245px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <label-select id="nome_curto" label="Nome Curto" class-label="text-[10px]" class-wrapper="w-full md:w-[245px]"
            layout="row" :options="['consignante 1', 'consignante 2']" />

          <div class="ml-40">
            <button type="button"
              class="w-[140px] h-10 btn bg-primary_3-table mt-3 text-white text-xs rounded-full">Nova Consulta</button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
