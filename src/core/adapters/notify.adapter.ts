import { h } from "vue";

import { useToast, ToastAction } from "@/core/components/sweet-alert";
import { BaseError } from "@/core/errors/base.error";
import type { NotifyProps, Notify, NotifyOptions } from "@/core/types";

export class NotifyAdapter implements Notify {
	private readonly statusToSkip = [401, 403]
	private readonly notifyInstance

	constructor() {
		this.notifyInstance = useToast()
	}

	private readonly defaultErrorProps: NotifyProps = {
		title: 'Erro na solicitação',
	}

	private readonly defaultSuccessProps: NotifyProps = {
		title: 'Sucesso na solicitação',
	}

	private readonly defaultConfigs: NotifyOptions = {
		buttonText: 'Continuar'
	}

	error(error: any, props?: NotifyProps, config?: NotifyOptions): void {
		if (error instanceof BaseError && error.code && this.statusToSkip.includes(error.code)) {
			return
		}

		this.notifyInstance.toast({
			variant: 'destructive',
			title: props?.title ?? this.defaultErrorProps.title,
			description: props?.description ?? this.defaultErrorProps.description,
			action: config?.hasButton ?
				h(ToastAction,
					{
						altText: config?.buttonText ?? this.defaultConfigs.buttonText as string,
						'onClick': () => {
							if (!config?.onClick) return
							config.onClick()
						}
					},
					{
						default: config?.buttonText ?? this.defaultConfigs.buttonText
					}
				)
				: undefined
		})
	}

	success(props?: NotifyProps, config?: NotifyOptions): void {
		this.notifyInstance.toast({
			variant: 'default',
			title: props?.title ?? this.defaultErrorProps.title,
			description: props?.description ?? this.defaultErrorProps.description,
			action: config?.hasButton ?
				h(ToastAction,
					{
						altText: config?.buttonText ?? this.defaultConfigs.buttonText as string,
						'onClick': () => {
							if (!config?.onClick) return
							config.onClick()
						}
					},
					{
						default: config?.buttonText ?? this.defaultConfigs.buttonText
					}
				)
				: undefined
		})
	}

	info(props: NotifyProps, config?: NotifyOptions): void {
		this.notifyInstance.toast({
			variant: 'default',
			title: props?.title ?? this.defaultErrorProps.title,
			description: props?.description ?? this.defaultErrorProps.description,
			action: config?.hasButton ?
				h(ToastAction,
					{
						altText: config?.buttonText ?? this.defaultConfigs.buttonText as string,
						'onClick': () => {
							if (!config?.onClick) return
							config.onClick()
						}
					},
					{
						default: config?.buttonText ?? this.defaultConfigs.buttonText
					}
				)
				: undefined
		})
	}
}