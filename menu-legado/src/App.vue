<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="dashboard-layout">
    <header>
			<div class="menu flex-wrap">
				<div class="menu__logo mb-1">
					<img src="./assets/images/infoconsig-logo-compact.png" alt="infoconsig" class="menu__logo_compact">
					<img src="./assets/images/infoconsig-logo.png" alt="infoconsig" class="menu__logo_complete">
				</div>
				<div class="menu__profile">
					<ul class="menu__items">
						<li class="menu__items_item"><img src="./assets/svg/exit.svg" alt="sair"></li>
						<li class="menu__items_item"><img src="./assets/svg/calendar.svg" alt="calendario"></li>
						<li class="menu__items_item"><img src="./assets/svg/modo.svg" alt="modo dark"></li>
						<li class="menu__items_item"><img src="./assets/svg/chat.svg" alt="chat"></li>
						<li class="menu__items_item"><img src="./assets/svg/message.svg" alt="mensagens"></li>
						<li class="menu__items_item"><img src="./assets/svg/notification.svg" alt="notificação"></li>
						<li class="menu__items_item"><img src="./assets/svg/profile.svg" alt="perfil"></li>
					</ul>
				</div>
			</div>
			<hr class="separator">
			<div class="menu__main flex-wrap">
				<ul class="menu__main_list mb-1">
					<li class="menu__main_list_item"><img src="./assets/svg/home.svg" alt="Dashboard" class="menu__main_list_icon"> Dashboard</li>
					<li class="menu__main_list_item"><img src="./assets/svg/search.svg" alt="Consultas" class="menu__main_list_icon"> Consultas</li>
					<li class="menu__main_list_item"><img src="./assets/svg/conversation.svg" alt="Solicitações" class="menu__main_list_icon">Solicitações</li>
					<li class="menu__main_list_item"><img src="./assets/svg/calculator.svg" alt="Simulador" class="menu__main_list_icon">Simulador</li>
					<li class="menu__main_list_item"><img src="./assets/svg/documents.svg" alt="Documentos" class="menu__main_list_icon">Documentos</li>
					<li class="menu__main_list_item"><img src="./assets/svg/help.svg" alt="Ajuda" class="menu__main_list_icon">Ajuda</li>
					<li class="menu__main_list_item"><img src="./assets/svg/academic.svg" alt="Educonsig" class="menu__main_list_icon">Educonsig</li>
				</ul>
				<div class="message_welcome">
					<p>Ola, André Marcio Borges</p>
					<p>Seu perfil: <span>Servidor</span></p>
				</div>
			</div>
    </header>

    <div class="main"></div>
    <RouterView />

    <footer class="footer">
      <p class="footer__title">© 2023. Sttórico Sistemas Ltda. Todos direitos reservados.</p>
      <div class="footer__arrow_up">
        <img src="./assets/svg/arrowUp.svg" alt="vá para cima" />
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.separator {
	background: #EAEAEC;
}

header {
	width: 100%;
	height: auto;
	border: 1px solid #EAEAEC;
	background: #fff;
	box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.10);

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

			&_complete{
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
					background-color: #1384AD;
				}
			}
		}
	}

	.menu__main {
		display:  flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 12px;

		&_list {
			display: flex;
			align-items: center;
			gap: 40px;

			&_item {
				display:  flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				padding: 6px 14px;
				color: #0E1726;
				font-size: 14px;
				font-style: normal;
				font-weight: 600;
				line-height: normal;
			}

			&_item:hover {
				background: #1384AD;
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
				color: #3B3F5C;
				font-size: 11px;
				font-style: normal;
				font-weight: 600;
				line-height: normal;

				span {
					color: #1384AD;
				}
			}
		}
	}
}

.dashboard-layout{
	max-width: 1920px;
	margin: 0 auto;
  padding: 13px 20px;
}
.main {
  height: 90vh;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    color: #000;
    font-family: Nunito Sans;
    font-size: .9375rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.00938rem;
  }

  &__arrow_up {
    width: 2.1875rem;
    height: 2.1875rem;
    border: 1px solid #805DCA;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
