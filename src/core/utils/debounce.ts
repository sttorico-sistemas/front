type DebouncedFunction<T extends (...args: any[]) => any> = (
	...args: Parameters<T>
) => void;

export function debounceAsync<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
): DebouncedFunction<T> {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return async (...args: Parameters<T>): Promise<void> => {
		await new Promise((resolve, reject) => {
			if (timeout !== null) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(async () => {
				try {
					await func(...args)
					resolve(undefined);
				} catch (error) {
					reject(error);
				}
			}, wait);
		}).finally(() => {
			timeout = null
		});
	};
}