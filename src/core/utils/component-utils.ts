import type { Updater } from '@tanstack/vue-query'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Ref } from 'vue'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any, any>>(
  updaterOrValue: T,
  reference: Ref,
) {
  reference.value =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(reference.value)
      : updaterOrValue
}
