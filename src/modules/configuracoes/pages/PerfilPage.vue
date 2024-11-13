<script lang="ts" setup>
// Core
import { reactive, ref, onMounted } from 'vue'

import InputLabel from 'src/core/components/Inputs/InputLabel.vue';
import axios from 'axios'
import Swal from 'sweetalert2';
// Props
const props = defineProps({
    addButton: {
        type: Boolean,
        default: false
    }
})
const accordions = ref<{ [key: number]: boolean }>({})
const nomePerfil = ref('')
const checkedPermissions = ref<number[]>([])
// Icons



import IconCaretDown from 'src/core/components/Icons/IconCaretDown.vue';

// Componentes
import VueCollapsible from 'vue-height-collapsible/vue3'

//import titulo from '@components/layout/tituloLayout.vue'
import Titulo from 'src/core/components/Titulo.vue';



// Declarações
const tp_operador = ref('')
const cliente = ref('')


const toggleAccordion = (pageId: number) => {
    accordions.value[pageId] = !accordions.value[pageId]
}

const pages = ref<any[]>([])

const fetchPages = async () => {
    try {
        const authToken = localStorage.getItem('authToken')
        if (authToken) {
            const response = await axios.get('https://dev-02-apiv2.management.infoconsig.tec.br/api/paginas', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            pages.value = response.data.data // Armazena as páginas no estado
        } else {
            console.error('Token não encontrado no storage.')
        }
    } catch (error) {
        console.error('Erro ao buscar dados das páginas:', error)
    }
}

// Script
const clearFilter = () => {
    tp_operador.value = ''
    cliente.value = ''

    selected.label = ''
    selected.type = ''
}

//Salvar perfil e permissoes
//Salvar perfil e permissoes
const submitForm = async () => {
    try {
        const authToken = localStorage.getItem('authToken')
        if (!authToken) throw new Error('Token de autenticação não encontrado')

        const payload = {
            nome: nomePerfil.value,
            permissions: checkedPermissions.value
        }

        const response = await axios.post('https://dev-02-apiv2.management.infoconsig.tec.br/api/auxiliary/tipo-operador', payload, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })

        // Exibir mensagem de sucesso com SweetAlert
        await Swal.fire({
            icon: 'success',
            title: 'Perfil salvo com sucesso!',
            confirmButtonText: 'OK'
        })

        // Limpar o formulário após sucesso
        nomePerfil.value = ''
        checkedPermissions.value = []
        accordions.value = {}
        pages.value = []

        // Atualizar a lista de páginas
        fetchPages()

    } catch (error) {
        console.error('Erro ao salvar o perfil:', error)
        Swal.fire({
            icon: 'error',
            title: 'Erro ao salvar o perfil',
            text: 'Por favor, tente novamente mais tarde.'
        })
    }
}


onMounted(fetchPages)

</script>
<template>
    <main>

        <br>
        <br>
        <br>
        <div>
            <div class="panel">
                <div class="flex items-center gap-14">

                    <titulo title="Cadastro de Perfil" />

                </div>
                <div class="flex flex-col md:flex-row gap-5 mt-3">
                    <InputLabel type="text" id="nome" label="Digite o nome do Perfil" class-label="text-sm"
                        class-input="md:w-[300px]" layout="row" v-model="nomePerfil" />



                </div>


                <div v-for="page in pages" :key="page.id"
                    class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#fff]">
                    <button type="button" class="p-4 w-full flex justify-between items-center text-lg bg-[#fff]"
                        @click="toggleAccordion(page.id)">
                        {{ page.nome }}
                        <div :class="{ 'rotate-180': accordions[page.id] === true }">
                            <icon-caret-down />
                        </div>
                    </button>

                    <vue-collapsible :isOpen="accordions[page.id] === true">
                        <div class="table-responsive my-3">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Funcionalidade</th>
                                        <th>Permissão</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="componente in page.componentes" :key="componente.id">
                                        <td>{{ componente.nome }}</td>
                                        <td>
                                            <input type="checkbox" class="form-checkbox rounded-full"
                                                v-model="checkedPermissions" :value="componente.id" />

                                        </td>

                                    </tr>

                                </tbody>
                            </table>

                        </div>
                    </vue-collapsible>


                </div>
                <button class="mt-6 btn" @click="submitForm">Salvar</button>

            </div>
        </div>
    </main>
</template>
<style lang="scss" scoped>
thead tr {
    font-size: 14px;
    font-weight: 600;
    color: #1384AD;
}

tbody tr {
    font-size: 12px;
    font-weight: 400;
    color: #0E1726;
}

tr {
    text-align: center;
}

.header_actions:deep(.custom-multiselect) {
    .multiselect__placeholder {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 600;
        white-space: nowrap;
        color: rgb(14 23 38);
    }

    .multiselect__option {
        font-size: 0.75rem;
        line-height: 1rem;
        white-space: normal;
    }
}
</style>
