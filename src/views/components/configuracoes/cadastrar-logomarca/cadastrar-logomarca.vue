<script lang="ts" setup>
	import { reactive, ref, onMounted } from 'vue'
  import { FileUploadWithPreview, Events, ImageAddedEvent } from 'file-upload-with-preview'

	// Componentes
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

	// Icons
  import IconAdd from '@icons/iconAdd.vue'
  import IconDelete from '@icons/iconDelete.vue'
  import IconProfile from '@icons/iconProfile.vue'

	// Declarações

	// Script
  onMounted(() => {
    new FileUploadWithPreview('logomarca', {
      images: {
        baseImage: 'https://placehold.co/150x150',
      }
    })
  })

  /*
    Pegar evento do input ao adicionar imagem
    Verificar tamanho (< 512kb)
    Verificar tamanho (150px)
    Verificar formato (png, jpg)
  */
  window.addEventListener(Events.IMAGE_ADDED, (e: Event) => {
  const { detail } = e as unknown as ImageAddedEvent;

  console.log('detail', detail);
});
</script>
<template>
	<main>
    <span class="text-xs">(Recomendado 150x150px (pixel) ou a mesma proporção. Tamanho máximo de 512kb.)</span>

    <div class="mt-5">
      <label-select
        id="tipo_instituicao"
        label="Selecione Tipo Instituição"
        class-label="text-sm"
        class-select="w-full md:max-w-[300px] mb-3"
        layout="row"
        :options="['Instituição Financeira', 'Associação de Servidores Públicos']"
      />
      <label-select
        id="instituicao"
        label="Selecione Instituição"
        class-label="text-sm"
        class-select="w-full md:max-w-[400px] mb-3"
        layout="row"
        :options="['Banco do Brasil', 'ASM- Associação Servidores de Macapá']"
      />

      <div class="mb-3">
        <div class="flex">
          <label class="text-sm m-0 mr-3">Logo</label>
          <label class="m-0 cursor-pointer" for="file-upload-with-preview-logomarca"><icon-add class="w-5 h-5 mr-1" /></label>
          <a class="clear-button" href="javascript:void(0)" title="Limpar Logomarca">
            <icon-delete class="w-5 h-5" />
          </a>
        </div>
        <div
          class="w-40 h-40 mt-2 rounded-md border border-gray-200 custom-file-container"
          data-upload-id="logomarca"
        >
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-12 mt-8">
      <button
        type="button"
        class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
        @click="emits('btnCancelar', false)"
      >Cancelar</button>
      <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
    </div>
	</main>
</template>

