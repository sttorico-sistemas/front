<script setup>
import Multiselect from '@suadelabs/vue3-multiselect'
import { reactive, ref } from 'vue'
import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css'

// Componentes
import Breadcrumbs from './components/custom-breadcrumbs.vue'

// Código
const data = reactive([
	{
		id: 1,
		titulo: 'Total da Margem Principal',
		valor: 350,
		porcentagem: 35,
		total_reservado: 227.5,
		detalhamento: {
			financeiro: 100,
			convenios: 100,
			cartao_credito: 100,
			cartao_beneficios: 100,
		},
	},
	{
		id: 2,
		titulo: 'Total da Margem Secundária',
		valor: 50,
		porcentagem: 5,
		total_reservado: 25,
		detalhamento: {
			financeiro: 100,
			convenios: 100,
			cartao_credito: 100,
			cartao_beneficios: 100,
		},
	},
	{
		id: 3,
		titulo: 'Total da Margem Adicional',
		valor: 100,
		porcentagem: 10,
		total_reservado: 70,
		detalhamento: {
			financeiro: 100,
			convenios: 100,
			cartao_credito: 100,
			cartao_beneficios: 100,
		},
	},
])

const optionsServicos = ref(['Servico 1', 'Servico 2', 'Servico 3'])
const servico = ref()

const optionsMatriculas = ref([123456, 11111, 22222, 333333])
const matricula = ref()
</script>

<template>
  <main>
    <Breadcrumbs :paginas="['Home', 'Dashboard']" />

    <div class="grid gap-4 grid-cols-12 mt-4 mb-4">
      <div
        class="grid grid-rows-2 grid-flow-col gap-6 col-span-12 md:col-span-4 xl:col-span-3"
      >
        <!-- Componente Main #1 -->
        <div
          id="margem_consolidado"
          class="panel max-h-[272px] col-span-12 md:col-span-4 xl:col-span-3 px-3"
        >
          <h2 class="mb-6">
            Distribuição da Margem
          </h2>
          <div class="space-y-9">
            <div class="flex items-center gap-4">
              <div class="w-9 h-9 ltr:mr-3 rtl:ml-3">
                <div
                  class="bg-info text-white rounded-full w-11 h-11 grid place-content-center"
                >
                  35%
                </div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-2">
                  <h6>Margem Principal</h6>
                  <p class="ltr:ml-auto rtl:mr-auto">
                    R$ 350
                  </p>
                </div>
                <div class="rounded-full h-2 bg-dark-light shadow">
                  <div
                    class="bg-info w-11/12 h-full rounded-full"
                    style="width: 35%"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-9 h-9 ltr:mr-3 rtl:ml-3">
                <div
                  class="bg-success text-white rounded-full w-11 h-11 grid place-content-center"
                >
                  5%
                </div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-2">
                  <h6>Margem Principal</h6>
                  <p class="ltr:ml-auto rtl:mr-auto">
                    R$ 50
                  </p>
                </div>
                <div class="rounded-full h-2 bg-dark-light shadow">
                  <div
                    class="bg-success w-11/12 h-full rounded-full"
                    style="width: 5%"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-9 h-9 ltr:mr-3 rtl:ml-3">
                <div
                  class="bg-warning text-white rounded-full w-11 h-11 grid place-content-center"
                >
                  10%
                </div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-2">
                  <h6>Margem Principal</h6>
                  <p class="ltr:ml-auto rtl:mr-auto">
                    R$ 100
                  </p>
                </div>
                <div class="rounded-full h-2 bg-dark-light shadow">
                  <div
                    class="bg-warning w-11/12 h-full rounded-full"
                    style="width: 35%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Componente Main #1 -->

        <!-- Componente Main #2 -->
        <div
          id="saldo_disponivel"
          class="panel max-h-[244px] col-span-12 md:col-span-4 xl:col-span-3 px-3"
        >
          <h2 class="mb-4">
            Saldo Disponível da Margem
          </h2>

          <div class="saldo_disponivel__valor border rounded mb-3 px-2 py-2">
            R$ 0,00
          </div>

          <multiselect
            v-model="servico"
            :options="optionsServicos"
            class="custom-multiselect mb-3"
            :searchable="false"
            placeholder="Selecione Tipo de Serviço"
            :allow-empty="false"
            selected-label=""
            select-label=""
            deselect-label=""
          />

          <div class="flex relative items-stretch flex-wrap">
            <div class="ltr:-mr-px rtl:-ml-px flex">
              <span
                class="border border-[#e0e6ed] dark:border-[#17263c] rounded-l bg-[#EAEAEC] flex items-center justify-center text-black px-4 py-1.5 dark:bg-[#1a1c2d] dark:text-white-dark"
              >
                <img
                  src="../assets/svg/calculator_2.svg"
                  alt="Calcule o saldo disponível da sua Margem"
                >
              </span>
            </div>
            <span
              class="flex-1 flex items-center border rounded-r px-2 calcula_saldo"
            >Calcule o saldo disponível da sua Margem</span>
          </div>
        </div>
        <!-- Componente Main #2 -->
      </div>

      <!-- Componente Main #3 -->
      <div
        v-for="item in data"
        id="margem_individual"
        :key="item.id"
        class="panel max-h-[570px] col-span-8 md:col-span-4 xl:col-span-2"
      >
        <div
          class="margem_individual__principal relative flex flex-col items-baseline w-full min-h-[123px] bg-info rounded border border-[#e0e6ed] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none p-3 mb-2 mt-8 text-start"
        >
          <div
            class="margem_individual__principal__destaque absolute border border-info bg-white text-info rounded-md shadow-md p-2"
          >
            <span>Limite</span>
            <p class="text-info">
              {{ item.porcentagem }}%
            </p>
          </div>

          <h3>R$ {{ item.valor }}</h3>
          <p class="text-white">
            Total da Margem Principal
          </p>
        </div>

        <div
          class="margem_individual__total_reservado flex flex-col items-end justify-end w-full min-h-[86px] bg-white rounded border border-[#e0e6ed] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none mb-2 pt-5 pb-1 px-4"
        >
          <p>Total Reservado</p>
          <h3>R$ {{ item.total_reservado }}</h3>
        </div>

        <div
          class="margem_individual__detalhamento w-full min-h-[266px] bg-white rounded border border-[#e0e6ed] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none px-2 pb-5"
        >
          <h3>Detalhamento da Margem Reservada</h3>

          <div
            class="w-full bg-white rounded border border-[#e0e6ed] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none pr-2 pl-1 py-3"
          >
            <div class="w-full flex justify-between items-center mb-3">
              <div class="flex items-center gap-1">
                <div
                  class="flex justify-center items-center bg-info w-10 h-10 rounded-xl"
                >
                  <img
                    src="../assets/svg/currency.svg"
                    alt="Financeiro"
                  >
                </div>
                <span class="margem_individual__detalhamento__title text-info">Financeiros</span>
              </div>
              <span class="margem_individual__detalhamento__value text-info">R$100,00</span>
            </div>

            <div class="w-full flex justify-between items-center mb-3">
              <div class="flex items-center gap-1">
                <div
                  class="flex justify-center items-center bg-warning w-10 h-10 rounded-xl"
                >
                  <img
                    src="../assets/svg/convenios.svg"
                    alt="Financeiro"
                  >
                </div>
                <span
                  class="margem_individual__detalhamento__title text-warning"
                >Convênios</span>
              </div>
              <span class="margem_individual__detalhamento__value text-warning">R$100,00</span>
            </div>

            <div class="w-full flex justify-between items-center mb-3">
              <div class="flex items-center gap-1">
                <div
                  class="flex justify-center items-center bg-secondry w-10 h-10 rounded-xl"
                >
                  <img
                    src="../assets/svg/creditCard.svg"
                    alt="Financeiro"
                  >
                </div>
                <span
                  class="margem_individual__detalhamento__title text-secondry"
                >Cartão de Crédito</span>
              </div>
              <span class="margem_individual__detalhamento__value text-secondry">R$100,00</span>
            </div>

            <div class="w-full flex justify-between items-center">
              <div class="flex items-center gap-1">
                <div
                  class="flex justify-center items-center bg-primary_3 w-10 h-10 rounded-xl"
                >
                  <img
                    src="../assets/svg/beneficsCard.svg"
                    alt="Financeiro"
                  >
                </div>
                <span
                  class="margem_individual__detalhamento__title text-primary_3"
                >Cartão de Benefícios</span>
              </div>
              <span
                class="margem_individual__detalhamento__value text-primary_3"
              >R$100,00</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Componente Main #3 -->

      <div
        class="grid grid-rows-2 grid-flow-col gap-6 col-span-12 md:col-span-4 xl:col-span-3"
      >
        <!-- Componente Main #4 -->
        <div
          id="matricula_selecionada"
          class="panel bg-warning max-h-[380px] col-span-12 md:col-span-4 xl:col-span-3 px-6 py-5"
        >
          <h2>Matrícula selecionada</h2>

          <multiselect
            v-model="matricula"
            :options="optionsMatriculas"
            class="custom-multiselect my-3"
            :searchable="false"
            :preselect-first="true"
            placeholder="Selecione uma matrícula"
            :allow-empty="false"
            selected-label=""
            select-label=""
            deselect-label=""
          />

          <div class="input-group my-3">
            <label for="ctnConsignante">Consignante:</label>
            <input
              id="ctnConsignante"
              type="text"
              placeholder=""
              class="form-input"
            >
          </div>

          <div class="input-group my-3">
            <label for="ctnAverbador">Averbador:</label>
            <input
              id="ctnAverbador"
              type="text"
              placeholder=""
              class="form-input"
            >
          </div>

          <div class="input-group my-3">
            <label for="ctnCargo">Cargo:</label>
            <input
              id="ctnCargo"
              type="text"
              placeholder=""
              class="form-input"
            >
          </div>

          <div class="input-group my-3">
            <label for="ctnLotação">Lotação:</label>
            <input
              id="ctnLotação"
              type="text"
              placeholder=""
              class="form-input"
            >
          </div>
        </div>
        <!-- Componente Main #4 -->

        <!-- Componente Main #5 -->
        <div
          id="post_blog"
          class="panel flex items-center justify-center max-h-[301px] col-span-12 md:col-span-4 xl:col-span-3 px-3 py-6"
        >
          <div class="resumo p-7">
            <h2 class="mb-5">
              Lorem ipsum dolor sit amet.
            </h2>

            <p class="mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam, doloribus.
            </p>

            <button
              type="button"
              class="btn btn-primary"
            >
              Saiba mais
            </button>
          </div>
        </div>
        <!-- Componente Main #5 -->
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#margem_consolidado.panel {
	h2 {
		color: var(--Black, #0e1726);
		font-size: 19px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	h6 {
		color: var(--White-light-dark, #888ea8);
		font-size: 13px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	p {
		color: var(--White-light-dark, #888ea8);
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
}

#margem_individual.panel {
	.margem_individual__principal {
		h3 {
			color: var(--White, #fff);
			text-align: right;
			font-size: 32px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		p {
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		&__destaque {
			width: 69px;
			height: 66px;
			top: -30px;
			right: 20px;
			text-align: center;
			font-style: normal;
			font-weight: 500;
			line-height: normal;

			span {
				font-size: 12px;
			}

			p {
				font-size: 24px;
			}
		}
	}

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

	.margem_individual__detalhamento {
		h3 {
			margin: 11px 0 5px;
			color: #151516;
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			text-align: center;
		}

		&__title {
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		&__value {
			font-size: 12px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}
	}
}

#saldo_disponivel.panel {
	h2 {
		color: var(--Dark, #3b3f5c);
		font-size: 19px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.saldo_disponivel__valor {
		color: var(--Dark, #3b3f5c);
		font-size: 32px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.calcula_saldo {
		color: var(--Dark, #3b3f5c);
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
}

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

#post_blog.panel {
	.resumo {
		background:
			url('../assets/images/post-blog.jpg'),
			lightgray 50% / cover no-repeat;

		h2 {
			color: var(--White, #fff);
			font-size: 30px;
			font-style: normal;
			font-weight: 600;
			line-height: normal;
		}

		p {
			color: var(--White, #fff);
			font-size: 16px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		button {
			color: var(--White, #fff);
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}
	}
}
</style>
