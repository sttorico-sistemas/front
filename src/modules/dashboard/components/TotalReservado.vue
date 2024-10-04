<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		totalReservado: number;
	}>(),
	{
		totalReservado: 0,
	},
)
</script>

<template>
	<div
		class="margem_individual__total_reservado flex flex-col items-end justify-end w-full min-h-[86px] bg-white rounded border border-[#e0e6ed] mb-2 pt-5 pb-1 px-4">
		<p>Total Reservado</p>
		<h3>R$ {{ props.totalReservado }}</h3>
	</div>
</template>

<style lang="scss">
.margem_individual__total_reservado {
	h3 {
		color: var(--Danger, #e7515a);
		font-size: 32px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	p {
		color: #151516;
		font-size: 14px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
}
</style>
