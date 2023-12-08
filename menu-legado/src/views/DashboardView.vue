<script setup>
// Componentes
import breadcrumbs from '../components/layout/breadcrumbsLayout.vue'
import distribuicaoMargem from './components/distribuicao-margem/distribuicao-margem.vue'
import formMatriculaSelecionada from './components/form-matricula-selecionada/form-matricula-selecionada.vue'
import margemIndividual from './components/margem-individual/margem-individual.vue'
import saldoDisponivel from './components/saldo-disponivel/saldo-disponivel.vue'
import ultimasNoticias from './components/ultimas-noticias/ultimas-noticias.vue'

</script>

<template>
  <main>
    <breadcrumbs :paginas="['Home', 'Dashboard']" />

    <div class="grid gap-4 grid-cols-12 mt-4 mb-4">
      <div
        class="grid grid-rows-2 grid-flow-col gap-6 col-span-12 md:col-span-4 xl:col-span-3"
      >
        <distribuicao-margem />

        <saldo-disponivel />
      </div>

      <margem-individual />

      <div
        class="grid grid-rows-2 grid-flow-col gap-6 col-span-12 md:col-span-4 xl:col-span-3"
      >
        <form-matricula-selecionada />

        <ultimas-noticias />
      </div>
    </div>
  </main>
</template>
