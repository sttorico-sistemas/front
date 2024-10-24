<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue';
import titulo from 'src/core/components/Titulo.vue';
import LabelInput from 'src/core/components/Inputs/InputLabel.vue';
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconClose from 'src/core/components/Icons/IconClose.vue';
import { Emitter, EventType } from 'mitt';
import { tabelasAuxiliaresStore as _tabelasAuxiliaresStore } from 'src/modules/configuracoes/stores/tabelas_auxiliares.store';
import { TableValue } from 'src/modules/configuracoes/types/table_value';
import { locationStore as _locationStore } from '../stores/location.store';
import { LocationState } from '../types/location_state.d';

const props = withDefaults(defineProps<{
  flat?: boolean;
  showTitle?: boolean;
  modelValue?: {
    addressType: string;
    address: string;
    city: string;
    uf: string;
  }[];
}>(), {
  flat: false,
  showTitle: true,
  modelValue: () => [
    {
      address: '',
      addressType: '',
      city: '',
      uf: '',
    }
  ],
});

const emit = defineEmits(['update:modelValue']);

const tabelasAuxiliaresStore = _tabelasAuxiliaresStore();
const locationStore = _locationStore();

const eventBus = inject<Emitter<Record<EventType, unknown>>>('eventBus');
const isDisabled = ref(true);

const addressTypes = ref<TableValue[]>([]);
const states = ref<LocationState[]>([]);

const addresses = ref(props.modelValue);

const addEndereco = () => {
  if (addresses.value.length >= 3) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Limite máximo de contato é de 3',
    });
    return false;
  }

  const lastAddress = addresses.value[addresses.value.length - 1];

  if (!lastAddress.address && !lastAddress.city) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Preencha os campos obrigatórios!',
    });
    return false;
  }

  addresses.value.push({
    addressType: '',
    address: '',
    city: '',
    uf: '',
  });
};

const removeEndereco = (index: number) => {
  if (addresses.value.length === 1) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Não foi possível remover contato',
    });
    return false;
  }

  addresses.value.splice(index, 1);
};

onMounted(async () => {
  isDisabled.value = true;
  addressTypes.value = await tabelasAuxiliaresStore.getValues('tipo-endereco');;
  states.value = await locationStore.getStates();
  isDisabled.value = false;
});

watch(() => props.modelValue, (value) => {
  addresses.value = value;
}, {
  deep: true,
});

watch(addresses, (value) => {
  emit('update:modelValue', value);
}, {
  deep: true,
});
</script>

<template>
  <div :class="flat ? '' : 'panel my-3'">
    <titulo v-if="showTitle" title="Endereços" class="mb-6" />
    <div v-for="(address, index) in addresses" :key="`endereco-${index}`" class="flex flex-wrap gap-4 w-full my-3">
      <label-select id="tipo_endereco" label="Tipo Endereço" :disabled="isDisabled" class-label="text-sm"
        class-select="w-full md:flex-grow md:w-50" layout="row" :options="addressTypes.map((e) => e.nome)" />
      <label-input v-model="address.address" id="endereco" label="Endereço" :disabled="isDisabled" class-label="text-sm"
        class-input="w-full md:flex-grow" layout="row" />
      <label-input v-model="address.city" id="cidade" label="Cidade" :disabled="isDisabled" class-label="text-sm"
        class-input="w-full md:flex-grow md:w-40" layout="row" />
      <label-select id="uf" label="UF" :disabled="isDisabled" class-label="text-sm" class-select="w-full md:w-20"
        layout="row" :options="states.map((e) => e.uf)" />
      <div class="flex items-center gap-2 w-full md:w-auto">
        <button @click="addEndereco()" v-tippy:right class="flex self-end" v-if="index === addresses.length - 1">
          <icon-add />
        </button>
        <button @click="removeEndereco(index)" class="flex self-end">
          <icon-close />
        </button>
      </div>
    </div>
  </div>
</template>
