<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue'
	import axios from 'axios'
	import Swal from 'sweetalert2'

	// Importação de ícones
	import IconArrowDown from 'src/core/components/Icons/IconArrowDown.vue'
	import IconCalendar from 'src/core/components/Icons/IconCalendar.vue'
	import IconChat from 'src/core/components/Icons/IconChat.vue'
	import IconExit from 'src/core/components/Icons/IconExit.vue'
	import IconMessage from 'src/core/components/Icons/IconMessage.vue'
	import IconModo from 'src/core/components/Icons/IconModo.vue'
	import IconNotification from 'src/core/components/Icons/IconNotification.vue'
	import IconProfile from 'src/core/components/Icons/IconProfile.vue'
	import { useAxios, useStorage } from '../composables'
	import { useQuery } from '@tanstack/vue-query'
	import { generalRepository } from '../stores/general.stores'
	import {
		Menubar,
		MenubarContent,
		MenubarItem,
		MenubarMenu,
		MenubarTrigger,
	} from '@/core/components/menubar'
	import { Skeleton } from '@/core/components/skeleton'
	import { useRouter } from 'vue-router'

	// Gerenciamento do estado do menu
	const showMenu = ref('')
	const userName = ref<string>('')
	const userRole = ref<string>('')
	const operadorId = ref<string | undefined>(undefined)
	const storage = useStorage()
	const httpClient = useAxios()
	const enabledPages = computed(() => !!operadorId.value)
	const router = useRouter()

	// Estado do usuário

	const { data: pages } = useQuery({
		enabled: enabledPages,
		queryKey: generalRepository.getQueryKey('pages'),
		queryFn: ({ signal }) =>
			generalRepository.getPagesToMenu({
				signal,
				params: { operador_id: operadorId.value },
			}),
	})

	const pagesData = computed(() => pages?.value ?? [])

	// Função para buscar dados do usuário
	const fetchUserData = async () => {
		try {
			const authToken = storage.getItem('authToken')
			if (authToken) {
				const response = await httpClient.get<any>('/user')

				const userData = response
				userName.value = userData.nome
				userRole.value = userData.operador.tipo_operador.name
				operadorId.value = userData.operador_id
				storage.setItem('operadorId', userData.operador_id)
			} else {
				console.error('Token não encontrado no storage.')
			}
		} catch (error) {
			console.error('Erro ao buscar dados do usuário:', error)
		}
	}

	const toggleShow = (value: string) => {
		showMenu.value = showMenu.value === value ? '' : value
	}

	// Função de logout com SweetAlert
	const confirmLogout = () => {
		Swal.fire({
			title: 'Deseja sair?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sim',
			cancelButtonText: 'Não',
		}).then((result) => {
			if (result.isConfirmed) {
				storage.clear() // Limpa o storage
				window.location.href = '/login' // Redireciona para a página de login
			}
		})
	}

	onMounted(() => {
		const operadorStorageId = storage.getItem('operadorId')
		if (operadorStorageId) {
			operadorId.value = operadorStorageId
		}
		fetchUserData()
	})
</script>

<template>
	<header>
		<div class="menu flex-wrap">
			<div class="menu__logo mb-1">
				<img
					src="/assets/images/infoconsig-logo-compact.png"
					alt="infoconsig"
					class="menu__logo_compact"
				/>
				<img
					src="/assets/images/infoconsig-logo.png"
					alt="infoconsig"
					class="menu__logo_complete"
				/>
			</div>
			<div class="menu__profile">
				<ul class="menu__items">
					<li class="menu__items_item !bg-danger">
						<button v-tippy:top type="button" @click="confirmLogout">
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
			<!-- <ul class="menu__main_list mb-1">
				<li v-for="page in pagesData" :key="page.id" class="relative">
					<router-link
						v-if="!page.children || !page.children.length"
						:to="page.url"
						class="menu__main_list_item"
					>
						{{ page.name }}
					</router-link>

					<div v-else>
						<button
							class="menu__main_list_item relative"
							@click="toggleShow(page.slug)"
						>
							{{ page.name }}
							<icon-arrow-down />
						</button>
						<div
							id="dropdownNavbar"
							class="absolute left-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 z-10"
							:class="showMenu === page.slug ? '' : 'hidden'"
						>
							<ul class="py-2 text-sm text-gray-700">
								<li v-for="child in page.children" :key="child.id">
									<router-link
										:to="child.url"
										class="block px-4 py-2 hover:bg-gray-100"
									>
										{{ child.name }}
									</router-link>
								</li>
							</ul>
						</div>
					</div>
				</li>
			</ul> -->

			<div class="flex gap-5">
				<menubar
					v-if="pagesData.length > 0"
					v-for="page in pagesData"
					:key="page.id"
				>
					<menubar-menu>
						<menubar-trigger
							@click="
								() => {
									if (!page?.children || !page?.children.length)
										router.push(page.url)
								}
							"
							class="rounded-lg flex flex-1 gap-2 justify-center items-center px-4 py-2 hover:bg-[#1384ad] hover:text-white focus:bg-[#1384ad] focus:text-white"
						>
							<p class="font-semibold text-sm flex-1">
								{{ page.name }}
							</p>
							<icon-arrow-down v-if="page.children && page.children.length" />
						</menubar-trigger>
						<menubar-content v-if="page.children && page.children.length > 0">
							<menubar-item v-for="child in page.children" :key="child.id" class="p-0">
								<router-link
									:to="child.url"
									class="block px-4 py-4 hover:bg-gray-100 flex-1"
								>
									{{ child.name }}
								</router-link>
							</menubar-item>
						</menubar-content>
					</menubar-menu>
				</menubar>

				<menubar
					v-else
					v-for="page in Array.from({ length: 7 }, (_, i) => i)"
					:key="`menubar_skeleton_${page}`"
				>
					<menubar-menu>
						<menubar-trigger
							class="rounded-lg flex gap-2 p-0"
							as-child
							disabled
						>
							<skeleton class="h-6 w-32 m-2" />
						</menubar-trigger>
					</menubar-menu>
				</menubar>
			</div>

			<div class="message_welcome">
				<p>Olá, {{ userName }}</p>
				<p>
					Seu perfil: <span>{{ userRole }}</span>
				</p>
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
