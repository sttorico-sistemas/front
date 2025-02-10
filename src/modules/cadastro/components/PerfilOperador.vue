<script lang="ts" setup>
import { reactive, ref } from 'vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import titulo from 'src/core/components/Titulo.vue'
import ConsultasExport from 'src/modules/consultas/components/ConsultasExport.vue'

const props = withDefaults(defineProps<{
  addButton?: boolean;
}>(), {
  addButton: false,
});

const tp_operador = ref('')
const cliente = ref('')
const cols = reactive([
  { field: 'funcionalidade', title: 'Funcionalidade', hide: false, },
  { field: 'perfil_1', title: 'Perfil 1', hide: false, },
  { field: 'perfil_2', title: 'Perfil 2', hide: false, },
  { field: 'perfil_3', title: 'Perfil 3', hide: false, },
  { field: 'perfil_4', title: 'Perfil 4', hide: false, },
  { field: 'perfil_5', title: 'Perfil 5', hide: false, },
])
const rows = reactive([
  {
    funcionalidade: 'Consultas',
    perfil_1: 'Ativo',
    perfil_2: 'Ativo',
    perfil_3: 'Ativo',
    perfil_4: 'Inativo',
    perfil_5: 'Inativo',
  },
  {
    funcionalidade: 'Cadastros',
    perfil_1: 'Ativo',
    perfil_2: 'Inativo',
    perfil_3: 'Ativo',
    perfil_4: 'Inativo',
    perfil_5: 'Ativo',
  },
  {
    funcionalidade: 'Operações',
    perfil_1: 'Inativo',
    perfil_2: 'Inativo',
    perfil_3: 'Ativo',
    perfil_4: 'Ativo',
    perfil_5: 'Ativo',
  },
])

const clearFilter = () => {
  tp_operador.value = ''
  cliente.value = ''

  selected.label = ''
  selected.type = ''
}
const isOpenDialog = ref(false)
const selected = reactive({
  label: '',
  type: ''
})
</script>

<template>
  <main>
    <div class="panel">
      <div class="flex">
        <div class="flex items-center gap-14">
          <titulo title="Perfil de Operador Cadastrado" />
          <button v-if="props.addButton" @click="isOpenDialog = true" v-tippy:right>
            <icon-add />
          </button>
          <tippy v-if="props.addButton" target="right" placement="right">Cadastre um novo perfil de operador</tippy>
        </div>

        <div v-if="props.addButton" class="header_actions flex items-center justify-end grow gap-5">
          <multiselect v-model="tp_operador" :options="[]" class="custom-multiselect max-w-[200px]"
            placeholder="Tipo operador" :searchable="false" :preselect-first="false" :allow-empty="false"
            selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'tp_operador')" />
          <multiselect v-model="cliente" :options="[]" class="custom-multiselect max-w-[300px]" placeholder="Cliente"
            :searchable="false" :preselect-first="false" :allow-empty="false" selected-label="" select-label=""
            deselect-label="" @select="(selected.label = $event), (selected.type = 'cliente')" />

          <div>
            <button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
              <icon-clear class="w-5 h-5 text-primary" />
            </button>
            <tippy target="top" placement="top">Limpar pesquisa</tippy>
          </div>

          <div>
            <consultas-export v-tippy:top :cols="cols" :rows="rows" filename="Consignatárias Habilitadas"
              export-type="print">
              <template #icon>
                <icon-printer class="w-5 h-5" />
              </template>
            </consultas-export>
            <tippy target="top" placement="top">Imprimir</tippy>
          </div>
        </div>
      </div>

      <div class="table-responsive my-3">
        <table>
          <thead>
            <tr>
              <th>Funcionalidade</th>
              <th>Perfil 1</th>
              <th>Perfil 2</th>
              <th>Perfil 3</th>
              <th>Perfil 4</th>
              <th>Perfil 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consultas</td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
            </tr>
            <tr>
              <td>Cadastros</td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
            </tr>
            <tr>
              <td>Operações</td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
thead tr {
  font-size: 14px;
  font-weight: 600;
  color: #1384AD;
}

tbody tr {
  font-size: 12px;
  font-weight: 400;
  color: #0E1726;
}

tr {
  text-align: center;
}

.header_actions:deep(.custom-multiselect) {
  .multiselect__placeholder {
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 600;
    white-space: nowrap;
    color: rgb(14 23 38);
  }

  .multiselect__option {
    font-size: 0.75rem;
    line-height: 1rem;
    white-space: normal;
  }
}
</style>
