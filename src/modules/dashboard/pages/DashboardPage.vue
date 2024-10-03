<script setup>
// Componentes
import breadcrumbs from '@/core/components/Breadcrumbs.vue'
import distribuicaoMargem from '../components/DistribuicaoMargem.vue'
import formMatriculaSelecionada from '../components/FormMatriculaSelecionada.vue'
import margemIndividual from '../components/MargemIndividual.vue'
import saldoDisponivel from '../components/SaldoDisponivel.vue'
import ultimasNoticias from '../components/UltimasNoticias.vue'
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Home', 'Dashboard']" />

    <div class="grid gap-4 grid-cols-12 mt-4 mb-4">
      <div class="grid grid-rows-2 grid-flow-col gap-6 col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-3">
        <distribuicao-margem />

        <saldo-disponivel />
      </div>

      <margem-individual />

      <div class="grid grid-rows-2 grid-flow-col gap-6 col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-3">
        <form-matricula-selecionada />

        <ultimas-noticias />
      </div>
    </div>
  </main>
</template>
