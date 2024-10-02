<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import VueCollapsible from 'vue-height-collapsible/vue3'
import breadcrumbs from '@/core/components/layout/breadcrumbsLayout.vue'
import titulo from '@/core/components/layout/tituloLayout.vue'
import modalLayout from '@/core/components/layout/modalLayout.vue'
import LabelInput from '@/core/components/layout/forms/inputs/inputLabel.vue'
import LabelSelect from '@/core/components/layout/forms/inputs/selectLabel.vue'

import ConsultasCadastroPessoa from '../consultas/consultas-cadastro-pessoa/consultas-cadastro-pessoa.vue'
import CadastroPerfilOperador from './cadastro-perfil-operador/cadastro-perfil-operador.vue'

// Icons
import IconAdd from '@/core/components/icons/iconAdd.vue'
import IconCaretDown from '@/core/components/icons/iconCaretDown.vue'

// Declarações
const isDisabled = ref(true)
const isOpenDialog = ref(false)
const accordians = reactive({
  perfilOperador: false,
})

</script>
<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Perfil Operador']" />

    <cadastro-perfil-operador add-button class="mt-6" />
  </main>
</template>
