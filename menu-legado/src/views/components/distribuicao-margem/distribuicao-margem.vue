<script lang="ts" setup>
import { reactive } from 'vue'

interface IMargem {
	id: number,
	titulo: string,
	porcentagem: number,
	valor: number,
}

const margens = reactive<IMargem[]>([
	{
		id: 1,
		titulo: 'Margem Principal',
		porcentagem: 35,
		valor: 350,
	},
	{
		id: 2,
		titulo: 'Margem Secundária',
		porcentagem: 5,
		valor: 50,
	},
	{
		id: 3,
		titulo: 'Margem Adicional',
		porcentagem: 10,
		valor: 100,
	},
])

const color = (value: number) => {
	switch (value) {
	case 1:
		return 'bg-info'
	case 2:
		return 'bg-success'
	case 3:
		return 'bg-warning'
	}
}
</script>

<template>
  <div
    id="margem_consolidado"
    class="panel max-h-[272px] col-span-12 md:col-span-4 xl:col-span-3 px-3"
  >
    <h2 class="mb-6">
      Distribuição da Margem
    </h2>
    <div class="space-y-9">
      <div
        v-for="margem in margens"
        :key="margem.id"
        class="flex items-center gap-4"
      >
        <div class="w-9 h-9 ltr:mr-3 rtl:ml-3">
          <div
            class="text-white rounded-full w-11 h-11 grid place-content-center"
            :class="color(margem.id)"
          >
            {{ margem.porcentagem }}%
          </div>
        </div>
        <div class="flex-1">
          <div class="flex justify-between mb-2">
            <h6>{{ margem.titulo }}</h6>
            <p class="ltr:ml-auto rtl:mr-auto">
              R$ {{ margem.valor }}
            </p>
          </div>
          <div class="rounded-full h-2 bg-dark-light shadow">
            <div
              class="w-11/12 h-full rounded-full"
              :style="`width: ${margem.porcentagem}%`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#margem_consolidado.panel {
	h2 {
		color: var(--Black, #0e1726);
		font-size: 19px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	h6 {
		color: var(--White-light-dark, #888ea8);
		font-size: 13px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	p {
		color: var(--White-light-dark, #888ea8);
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
}
</style>
