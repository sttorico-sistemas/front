import { StatusFormatted } from "@/core/utils/format-status";
import { ColumnDef, ColumnDefResolved } from "@tanstack/vue-table";

function text(data: string) {
	return `<p>${data}</p>`
}

function table(data: string) {
	return `
	<table style="width: 100%; " cellpadding="0" cellcpacing="0">
		${data}
	</table>`
}

function tableHeader(data: string) {
	return `
	<thead>
		${data}
	</thead>`
}

function headerRow(data: string) {
	return `
	<tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; ">
		${data}
	</tr>`
}

function headerCell(data: string) {
	return `
	<th>
		${data}
	</th>`
}

function tableBody(data: string) {
	return `
	<tbody>
		${data}
	</tbody>`
}

function bodyRow(data: string) {
	return `
	<tr>
		${data}
	</tr>`
}

function bodyCell(data: string) {
	return `
	<td>
		${data}
	</td>
	<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>
	`
}

const capitalize = (str: string | StatusFormatted): string => {
	let data: string = ''

	if (typeof str === 'object' && 'text' in str) {
		data = str.text
	} else {
		data = str
	}

	return data
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

export function generatePrint(
	{ columns, data, title }: {
		columns: ColumnDef<any>[],
		data: any[],
		title: string,
	}
) {
	let tableHtml = text(title)
	const tableHeaderCellsHtml = columns.filter(({ meta }) => meta).map(({ meta }) => {
		return headerCell(capitalize(meta as string))
	})
	const tableHeaderHtml = tableHeader(headerRow(tableHeaderCellsHtml.join('')))

	const tableBodyRowsHtml = data.map(item => {
		const tableBodyCellsHtml = columns.filter(({ meta }) => meta).map(({ accessorKey }) => {
			return bodyCell(capitalize(item[accessorKey as keyof typeof data[number]] ?? ''))
		})
		return bodyRow(tableBodyCellsHtml.join(''))
	})
	const tableBodyHtml = tableBody(tableBodyRowsHtml.join(''))
	tableHtml += table(tableHeaderHtml + tableBodyHtml)

	const winPrint = window.open(
		'',
		'',
		'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0',
	)
	if (!winPrint) return
	console.log(tableHtml)
	winPrint.document.write('<title>Print</title>' + tableHtml)
	winPrint.document.close()
	winPrint.focus()
	winPrint.print()
}