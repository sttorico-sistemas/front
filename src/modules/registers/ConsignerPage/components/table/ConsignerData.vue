<script lang="ts" setup>
	import { onMounted, onUpdated, ref, watch, type PropType } from 'vue'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { InputRoot } from '@/core/components/fields/input'
	import { AddressModel, ConsignerModel } from '@/core/models'
	import Titulo from '@/core/components/Titulo.vue'
	import ConsignerUpdateAction from './ConsignerUpdateAction.vue'
	import {
		keepPreviousData,
		useMutation,
		useQuery,
		useQueryClient,
	} from '@tanstack/vue-query'
	import { consignerRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { computed } from 'vue'
	import * as z from 'zod'

	type ConsignerData = {
		code: string
		name: string
		cnpj: string
		entityType: string
		masterConsigner: string
		shortName: string
		addressType: string
		street: string
		city: string
		uf: string
		zipCode: string
	}

	const queryClient = useQueryClient()
	const notify = useNotify()

	const props = defineProps({
		dataId: { type: Number, required: true },
	})

	const currentCode = computed(() => {
		return props.dataId
	})

	const { data: consigner, isLoading: isConsignerLoading } = useQuery({
		queryKey: consignerRepository.getQueryKey(
			'consigner-by-id',
			{},
			currentCode,
		),
		queryFn: ({ signal }) =>
			consignerRepository.getConsignerById(currentCode.value, { signal }),
	})

	const {
		mutateAsync: handleUpdateConsigner,
		isPending: isUpdateConsignerLoading,
	} = useMutation({
		mutationFn: (data: ConsignerModel) =>
			consignerRepository.updateConsigner(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: consignerRepository.getQueryKey(
					'consigner-by-id',
					{},
					currentCode,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao atualizar o consignante!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignante atualizado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedConsigner = computed(() => {
		return {
			code: consigner?.value?.id ?? '',
			name: consigner?.value?.name ?? '',
			cnpj:
				consigner?.value?.cnpj?.replace(
					/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
					'$1.$2.$3/$4-$5',
				) ?? '',
			entityType: consigner?.value?.entityTypeName ?? '',
			masterConsigner: consigner?.value?.masterConsignerName ?? '',
			shortName: consigner?.value?.shortName ?? '',
			addressType: consigner?.value?.addresses?.addressTypeId ?? '',
			street: consigner?.value?.addresses?.street ?? '',
			city: consigner?.value?.addresses?.cityName ?? '',
			uf: consigner?.value?.addresses?.stateId ?? '',
			zipCode: consigner?.value?.addresses?.zipCode ?? '',
		}
	})

	const formSchema = z.object({
		name: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		shortName: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		cnpj: z
			.string({ message: 'O CNPJ é obrigatório.' })
			.min(1, { message: 'O CNPJ é obrigatório.' }),
		masterConsignerId: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		entityTypeId: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		cityId: z
			.string({ message: 'A cidade é obrigatória.' })
			.min(1, { message: 'A cidade é obrigatória.' }),
		stateId: z
			.string({ message: 'O estado é obrigatório.' })
			.min(1, { message: 'O estado é obrigatório.' }),
		street: z
			.string({ message: 'O logradouro é obrigatório.' })
			.min(1, { message: 'O logradouro é obrigatório.' }),
		zipCode: z
			.string({ message: 'O CEP é obrigatório.' })
			.min(1, { message: 'O CEP é obrigatório.' }),
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & { addressId: number },
		onClose: () => void,
	) => {
		return handleUpdateConsigner(
			new ConsignerModel({
				id,
				...values,
				addresses: new AddressModel({ ...values, id: `${values.addressId}` }),
			}),
		).then(() => {
			onClose()
		})
	}
</script>

<template>
	<div class="flex flex-col gap-y-4">
		<div class="mb-4 flex gap-10 items-center">
			<Titulo title="Dados do Consignante" />

			<ConsignerUpdateAction
				:data-id="Number(consigner?.id)"
				:table-consigner-name="`${consigner?.name}`"
				:is-active="true"
				:is-loading="false"
				@on-edit="onUpdateSubmit"
			/>
		</div>

		<div class="grid grid-cols-28 gap-4">
			<div class="flex flex-col col-span-3">
				<label class="text-left text-2xs tracking-wide">Cód. Consignante</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.code"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-4">
				<label class="text-left text-2xs tracking-wide">CNPJ</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.cnpj"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-8">
				<label class="text-left text-2xs tracking-wide">Consignante</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.name"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-6">
				<label class="text-left text-2xs tracking-wide">Tipo de entidade</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.entityType"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-6">
				<label class="text-left text-2xs tracking-wide">
					Consignante master
				</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.masterConsigner"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>
		</div>

		<div class="grid grid-cols-28 gap-4">
			<div class="flex flex-col col-span-6">
				<label class="text-left text-2xs tracking-wide">Nome curto</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.shortName"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-3">
				<label class="text-left text-2xs tracking-wide">Expediente de</label>
				<input-root
					disabled
					type="text"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-3">
				<label class="text-left text-2xs tracking-wide">Até</label>
				<input-root
					disabled
					type="text"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>
		</div>

		<div class="grid grid-cols-28 gap-4">
			<div class="flex flex-col col-span-4">
				<label class="text-left text-2xs tracking-wide">
					Tipo de Endereço
				</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.addressType"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-12">
				<label class="text-left text-2xs tracking-wide">
					Endereço Completo
				</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.street"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-6">
				<label class="text-left text-2xs tracking-wide">Cidade</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.city"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-2">
				<label class="text-left text-2xs tracking-wide">UF</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.uf"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-3">
				<label class="text-left text-2xs tracking-wide">CEP</label>
				<input-root
					disabled
					type="text"
					v-model="formattedConsigner.zipCode"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>
		</div>

		<div
			v-if="isConsignerLoading"
			class="absolute z-[100] flex h-full w-full items-center justify-center bg-black/40"
		>
			<font-awesome-icon
				v-if="isConsignerLoading"
				:icon="['fas', 'spinner']"
				class="animate-spin"
			/>
		</div>
	</div>
</template>
