export type IconStructure = {
	family: string,
	name: string
}

export const iconDictionary = {
	far: {
		base: 'fa',
		type: 'regular'
	},
	fas: {
		base: 'fa',
		type: 'solid'
	},
}

export const stringSyntaxDictionary = {
	'fa-solid': "fas",
	'fa-regular': "far",
}

export function formatIcon(data: IconStructure) {
	const select = iconDictionary[data.family as keyof typeof iconDictionary]
	return JSON.stringify({ fontawesome: `${select.base}-${select.type} ${select.base}-${data.name}` })
}

export function parseIcon(data: string): IconStructure {
	const [first, second] = data.split(' ')
	const family = stringSyntaxDictionary[first as keyof typeof stringSyntaxDictionary]
	const name = second.split('-')[1]
	return {
		family,
		name
	}
}

