<template>
	<section>
		<div class="flex">
			<div class="max-w-xs">
				<label for="wallet" class="block text-sm font-medium text-gray-700"
				>Ticker</label
				>
				<div class="mt-1 relative rounded-md shadow-md">
					<input
							v-model="ticker"
							v-on:keydown.enter="add"
							v-on:input="inputWatcher"
							type="text"
							name="wallet"
							id="wallet"
							class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
							placeholder="Enter ticker"
					/>
				</div>
				<div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
					<template v-if="ticker.length > 0">
              <span
									v-for="hint of hints"
									:key="hint"
									@click="addFromHints(hint)"
									class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              {{ hint }}
            </span>
					</template>
				</div>
				<div
						v-if="tickerAlreadyAdded"
						class="text-sm text-red-600">Already added</div>
			</div>
		</div>
		<add-button @click="add" :disabled="disabled" class="my-4" />
	</section>
</template>

<script>
import AddButton from './AddButton'

export default {
	name: "AddTickerVue",

	components: {
		AddButton
	},

	props: {
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		tickers: {

		},

	},

	emits: {
		'add-ticker': {
			type: value => typeof value === 'string'
		}
	},

	data() {
		return {
			ticker: '',
			tickerAlreadyAdded: false,
			hints: [],
			coinList: [],

		}
	},

	async created() {
		async function collectCoinList(){
			return await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
					.then(response => response.json())
					.then(response => response['Data'])
		}
		this.coinList = await collectCoinList()

	},

	methods: {
		add() {
			if(!this.ticker){
				return
			}
			if(this.disabled) {
				return
			}
			const currentTicker = {
				name: this.ticker.toUpperCase(),
				price: '...'
			}
			if (this.tickers.find(el => el.name === currentTicker.name)) {
				this.tickerAlreadyAdded = true
				return
			}
			this.$emit('add-ticker', this.ticker)
			this.ticker = ''
		},
		inputWatcher(){
			this.tickerAlreadyAdded = false
			this.hints = Object.keys(this.coinList).filter(coinName => {
				return coinName.includes(this.ticker.toUpperCase())
			}).slice(0,4)
		},
		addFromHints(hint){
			this.ticker = hint
			this.add()
		},
	},

}
</script>