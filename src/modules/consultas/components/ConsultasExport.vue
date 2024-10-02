<script lang="ts" setup>
import { capitalizeString } from 'src/core/utils/capitalize_string'

const props = defineProps({
	name: {
		type: String,
		default: '',
	},
	filename: {
		type: String,
		default: 'Relatório Impresso',
	},
	cols: {
		type: Object,
		required: true,
	},
	rows: {
		type: Object,
		required: true,
	},
	exportType: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
		default: '',
	},
})

const exportTable = (type: string) => {
	const columns: any = props.cols.map((d: any) => d.field)

	const records = props.rows

	if (type === 'print') {
		let rowhtml = '<p>' + props.filename + '</p>'
		rowhtml +=
			'<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> '
		columns.map((d: any) => {
			rowhtml += '<th>' + capitalizeString(d) + '</th>'
		})
		rowhtml += '</tr></thead>'
		rowhtml += '<tbody>'

		records.map((item: any) => {
			rowhtml += '<tr>'
			columns.map((d: any) => {
				let val = item[d] ? item[d] : ''

				if (Object.prototype.hasOwnProperty.call(item[d], 'label'))
					val = item[d].label

				rowhtml += '<td>' + val + '</td>'
			})
			rowhtml += '</tr>'
		})
		rowhtml +=
			'<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>'
		rowhtml += '</tbody></table>'

		const winPrint: any = window.open(
			'',
			'',
			'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0',
		)
		winPrint.document.write('<title>Print</title>' + rowhtml)
		winPrint.document.close()
		winPrint.focus()
		winPrint.print()
		// winPrint.close()
	}
}
</script>

<template>
	<button type="button" class="text-xs" @click="exportTable(props.exportType)">
		<slot name="icon"></slot>
		{{ props.name }}
	</button>
</template>
