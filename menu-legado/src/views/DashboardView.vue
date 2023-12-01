<script setup>

</script>

<template>
  <main class="">
		<ol class="flex">
			<li><a href="javascript:;">Home</a></li>
			<li class="before:content-['/'] before:px-1.5"><a href="javascript:;" class="hover:text-black/70 dark:hover:text-white-light/70">Dashboard</a></li>
		</ol>

		<div class="grid gap-4 grid-cols-12 mt-3 mb-4">
			<div class="panel h-full col-span-3">
				<div class="space-y-9">
						<div class="flex items-center">
								<div class="w-9 h-9 ltr:mr-3 rtl:ml-3">
										<div
												class="bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light rounded-full w-9 h-9 grid place-content-center"
										>
											35%
										</div>
								</div>
								<div class="flex-1">
										<div class="flex font-semibold text-white-dark mb-2">
												<h6>Margem Principal</h6>
												<p class="ltr:ml-auto rtl:mr-auto">R$ 350</p>
										</div>
										<div class="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
												<div class="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-11/12 h-full rounded-full" style="width: 35%;"></div>
										</div>
								</div>
						</div>
						<div class="flex items-center">
								<div class="w-9 h-9 ltr:mr-3 rtl:ml-3">
										<div class="bg-success-light dark:bg-success text-success dark:text-success-light rounded-full w-9 h-9 grid place-content-center">
											5%
										</div>
								</div>
								<div class="flex-1">
										<div class="flex font-semibold text-white-dark mb-2">
												<h6>Margem Secundária</h6>
												<p class="ltr:ml-auto rtl:mr-auto">R$ 50</p>
										</div>
										<div class="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
												<div class="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full" style="width: 5%"></div>
										</div>
								</div>
						</div>
						<div class="flex items-center">
								<div class="w-9 h-9 ltr:mr-3 rtl:ml-3">
										<div class="bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full w-9 h-9 grid place-content-center">
											10%
										</div>
								</div>
								<div class="flex-1">
										<div class="flex font-semibold text-white-dark mb-2">
												<h6>Margem Adicional</h6>
												<p class="ltr:ml-auto rtl:mr-auto">R$ 100</p>
										</div>
										<div class="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
												<div class="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full" style="width: 10%"></div>
										</div>
								</div>
						</div>
				</div>
			</div>
			<div class="panel h-full col-span-2">

			</div>
			<div class="panel h-full col-span-2">

			</div>
			<div class="panel h-full col-span-2">

			</div>
			<div class="panel h-full col-span-3">

			</div>
		</div>
  </main>
</template>

<style lang="scss" scoped>
ol {
	color: #0E1726;
	font-size: 20px;
	font-style: normal;
	font-weight: 600;
	line-height: normal;

	li:first-child {
		color: #4361EE;
	}
}
</style>
