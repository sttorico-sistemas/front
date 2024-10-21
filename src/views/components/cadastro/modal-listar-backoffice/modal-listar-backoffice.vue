<script lang="ts" setup>
  import { reactive, ref } from 'vue'

  // Componentes
  import Vue3Datatable from '@bhplugin/vue3-datatable'
  import titulo from '@components/layout/tituloLayout.vue'
  import modalLayout from '@components/layout/modalLayout.vue'
  import modalHabilitarBackoffice from './modal-habilitar-backoffice/modal-habilitar-backoffice.vue'

  // Icones
  import IconAdd from '@icons/iconAdd.vue'
  import IconCheck from '@icons/iconCheck.vue'
	import IconBlock from '@icons/iconBlock.vue'

  // Declarações
  const isOpenDialog = ref(false)
  const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
  const cols = reactive([
		{ field: 'backoffice', title: 'Backoffice', hide: false, sort: true, },
		{ field: 'setor', title: 'Setor', hide: false, sort: true, },
		{ field: 'cidade', title: 'Cidade', hide: false, sort: true, },
		{ field: 'uf', title: 'UF', hide: false, sort: true, },
		{ field: 'status', title: 'Status', hide: false, sort: true, },
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
	])
	const rows = reactive([
		{
      id: 1,
      backoffice: 'Agência Centro Florianópolis',
      setor: 'Agência',
      cidade: 'Florianópolis',
      uf: 'SC',
      status: 'Habilitado',
    },
    {
      id: 2,
      backoffice: 'PAB - Prefeitura Florianópolis',
      setor: 'PAB',
      cidade: 'Florianópolis',
      uf: 'SC',
      status: 'Desabilitado',
    },
	])

  // Scripts
  const emits = defineEmits(['btnSave', 'btnCancelar'])

  const color = (value: string): string => {
		switch (value) {
			case 'Habilitado':
				return 'bg-success' // Ativo
      case 'Liberada':
        return 'bg-success'
			case 'Desabilitado':
				return 'bg-warning' // Inativo
			case 'Bloqueada':
				return 'bg-secondary'
		}
	}

	const filtered = (value: string = '') => {
		if (value === '') return rows

    if (selected.type === 'backoffice')
			return rows.filter((item: any) => item.backoffice === value)

    if (selected.type === 'setor')
			return rows.filter((item: any) => item.setor === value)

    if (selected.type === 'cidade')
			return rows.filter((item: any) => item.cidade === value)

    if (selected.type === 'status')
			return rows.filter((item: any) => item.status === value)

	}
</script>
<template>
  <div class="panel mt-4">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <div class="flex items-center gap-14">
        <titulo title="Backoffice" />
        <button @click="isOpenDialog = true" v-tippy:right>
          <icon-add />
        </button>
        <tippy target="right" placement="right">Cadastre um nova cidade</tippy>
      </div>

      <div
        class="header_actions flex items-center gap-5"
      >
        <multiselect
          v-model="backoffice"
          :options="['Agência Centro Florianópolis', 'PAB - Prefeitura Florianópolis']"
          class="custom-multiselect md:min-w-[150px]"
          placeholder="Backoffice"
          :searchable="false"
          :preselect-first="false"
          :allow-empty="false"
          selected-label=""
          select-label=""
          deselect-label=""
          @select="(selected.label = $event), (selected.type = 'backoffice')"
        />
        <multiselect
          v-model="setor"
          :options="['Agência', 'PAB']"
          class="custom-multiselect md:min-w-[150px]"
          placeholder="Setor"
          :searchable="false"
          :preselect-first="false"
          :allow-empty="false"
          selected-label=""
          select-label=""
          deselect-label=""
          @select="(selected.label = $event), (selected.type = 'setor')"
        />
        <multiselect
          v-model="cidade"
          :options="['Florianópolis']"
          class="custom-multiselect md:min-w-[120px]"
          placeholder="Cidade"
          :searchable="false"
          :preselect-first="false"
          :allow-empty="false"
          selected-label=""
          select-label=""
          deselect-label=""
          @select="(selected.label = $event), (selected.type = 'cidade')"
        />
        <multiselect
          v-model="status"
          :options="['Habilitado', 'Desabilitado']"
          class="custom-multiselect md:min-w-[120px]"
          placeholder="Status"
          :searchable="false"
          :preselect-first="false"
          :allow-empty="false"
          selected-label=""
          select-label=""
          deselect-label=""
          @select="(selected.label = $event), (selected.type = 'status')"
        />
      </div>
    </div>

    <div class="datatable">
      <vue3-datatable
        :rows="filtered(selected.label)"
        :columns="cols"
        :total-rows="filtered(selected.label)?.length"
        :sortable="true"
        skin="whitespace-nowrap bh-table-striped"
        :pagination="false"
      >
        <template #status="data">
          <span
            class="flex justify-center badge !w-[80px] h-[22px]"
            :class="color(data.value.status)"
            >{{ data.value.status }}</span
          >
        </template>
        <template #actions="data">
          <button
            v-tippy:right
            type="button"
            class="text-xs m-1"
          >
            <icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
            <icon-block v-else class="w-5 h-5 text-primary_3-table" />
          </button>
          <tippy target="right" placement="right"
            >{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}</tippy
          >
        </template>
      </vue3-datatable>
    </div>
    <div class="flex justify-center items-center gap-12 mt-8">
      <button
        type="button"
        class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
        @click="emits('btnCancelar', false)"
      >Fechar</button>
    </div>

    <modal-layout
      :is-open="isOpenDialog"
      title="Habilitar Backoffice"
      size="max-w-[400px]"
      @btn-close="isOpenDialog = false"
    >
      <modal-habilitar-backoffice @btn-cancelar="isOpenDialog = false" />
    </modal-layout>
  </div>
</template>
