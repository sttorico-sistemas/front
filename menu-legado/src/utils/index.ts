const formatDate = (date: any) => {
	if (date) {
		const dt = new Date(date)
		const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
		const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
		return day + '/' + month + '/' + dt.getFullYear()
	}
	return ''
}

const capitalize = (text: string) => {
	return text
		.replace('_', ' ')
		.replace('-', ' ')
		.toLowerCase()
		.split(' ')
		.map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(' ')
}

export {
	formatDate,
	capitalize
}