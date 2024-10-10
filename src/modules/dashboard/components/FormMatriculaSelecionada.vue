<script setup lang="ts">
import { ref } from 'vue'

const optionsMatriculas = ref([123456, 11111, 22222, 333333])
const matricula = ref < number | undefined > (undefined);
</script>

<template>
	<div id="matricula_selecionada"
		class="panel bg-warning max-h-[380px] col-span-12 md:col-span-6 xl:col-span-3 px-6 py-5">
		<h2>Matrícula selecionada</h2>

		<multiselect v-model="matricula" :options="optionsMatriculas" class="custom-multiselect my-3" :searchable="false"
			:preselect-first="true" placeholder="Selecione uma matrícula" :allow-empty="false" selected-label=""
			select-label="" deselect-label="" />

		<div class="input-group my-3">
			<label for="ctnConsignante">Consignante:</label>
			<input id="ctnConsignante" type="text" placeholder="" class="form-input" />
		</div>

		<div class="input-group my-3">
			<label for="ctnAverbador">Averbador:</label>
			<input id="ctnAverbador" type="text" placeholder="" class="form-input" />
		</div>

		<div class="input-group my-3">
			<label for="ctnCargo">Cargo:</label>
			<input id="ctnCargo" type="text" placeholder="" class="form-input" />
		</div>

		<div class="input-group my-3">
			<label for="ctnLotação">Lotação:</label>
			<input id="ctnLotação" type="text" placeholder="" class="form-input" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
#matricula_selecionada.panel {
	h2 {
		color: var(--Black, #000);
		font-size: 18px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.input-group {
		color: #000;
		font-size: 12px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
}
</style>
