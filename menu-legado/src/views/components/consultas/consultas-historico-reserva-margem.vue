<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'

	import ConsultasTitulo from './consultas-titulo/consultas-titulo.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const margem = ref<string>('')
	const ano = ref<string>('')
	const anos = reactive([2018, 2019, 2020, 2021, 2022, 2023, 2024])
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Histórico da Reserva da Margem']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo title="Histórico da Reserva da Margem" />

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
					<multiselect
						v-model="margem"
						:options="[
							{
								name: 'margem35',
								label: 'Margem 35%',
							},
							{
								name: 'margem10',
								label: 'Margem 10%',
							},
							{
								name: 'margem5',
								label: 'Margem 5%',
							},
						]"
						class="custom-multiselect max-w-[230px]"
						placeholder="Selecione o tipo de Margem"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'margem')"
					/>
					<multiselect
						v-model="ano"
						:options="anos"
						class="custom-multiselect max-w-[200px]"
						placeholder="Selecione o Ano"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'ano')"
					/>
				</div>
			</div>
			<div id="grafico" class="">
				<span>aqui vai um gráfico muito maneiro</span>
			</div>
		</div>
	</main>
</template>
<style lang="scss" scoped>
	.header_actions:deep(.custom-multiselect) {
		.multiselect__placeholder {
			font-size: 0.75rem;
			line-height: 1rem;
			font-weight: 600;
			white-space: nowrap;
			color: rgb(14 23 38);
		}
	}
</style>
