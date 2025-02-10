<script lang="ts" setup>
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconFilter from 'src/core/components/Icons/IconFilter.vue'
</script>

<template>
  <main>
    <div class="panel py-4 mt-6 bg-[#EAEAEC]">
      <form class="flex justify-between items-center">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <label-select id="tipo_instituicao" label="Tipo de Instituição" class-label="text-[10px]"
            class-select="w-full md:w-[255px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <label-select id="consignante_master" label="Consignante Master" class-label="text-[10px]"
            class-wrapper="w-full md:w-[255px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <label-select id="consignante" label="Consignante" class-label="text-[10px]"
            class-wrapper="w-full md:w-[255px]" layout="row" :options="['consignante 1', 'consignante 2']" />

          <label-select id="averbador" label="Averbador" class-label="text-[10px]" class-wrapper="w-full md:w-[255px]"
            layout="row" :options="['consignante 1', 'consignante 2']" />
        </div>
        <div class="flex items-center gap-2.5 mt-4">
          <icon-clear class="w-6 h-6 text-primary" />
          <icon-filter class="w-6 h-6 text-primary" />
        </div>
      </form>
    </div>
  </main>
</template>
