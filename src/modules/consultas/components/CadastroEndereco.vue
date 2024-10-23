<script lang="ts" setup>
import { reactive, ref, inject, onMounted } from 'vue';
import titulo from 'src/core/components/Titulo.vue';
import LabelInput from 'src/core/components/Inputs/InputLabel.vue';
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconClose from 'src/core/components/Icons/IconClose.vue';
import { Emitter, EventType } from 'mitt';
import { tabelasAuxiliaresStore } from 'src/modules/configuracoes/stores/tabelas_auxiliares.store';
import { TableValue } from 'src/modules/configuracoes/types/table_value';

withDefaults(defineProps<{
  flat?: boolean;
  showTitle?: boolean;
}>(), {
  flat: false,
  showTitle: true,
});

const store = tabelasAuxiliaresStore();
const eventBus = inject<Emitter<Record<EventType, unknown>>>('eventBus');
const isDisabled = ref(true);

const addressTypes = ref<TableValue[]>([]);

const enderecos = reactive([
  {
    tipoEndereco: '',
    endereco: '',
    cidade: '',
    uf: '',
  }
]);

const addEndereco = () => {
  if (enderecos.length >= 3) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Limite máximo de contato é de 3',
    });
    return false;
  }

  const lastAddress = enderecos[enderecos.length - 1];

  if (!lastAddress.endereco && !lastAddress.cidade) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Preencha os campos obrigatórios!',
    });
    return false;
  }

  enderecos.push({
    tipoEndereco: '',
    endereco: '',
    cidade: '',
    uf: '',
  });
};

const removeEndereco = (index: number) => {
  if (enderecos.length === 1) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Não foi possível remover contato',
    });
    return false;
  }

  enderecos.splice(index, 1);
};

onMounted(async () => {
  isDisabled.value = true;
  const addressTypesResponse = await store.getValues('tipo-endereco');
  addressTypes.value = addressTypesResponse;
  isDisabled.value = false;
});
</script>

<template>
  <div :class="flat ? '' : 'panel my-3'">
    <titulo v-if="showTitle" title="Endereços" class="mb-6" />
    <div v-for="(endereco, index) in enderecos" :key="`endereco-${index}`" class="flex flex-wrap gap-4 w-full my-3">
      <label-select id="tipo_endereco" label="Tipo Endereço" :disabled="isDisabled" class-label="text-sm"
        class-select="w-full md:flex-grow" layout="row" :options="addressTypes.map((e) => e.nome)" />
      <label-input v-model="endereco.endereco" id="endereco" label="Endereço" :disabled="isDisabled"
        class-label="text-sm" class-input="w-full md:flex-grow" layout="row" />
      <label-input v-model="endereco.cidade" id="cidade" label="Cidade" :disabled="isDisabled" class-label="text-sm"
        class-input="w-full md:flex-grow md:w-40" layout="row" />
      <label-select id="uf" label="UF" :disabled="isDisabled" class-label="text-sm" class-select="w-full md:w-20"
        layout="row" :options="['SP', 'RJ', 'MG', 'ES']" />
      <div class="flex items-center gap-2 w-full md:w-auto">
        <button @click="addEndereco()" v-tippy:right class="flex self-end" v-if="index === enderecos.length - 1">
          <icon-add />
        </button>
        <button @click="removeEndereco(index)" class="flex self-end">
          <icon-close />
        </button>
      </div>
    </div>
  </div>
</template>
