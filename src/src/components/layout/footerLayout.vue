<template>
	<footer class="footer">
		<p class="footer__title">
			© 2023. Sttórico Sistemas Ltda. Todos direitos reservados.
		</p>
		<div class="footer__arrow_up">
			<img src="../../assets/svg/arrowUp.svg" alt="vá para cima" />
		</div>
	</footer>
</template>
<style lang="scss">
	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;

		&__title {
			color: #000;
			font-size: 0.9375rem;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			letter-spacing: 0.00938rem;
		}

		&__arrow_up {
			width: 2.1875rem;
			height: 2.1875rem;
			border: 1px solid #805dca;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
