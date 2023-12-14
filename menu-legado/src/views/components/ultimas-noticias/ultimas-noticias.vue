<script lang="ts" setup>
import { reactive } from 'vue'

interface IMiniPost {
	titulo: string
	descricao: string
	imagem: string
	link: string
}

const post = reactive<IMiniPost>({
	titulo: 'Lorem ipsum dolor sit amet.',
	descricao: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam doloribus.',
	imagem: 'https://placehold.co/600x375?text=Post+Blog',
	link: '/blog/titulo-do-post'
})

</script>
<template>
  <div
    id="post_blog"
    class="panel flex items-center justify-center max-h-[301px] col-span-12 md:col-span-6 xl:col-span-3 px-3 py-6"
  >
    <div
      class="resumo bg-cover bg-center bg-no-repeat bg-gray-200/50 p-7"
      :style="`background-image: url('${post.imagem}')`"
    >
      <h2 class="mb-5">
        {{ post.titulo }}
      </h2>

      <p class="mb-6">
        {{ post.descricao }}
      </p>

      <a
        :href="post.link"
        class="bg-primary text-white px-3 py-2 rounded-md"
      >
        Saiba mais
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#post_blog.panel {
	.resumo {

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