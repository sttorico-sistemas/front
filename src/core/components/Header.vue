<script setup lang="ts">
import { ref } from 'vue'

// Components
import IconAcademic from '@/core/components/icons/iconAcademic.vue'
import IconArrowDown from '@/core/components/icons/iconArrowDown.vue'
import IconCalculator from '@/core/components/icons/iconCalculator.vue'
import IconCalendar from '@/core/components/icons/iconCalendar.vue'
import IconChat from '@/core/components/icons/iconChat.vue'
import IconConversation from '@/core/components/icons/iconConversation.vue'
import IconDocuments from '@/core/components/icons/iconDocuments.vue'
import IconExit from '@/core/components/icons/iconExit.vue'
import IconHelp from '@/core/components/icons/iconHelp.vue'
import IconHome from '@/core/components/icons/iconHome.vue'
import IconMessage from '@/core/components/icons/iconMessage.vue'
import IconModo from '@/core/components/icons/iconModo.vue'
import IconNotification from '@/core/components/icons/iconNotification.vue'
import IconProfile from '@/core/components/icons/iconProfile.vue'
import IconSearch from '@/core/components/icons/iconSearch.vue'
import IconConfig from '@/core/components/icons/iconConfig.vue'

// Scripts
const showMenu = ref<string>('')

const toggleShow = (value: string) => {
  showMenu.value = showMenu.value === value ? '' : value
}
</script>
<template>
  <header>
    <div class="menu flex-wrap">
      <div class="menu__logo mb-1">
        <img src="/assets/images/infoconsig-logo-compact.png" alt="infoconsig" class="menu__logo_compact" />
        <img src="/assets/images/infoconsig-logo.png" alt="infoconsig" class="menu__logo_complete" />
      </div>
      <div class="menu__profile">
        <ul class="menu__items">
          <li class="menu__items_item !bg-danger">
            <button v-tippy:top type="button">
              <icon-exit />
            </button>
            <tippy target="top" placement="top"> Deseja sair? </tippy>
          </li>
          <li class="menu__items_item">
            <button v-tippy:top type="button">
              <icon-calendar />
            </button>
            <tippy target="top" placement="top"> Calendario </tippy>
          </li>
          <li class="menu__items_item">
            <button v-tippy:top type="button">
              <icon-modo />
            </button>
            <tippy target="top" placement="top"> Modo Dark </tippy>
          </li>
          <li class="menu__items_item">
            <button v-tippy:top type="button">
              <icon-chat />
            </button>
            <tippy target="top" placement="top"> Chat </tippy>
          </li>
          <li class="menu__items_item">
            <button v-tippy:top type="button">
              <icon-message />
            </button>
            <tippy target="top" placement="top"> Mensagens </tippy>
          </li>
          <li class="menu__items_item">
            <button v-tippy:top type="button">
              <icon-notification />
            </button>
            <tippy target="top" placement="top"> Notificações </tippy>
          </li>
          <li class="menu__items_item">
            <button v-tippy:top type="button">
              <icon-profile />
            </button>
            <tippy target="top" placement="top"> Perfil </tippy>
          </li>
        </ul>
      </div>
    </div>
    <hr class="separator" />
    <div class="menu__main flex-wrap">
      <ul class="menu__main_list mb-1">
        <li>
          <router-link :to="{ name: 'dashboard' }" class="menu__main_list_item">
            <icon-home class="menu__main_list_icon" />
            Dashboard
          </router-link>
        </li>
        <li>
          <button class="menu__main_list_item relative" @click="toggleShow('consultas')">
            <icon-search class="menu__main_list_icon" />
            Consultas
            <icon-arrow-down />
            <div id="dropdownNavbar"
              class="z-10 absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 top-[50px]"
              :class="showMenu === 'consultas' ? '' : 'hidden'">
              <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                <li>
                  <router-link :to="{ name: 'consultas-rmc' }" class="block px-4 py-2 hover:bg-gray-100">
                    RMC
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-contratos' }" class="block px-4 py-2 hover:bg-gray-100">
                    Contratos
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-historico' }" class="block px-4 py-2 hover:bg-gray-100">
                    Histórico de Desconto
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-consignataria-servidor' }"
                    class="block px-4 py-2 hover:bg-gray-100">
                    Consignatária
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-atualizacao-margens' }"
                    class="block px-4 py-2 hover:bg-gray-100">
                    Atualização das Margens
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-historico-reserva-margem' }"
                    class="block px-4 py-2 hover:bg-gray-100">
                    Histórico da Reserva da Margem
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-solicitacoes' }" class="block px-4 py-2 hover:bg-gray-100">
                    Solicitações
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-resumo-margem' }" class="block px-4 py-2 hover:bg-gray-100">
                    Resumo da Margem
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-previsao-descontos' }" class="block px-4 py-2 hover:bg-gray-100">
                    Previsão de Descontos
                  </router-link>
                </li>
                <li class="hidden">
                  <router-link :to="{ name: 'consultas-consignante-master' }" class="block px-4 py-2 hover:bg-gray-100">
                    Consignante Master
                  </router-link>
                </li>
                <li class="hidden">
                  <router-link :to="{ name: 'consultas-consignantes' }" class="block px-4 py-2 hover:bg-gray-100">
                    Consignantes
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-pessoas' }" class="block px-4 py-2 hover:bg-gray-100">
                    Pessoas Cadastradas
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-consignador' }" class="block px-4 py-2 hover:bg-gray-100">
                    Consignador
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'cadastro-operador' }" class="block px-4 py-2 hover:bg-gray-100">
                    Operadores
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'cadastro-perfil-operador' }" class="block px-4 py-2 hover:bg-gray-100">
                    Cadastro Operadores
                  </router-link>
                </li>
              </ul>
            </div>
          </button>
        </li>
        <li>
          <button class="menu__main_list_item relative" @click="toggleShow('cadastro')">
            <icon-calculator class="menu__main_list_icon" />
            Cadastro
            <icon-arrow-down />
            <div id="dropdownNavbar"
              class="z-10 absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 top-[50px]"
              :class="showMenu === 'cadastro' ? '' : 'hidden'">
              <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                <li>
                  <router-link :to="{ name: 'consultas-consignante-master' }" class="block px-4 py-2 hover:bg-gray-100">
                    Consignante Master
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'consultas-consignantes' }" class="block px-4 py-2 hover:bg-gray-100">
                    Consignantes
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'cadastro-administrador' }" class="block px-4 py-2 hover:bg-gray-100">
                    Administrador
                  </router-link>
                </li>
                <hr class="mx-2" />
                <li>
                  <router-link :to="{ name: 'consultas-consignataria-admin' }"
                    class="block px-4 py-2 hover:bg-gray-100">
                    Consignatária Admin
                  </router-link>
                </li>
              </ul>
            </div>
          </button>
        </li>
        <li>
          <button class="menu__main_list_item relative" @click="toggleShow('configuracoes')">
            <icon-config class="menu__main_list_icon" />
            Configurações
            <icon-arrow-down />
            <div id="dropdownNavbar"
              class="z-10 absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 top-[50px]"
              :class="showMenu === 'configuracoes' ? '' : 'hidden'">
              <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                <li>
                  <router-link :to="{ name: 'configuracoes-tabelas-auxiliares' }"
                    class="block px-4 py-2 hover:bg-gray-100">
                    Tableas Auxiliares
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'configuracoes-logomarcas' }" class="block px-4 py-2 hover:bg-gray-100">
                    Logomarcas
                  </router-link>
                </li>
              </ul>
            </div>
          </button>
        </li>
        <li>
          <button class="menu__main_list_item relative" @click="toggleShow('simulador')">
            <icon-calculator class="menu__main_list_icon" />
            Simulador
            <icon-arrow-down />
            <div id="dropdownNavbar"
              class="z-10 absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 top-[50px]"
              :class="showMenu === 'simulador' ? '' : 'hidden'">
              <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                <li>
                  <router-link :to="{ name: 'simulador-taxa-juros' }" class="block px-4 py-2 hover:bg-gray-100">
                    Taxas de Juros
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'simulador-calculadora' }" class="block px-4 py-2 hover:bg-gray-100">
                    Calculadora
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'simulador-emprestimos' }" class="block px-4 py-2 hover:bg-gray-100">
                    Empréstimos
                  </router-link>
                </li>
              </ul>
            </div>
          </button>
        </li>
        <li>
          <button class="menu__main_list_item relative" @click="toggleShow('documentos')">
            <icon-documents class="menu__main_list_icon" />
            Documentos
            <icon-arrow-down />
            <div id="dropdownNavbar"
              class="z-10 absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 top-[50px]"
              :class="showMenu === 'documentos' ? '' : 'hidden'">
              <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                <li>
                  <router-link :to="{ name: 'documentos-arquivados' }" class="block px-4 py-2 hover:bg-gray-100">
                    Arquivados
                  </router-link>
                </li>
              </ul>
            </div>
          </button>
        </li>
        <li>
          <router-link :to="{ name: 'consultas' }" class="menu__main_list_item">
            <icon-help class="menu__main_list_icon" />
            Ajuda
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'consultas' }" class="menu__main_list_item">
            <icon-academic class="menu__main_list_icon" />
            Educonsig
          </router-link>
        </li>
      </ul>
      <div class="message_welcome">
        <p>Ola, André Marcio Borges</p>
        <p>Seu perfil: <span>Servidor</span></p>
      </div>
    </div>
  </header>
  <div class="sub_header">
    <p>Sessão: <span>10</span>Mins <span>00</span>Sec</p>
    <p>Trocar a Matrícula</p>
  </div>
</template>

<style lang="scss">
.separator {
  background: #eaeaec;
}

header {
  width: 100%;
  height: auto;
  border: 1px solid #eaeaec;
  background: #fff;
  box-shadow:
    0px 4px 6px -1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -2px rgba(0, 0, 0, 0.1);

  .menu {
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__logo {
      display: flex;
      align-items: baseline;
      gap: 8px;

      &_compact {
        width: 34px;
        height: 36px;
      }

      &_complete {
        width: 160px;
        height: 32.381px;
      }
    }

    &__profile {
      .menu__items {
        display: flex;
        gap: 8.48px;

        &_item {
          width: 35.519px;
          height: 35.519px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #1384ad;
        }
      }
    }
  }

  .menu__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;

    &_list {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;

      &_item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 6px 14px;
        color: #0e1726;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      &_item:hover {
        background: #1384ad;
        color: #fff;
        border-radius: 8px;
      }

      &_icon {
        width: 22px;
        height: 22px;
      }
    }

    .message_welcome {
      p {
        color: #3b3f5c;
        font-size: 11px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;

        span {
          color: #1384ad;
        }
      }
    }
  }
}

.sub_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 12px;
  margin-bottom: 14px;

  p {
    color: #3b3f5c;
    font-size: 11px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;

    span {
      color: #1384ad;
    }
  }
}
</style>
