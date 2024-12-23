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
			startOfBusiness: consigner?.value?.startOfBusiness ?? undefined,
			endOfBusiness: consigner?.value?.endOfBusiness ?? undefined,
			masterConsigner: consigner?.value?.masterConsignerName ?? '',
			shortName: consigner?.value?.shortName ?? '',
			addressType: consigner?.value?.addresses?.addressTypeName ?? '',
			street: consigner?.value?.addresses?.street ?? '',
			city: consigner?.value?.addresses?.cityName ?? '',
			uf: consigner?.value?.addresses?.stateName ?? '',
			zipCode: consigner?.value?.addresses?.zipCode ?? '',
		}
	})

	const formSchema = z
		.object({
			name: z
				.string({ message: 'O nome é obrigatório' })
				.min(1, { message: 'O nome é obrigatório.' }),
			shortName: z
				.string({ message: 'O nome é obrigatório' })
				.min(1, { message: 'O nome é obrigatório.' }),
			startOfBusiness: z
				.string({ message: 'O inicio é obrigatório' })
				.optional()
				.nullable(),
			endOfBusiness: z
				.string({ message: 'O fim é obrigatório' })
				.optional()
				.nullable(),
			cnpj: z
				.string({ message: 'O CNPJ é obrigatório.' })
				.min(1, { message: 'O CNPJ é obrigatório.' }),
			masterConsignerId: z
				.string({ message: 'O consignante master é obrigatório' })
				.min(1, { message: 'O consignante master é obrigatório.' }),
			entityTypeId: z
				.string({ message: 'A entidade é obrigatória' })
				.min(1, { message: 'A entidade é obrigatória.' }),
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
		.refine(
			({ startOfBusiness, endOfBusiness }) => {
				if (
					startOfBusiness === null ||
					startOfBusiness === undefined ||
					endOfBusiness === null ||
					endOfBusiness === undefined
				) {
					return
				}

				const [h1, m1] = startOfBusiness.split(':').map(Number)
				const [h2, m2] = endOfBusiness.split(':').map(Number)

				const start = new Date()
				start.setHours(h1, m1, 0, 0)

				const end = new Date()
				end.setHours(h2, m2, 0, 0)

				return start > end
			},
			{
				message: 'O horário de início deve ser menor que o horário de término.',
			},
		)

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
				<label
					for="consigner-data-code"
					class="text-left text-2xs tracking-wide"
					>Cód. Consignante</label
				>
				<input-root
					id="consigner-data-code"
					disabled
					type="text"
					v-model="formattedConsigner.code"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-4">
				<label
					for="consigner-data-cnpj"
					class="text-left text-2xs tracking-wide"
					>CNPJ</label
				>
				<input-root
					id="consigner-data-cnpj"
					disabled
					type="text"
					v-model="formattedConsigner.cnpj"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-8">
				<label
					for="consigner-data-name"
					class="text-left text-2xs tracking-wide"
					>Consignante</label
				>
				<input-root
					id="consigner-data-name"
					disabled
					type="text"
					v-model="formattedConsigner.name"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-6">
				<label
					for="consigner-data-entityType"
					class="text-left text-2xs tracking-wide"
					>Tipo de entidade</label
				>
				<input-root
					id="consigner-data-entityType"
					disabled
					type="text"
					v-model="formattedConsigner.entityType"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-6">
				<label
					for="consigner-data-masterConsigner"
					class="text-left text-2xs tracking-wide"
				>
					Consignante master
				</label>
				<input-root
					id="consigner-data-masterConsigner"
					disabled
					type="text"
					v-model="formattedConsigner.masterConsigner"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>
		</div>

		<div class="grid grid-cols-28 gap-4">
			<div class="flex flex-col col-span-6">
				<label
					for="consigner-data-shortName"
					class="text-left text-2xs tracking-wide"
					>Nome curto</label
				>
				<input-root
					id="consigner-data-shortName"
					disabled
					type="text"
					v-model="formattedConsigner.shortName"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-3">
				<label
					for="consigner-data-start"
					class="text-left text-2xs tracking-wide"
					>Expediente de</label
				>
				<input-root
					id="consigner-data-start"
					disabled
					type="time"
					v-model="formattedConsigner.startOfBusiness"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-3">
				<label for="consigner-data-end" class="text-left text-2xs tracking-wide"
					>Até</label
				>
				<input-root
					id="consigner-data-end"
					disabled
					type="time"
					v-model="formattedConsigner.endOfBusiness"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>
		</div>

		<div class="grid grid-cols-28 gap-4">
			<div class="flex flex-col col-span-4">
				<label
					for="consigner-data-addressType"
					class="text-left text-2xs tracking-wide"
				>
					Tipo de Endereço
				</label>
				<input-root
					id="consigner-data-addressType"
					disabled
					type="text"
					v-model="formattedConsigner.addressType"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-12">
				<label
					for="consigner-data-street"
					class="text-left text-2xs tracking-wide"
				>
					Endereço Completo
				</label>
				<input-root
					id="consigner-data-street"
					disabled
					type="text"
					v-model="formattedConsigner.street"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-6">
				<label
					for="consigner-data-city"
					class="text-left text-2xs tracking-wide"
					>Cidade</label
				>
				<input-root
					id="consigner-data-city"
					disabled
					type="text"
					v-model="formattedConsigner.city"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-2">
				<label for="consigner-data-uf" class="text-left text-2xs tracking-wide"
					>UF</label
				>
				<input-root
					id="consigner-data-uf"
					disabled
					type="text"
					v-model="formattedConsigner.uf"
					class="col-span-5 disabled:opacity-80 disabled:bg-gray-50"
				/>
			</div>

			<div class="flex flex-col col-span-3">
				<label
					for="consigner-data-zipCode"
					class="text-left text-2xs tracking-wide"
					>CEP</label
				>
				<input-root
					id="consigner-data-zipCode"
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
