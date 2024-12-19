<script lang="ts">
	import { h, type PropType } from 'vue'

	export default {
		name: 'RenderElement',
		props: {
			element: {
				type: Object as PropType<Object | null>,
				default: () => null,
			},
			props: {
				type: Object,
				default: () => ({}),
			},
		},
		render() {
			return h(
				'div',
				{ class: 'container m-0' },
				this.element ? [h(this.element, this.props)] : [],
			)
		},
	}
</script>
