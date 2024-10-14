<script setup>
    import { reactive, ref } from 'vue'
    import VueCollapsible from 'vue-height-collapsible/vue3'

    // Icons
    import IconCaretDown from '@icons/iconCaretDown.vue'
    import IconUser from '@icons/iconUser.vue'
    import IconLock from '@icons/iconLock.vue'
    import IconEye from '@icons/iconEye.vue'

    // Declarações
    const typeInput = ref('password')
    const accordians = reactive({
		dadosContrato: false,
	})
    const labelAccordion = [
        'Nunca acessou o sistema?',
        'Ainda não se conectou utilizando o CPF?',
        'Esqueceu sua senha?',
        'Não está conseguindo acessar o sistema?',
        'Termos e condições de uso do sistema',
        'Política de privacidade',
        ]

    // Scripts
    const showPassword = () => typeInput.value = typeInput.value === 'password' ? 'text' : 'password'
</script>
<template>
  <main class="w-full h-dvh grid grid-cols-1 md:grid-cols-2">
    <div class="hidden md:flex flex-col justify-center bg-primary_3-table px-8">
        <div class="ml-9">
            <img src="../../assets/logo-vazado.png" alt="Bem Vindo">
            <h2 class="text-white text-4xl font-extralight mt-5">Bem Vindo</h2>
        </div>
        <div
            v-for="(label, idx) in labelAccordion"
            :key="idx"
            class="mt-6"
        >
            <button
                type="button"
                class="flex justify-between items-center gap-3 text-lg text-white"
                @click="accordians.dadosContrato === false ? (accordians.dadosContrato = false) : (accordians.dadosContrato = false)"
            >
                <div :class="{ 'rotate-180': accordians.dadosContrato === true }">
                    <icon-caret-down />
                </div>
                {{ label }}
            </button>
            <vue-collapsible :isOpen="accordians.dadosContrato === true">
                <p class="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias qui, iusto ex tenetur saepe numquam dicta quasi assumenda, quaerat corporis id tempore blanditiis possimus hic magnam voluptate, explicabo quia praesentium?</p>
                <p class="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, nam eligendi! Animi error facere, voluptas labore nemo delectus dolorem quasi. Ut distinctio tempore pariatur obcaecati ullam natus quas hic eum.</p>
            </vue-collapsible>
        </div>
    </div>
    <div class="container flex flex-col justify-center items-center">
        <div class="flex flex-col items-center">
            <img src="../../assets/logo-full.png" alt="InfoConsig" class="mb-5">
            <span class="text-xl font-bold">Conecte-se ao Sistema</span>
        </div>
        <form class="mt-8 md:mt-28">
            <div class="relative mb-9">
                <span class="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
                    <icon-user class="text-[#888EA8]" />
                </span>
                <input type="text" v-maska="'###.###.###-##'" id="cpf" class="block py-2.5 ps-6 pe-0 w-[300px] text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer" placeholder=" " />
                <label for="cpf" class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:start-6 peer-focus:start-0 peer-focus:text-gray-500 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">cpf</label>
            </div>
            <div class="relative">
                <span class="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
                    <icon-lock class="text-[#888EA8]" />
                </span>
                <input :type="typeInput" id="password" class="block py-2.5 ps-6 pe-0 w-[300px] text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer" placeholder=" " />
                <label for="password" class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:start-6 peer-focus:start-0 peer-focus:text-gray-500 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">senha</label>
                <span @click="showPassword()" class="absolute bottom-3 right-1 cursor-pointer">
                    <icon-eye class="text-[#888EA8]" />
                </span>
            </div>
            <div class="flex justify-center mt-14">
                <button type="button" class="w-[200px] h-[38px] btn bg-primary_3-table text-white text-base rounded-full">ENTRAR</button>
            </div>
        </form>
        <span class="mt-5 md:mt-16 text-xl font-bold text-primary_3-table">Esqueci minha senha</span>
        <div class="mt-5 md:mt-14 flex justify-center items-center gap-5">
            <img src="../../assets/svg/instagram.svg" alt="Instagram">
            <img src="../../assets/svg/facebook.svg" alt="Facebook">
        </div>
        <span class="text-xs text-primary_3-table absolute bottom-3">© 2024. Sttórico Sistemas Ltda. Todos os direitos reservados.</span>
    </div>
  </main>
</template>
