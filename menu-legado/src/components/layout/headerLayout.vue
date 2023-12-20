<script setup lang="ts">
// Components
import IconAcademic from '../../assets/svg/iconAcademic.vue'
import IconCalculator from '../../assets/svg/iconCalculator.vue'
import IconCalendar from '../../assets/svg/iconCalendar.vue'
import IconChat from '../../assets/svg/iconChat.vue'
import IconConversation from '../../assets/svg/iconConversation.vue'
import IconDocuments from '../../assets/svg/iconDocuments.vue'
import IconExit from '../../assets/svg/iconExit.vue'
import IconHelp from '../../assets/svg/iconHelp.vue'
import IconHome from '../../assets/svg/iconHome.vue'
import IconMessage from '../../assets/svg/iconMessage.vue'
import IconModo from '../../assets/svg/iconModo.vue'
import IconNotification from '../../assets/svg/iconNotification.vue'
import IconProfile from '../../assets/svg/iconProfile.vue'
import IconSearch from '../../assets/svg/iconSearch.vue'

</script>
<template>
  <header>
    <div class="menu flex-wrap">
      <div class="menu__logo mb-1">
        <img
          src="../../assets/images/infoconsig-logo-compact.png"
          alt="infoconsig"
          class="menu__logo_compact"
        >
        <img
          src="../../assets/images/infoconsig-logo.png"
          alt="infoconsig"
          class="menu__logo_complete"
        >
      </div>
      <div class="menu__profile">
        <ul class="menu__items">
          <li class="menu__items_item !bg-danger">
            <button
              v-tippy:top
              type="button"
            >
              <icon-exit />
            </button>
            <tippy
              target="top"
              placement="top"
            >
              Deseja sair?
            </tippy>
          </li>
          <li class="menu__items_item">
            <button
              v-tippy:top
              type="button"
            >
              <icon-calendar />
            </button>
            <tippy
              target="top"
              placement="top"
            >
              Calendario
            </tippy>
          </li>
          <li class="menu__items_item">
            <button
              v-tippy:top
              type="button"
            >
              <icon-modo />
            </button>
            <tippy
              target="top"
              placement="top"
            >
              Modo Dark
            </tippy>
          </li>
          <li class="menu__items_item">
            <button
              v-tippy:top
              type="button"
            >
              <icon-chat />
            </button>
            <tippy
              target="top"
              placement="top"
            >
              Chat
            </tippy>
          </li>
          <li class="menu__items_item">
            <button
              v-tippy:top
              type="button"
            >
              <icon-message />
            </button>
            <tippy
              target="top"
              placement="top"
            >
              Mensagens
            </tippy>
          </li>
          <li class="menu__items_item">
            <button
              v-tippy:top
              type="button"
            >
              <icon-notification />
            </button>
            <tippy
              target="top"
              placement="top"
            >
              Notificações
            </tippy>
          </li>
          <li class="menu__items_item">
            <button
              v-tippy:top
              type="button"
            >
              <icon-profile />
            </button>
            <tippy
              target="top"
              placement="top"
            >
              Perfil
            </tippy>
          </li>
        </ul>
      </div>
    </div>
    <hr class="separator">
    <div class="menu__main flex-wrap">
      <ul class="menu__main_list mb-1">
        <li>
          <router-link
            :to="{ name: 'dashboard' }"
            class="menu__main_list_item"
          >
            <icon-home class="menu__main_list_icon" />
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'consultas' }"
            class="menu__main_list_item"
          >
            <icon-search class="menu__main_list_icon" />
            Consultas
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'consultas' }"
            class="menu__main_list_item"
          >
            <icon-conversation class="menu__main_list_icon" />
            Solicitações
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'consultas' }"
            class="menu__main_list_item"
          >
            <icon-calculator class="menu__main_list_icon" />
            Simulador
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'consultas' }"
            class="menu__main_list_item"
          >
            <icon-documents class="menu__main_list_icon" />
            Documentos
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'consultas' }"
            class="menu__main_list_item"
          >
            <icon-help class="menu__main_list_icon" />
            Ajuda
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'consultas' }"
            class="menu__main_list_item"
          >
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