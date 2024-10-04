<script lang="ts" setup>
import { ref } from 'vue'

// Componentes
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'

// Icons
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'

// Declarações
const logomarca = ref('')
const messageErrors = ref<string[]>([])

// Script
const emits = defineEmits(['btnSave', 'btnCancelar'])

// Valida o tamanho em kb da imagem
const fileSize = (size: number) => {
  if (size > 512000) return false

  return true
}

// Valida o tamanho da imagem em px
const filePixel = (e) => {
  const image = new Image()
  image.src = e

  const isBigger = image.onload = () => {
    if (image.naturalWidth < 150 || image.naturalHeight < 150) return true

    return false
  }

  return isBigger()
}

const onFileChange = (e: Event) => {
  onFileDelete()

  const input = e.target as HTMLInputElement;

  const file = input.files?.[0]

  if (!file) return

  const reader = new FileReader()

  if (!fileSize(file.size)) {
    messageErrors.value.push('Tamanho da imagem é maior que 512kb.')
  }

  reader.onload = (e) => {
    if (e.target?.result) {
      logomarca.value = e.target.result as string;
      if (!filePixel(e.target.result as string)) {
        messageErrors.value.push(
          'Recomendado 150x150px (pixel) ou a mesma proporção.'
        );
      }
    }
  }

  reader.readAsDataURL(file)
}

const onFileDelete = () => {
  logomarca.value = ''
  messageErrors.value = []
}
</script>
<template>
  <main>
    <span class="text-xs">(Recomendado 150x150px (pixel) ou a mesma proporção. Tamanho máximo de 512kb.)</span>

    <div class="mt-5">
      <label-select id="tipo_instituicao" label="Selecione Tipo Instituição" class-label="text-sm"
        class-select="w-full md:max-w-[300px] mb-3" layout="row"
        :options="['Instituição Financeira', 'Associação de Servidores Públicos']" />
      <label-select id="instituicao" label="Selecione Instituição" class-label="text-sm"
        class-select="w-full md:max-w-[400px] mb-3" layout="row"
        :options="['Banco do Brasil', 'ASM- Associação Servidores de Macapá']" />

      <div class="mb-3">
        <div class="flex">
          <label class="text-sm m-0 mr-3">Logo</label>
          <label class="m-0 cursor-pointer" for="file-upload-logomarca">
            <icon-add class="w-5 h-5 mr-1" />
            <input id="file-upload-logomarca" type="file" class="hidden" @change="onFileChange"
              accept="image/png, image/jpeg" />
          </label>
          <icon-delete class="w-5 h-5" @click="onFileDelete" />
        </div>
        <div v-show="messageErrors.length" v-for="messageError in messageErrors" :key="messageError"
          class="flex items-center p-2 my-2 rounded text-danger bg-danger-light">
          <span class="pr-1 pl-1 text-sm"><strong class="mr-1 ml-1">Atenção!</strong>{{ messageError }}</span>
        </div>
        <div class="w-40 h-40 mt-2 rounded-md border border-gray-200 bg-no-repeat bg-center"
          :style="`background-image: url(${logomarca})`"></div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-12 mt-8">
      <button type="button" class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
        @click="emits('btnCancelar', false)">Cancelar</button>
      <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
    </div>
  </main>
</template>
