<script lang="ts" setup>
// Core
import { ref } from 'vue'

// Componentes
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import modalLayout from 'src/core/components/Modal.vue'
import titulo from 'src/core/components/Titulo.vue'

import CadastroModalConsignante from './Modal/CadastroConsignante.vue'

// Icons
import IconEdit from 'src/core/components/Icons/IconEdit.vue'

// Declarações
const isOpenDialog = ref<boolean>(false)
</script>
<template>
  <main>
    <div class="panel mt-6">
      <div class="flex items-center gap-14">
        <titulo title="Dados do Consignante " />
        <button @click="isOpenDialog = true" v-tippy:right>
          <icon-edit />
        </button>
        <tippy target="right" placement="right">Editar Consignante</tippy>
      </div>

      <form class="my-3.5">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <label-input id="cod" label="Cód. Consignante" type="text" class-wrapper="w-full md:w-[110px]"
            class-label="text-[10px]" class-input="text-xs font-normal" value="55.652" disabled />

          <label-input id="cnpj" label="CNPJ" type="text" class-wrapper="w-full md:w-[177px]" class-label="text-[10px]"
            class-input="text-xs font-normal" value="55.652.789/0001-01" disabled />

          <label-input id="consignante" label="Consignante" type="text" class-wrapper="w-full md:w-[420px]"
            class-label="text-[10px]" class-input="text-xs font-normal"
            value="Instituto de Previdência do Município de Almirante Tamandare" disabled />

          <label-input id="tipo_entidade" label="Tipo de Entidade" type="text" class-wrapper="w-full md:w-[240px]"
            class-label="text-[10px]" class-input="text-xs font-normal" value="Governo Municipal" disabled />

          <label-input id="consignante_master" label="Consignante Master" type="text"
            class-wrapper="w-full md:w-[245px]" class-label="text-[10px]" class-input="text-xs font-normal"
            value="Municipio Alm Tamandaré - PR" disabled />
        </div>
        <div class="flex flex-col md:flex-row gap-4 items-center my-4">
          <label-input id="nome_curto" label="Nome curto" type="text" class-wrapper="w-full md:w-[250px]"
            class-label="text-[10px]" class-input="text-xs font-normal" value="IPMAT - PR" disabled />
          <label-input id="expediente_de" label="Expediente de" type="text" class-wrapper="w-full md:w-[90px]"
            class-label="text-[10px]" class-input="text-xs font-normal" value="08:00" disabled />
          <label-input id="expediente_ate" label="Até" type="text" class-wrapper="w-full md:w-[90px]"
            class-label="text-[10px]" class-input="text-xs font-normal" value="18:00" disabled />
        </div>
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <label-input id="tipo_endereco" label="Tipo de Endereço" type="text" class-wrapper="w-full md:w-[177px]"
            class-label="text-[10px]" class-input="text-xs font-normal" value="Comercial" disabled />
          <label-input id="endereco" label="Endereço Completo" type="text" class-wrapper="w-full md:w-[620px]"
            class-label="text-[10px]" class-input="text-xs font-normal"
            value="Rua Engenheiro Almirante Tamandaré, nr 235, Centro" disabled />
          <label-input id="cidade" label="Cidade" type="text" class-wrapper="w-full md:w-[220px]"
            class-label="text-[10px]" class-input="text-xs font-normal" value="Almirante Tamandaré" disabled />
          <label-input id="uf" label="UF" type="text" class-wrapper="w-full md:w-[50px]" class-label="text-[10px]"
            class-input="text-xs font-normal" value="PR" disabled />
          <label-input id="cep" label="CEP" type="text" class-wrapper="w-full md:w-[100px]" class-label="text-[10px]"
            class-input="text-xs font-normal" value="78.900-000" disabled />
        </div>
      </form>
    </div>
  </main>
  <modal-layout title="Cadastro Consignante" :is-open="isOpenDialog" size="max-w-[834px]"
    @btn-close="isOpenDialog = false">
    <cadastro-modal-consignante @btn-cancelar="isOpenDialog = false" />
  </modal-layout>
</template>