<script lang="ts" setup>
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconFilter from 'src/core/components/Icons/IconFilter.vue'
</script>

<template>
  <div class="panel">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Dados para Pesquisa" />

      <div class="flex items-center gap-2.5">
        <icon-clear class="w-6 h-6 text-primary_3-table" />
        <icon-filter class="w-6 h-6 text-primary_3-table" />
      </div>
    </div>

    <form class="">
      <div class="flex flex-col md:flex-row gap-4 items-center my-2.5">
        <label-input id="cpf" label="CPF" type="text" class-wrapper="w-full md:w-[255px]"
          class-label="text-sm font-normal" class-input="text-xs font-normal" value="" />
        <label-select id="nome" label="Nome" class-label="text-sm font-normal" class-select="w-full md:w-[255px]"
          layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="regime" label="Regime" class-label="text-sm font-normal" class-select="w-full md:w-[255px]"
          layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="categoria" label="Categoria" class-label="text-sm font-normal"
          class-select="w-full md:w-[255px]" layout="row" :options="['consignante 1', 'consignante 2']" />
      </div>
      <div class="flex flex-col md:flex-row gap-4 items-center my-2.5">
        <label-select id="cargo" label="Cargo" class-label="text-sm font-normal" class-select="w-full md:w-[255px]"
          layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="orgao" label="Orgão" class-label="text-sm font-normal" class-select="w-full md:w-[255px]"
          layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="lotacao" label="Lotação" class-label="text-sm font-normal" class-select="w-full md:w-[255px]"
          layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="unidade" label="Unidade" class-label="text-sm font-normal" class-select="w-full md:w-[255px]"
          layout="row" :options="['consignante 1', 'consignante 2']" />
      </div>
      <div class="flex flex-col md:flex-row gap-4 items-center my-2.5">
        <label-select id="situacao_funcional" label="Situação Funcional" class-label="text-sm font-normal"
          class-select="w-full md:w-[255px]" layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="status_cadastro" label="Status do Cadastro" class-label="text-sm font-normal"
          class-select="w-full md:w-[255px]" layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="averbacao" label="Averbação" class-label="text-sm font-normal"
          class-select="w-full md:w-[255px]" layout="row" :options="['consignante 1', 'consignante 2']" />
      </div>
    </form>
  </div>
</template>
