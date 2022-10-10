<script>

export default {
	name: 'CalendarTable',
	data(){
		return{
			isCreated: false,
			initialWeeksCount: null,

			weeks: null,
			days: 7,

			currentCell: {row: null, column: null, active: false, activeRow: false, activeColumn: false},
			applyDayButton: {
				name: this.$options.APPLY_DAY_BUTTON_NAME
			},
		}
	},

	CURRENT_SELECTED_CELL_CLASS: 'selected',
	ACTIVE_CELL_CLASS: 'active',
	APPLY_DAY_BUTTON_NAME: 'apply day',
	OPEN_DAY_BUTTON_NAME: 'open day',

	mounted() {
		document.addEventListener('keydown', this.handleKeyDown)
	},
	beforeUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown)
	},
	computed:{
		isActive(){
			return this.currentCell.active
		},
		isSelected(){
			return Object.values(this.currentCell).some(value => value)
		},

	},
	methods:{
		handleKeyDown(e){
			if(e.key === 'Escape' || e.key === 'Enter'){
				document.querySelectorAll('input').forEach(input => input.blur())
				Object.keys(this.currentCell).forEach(key => {
					if(key !== 'active'){
						this.currentCell[key] = null
						return
					}
					this.currentCell[key] = false
				})
				this.clearSelection()
			}
		},
		test(){
			console.log('Test!')
		},
		createCalendar(){
			if(!this.initialWeeksCount){
				document.querySelector('input').blur()
				return
			}
			this.weeks = this.initialWeeksCount
			this.isCreated = true
			this.initialWeeksCount = null
			document.querySelectorAll('input').forEach(input => input.blur())
		},
		addRow(){
			this.weeks++
		},
		deleteRow(){
			if(this.weeks <= 0){
				return
			}
			this.weeks--
		},
		selectCell(e){
			this.currentCell['row'] = e.target.attributes.row.value
			this.currentCell['column'] = e.target.attributes.column.value
			this.currentCell['active'] = e.target.classList.contains('active') ? true : false
			this.updateActiveColumnData()
			this.updateActiveRowData()

			this.clearSelection()

			e.target.classList.add(this.$options.CURRENT_SELECTED_CELL_CLASS)
		},
		clearSelection(){
			const selectedCell = document.querySelector(`.${this.$options.CURRENT_SELECTED_CELL_CLASS}`)
			if(selectedCell){
				selectedCell.classList.remove(this.$options.CURRENT_SELECTED_CELL_CLASS)
			}
		},
		applyDay() {
			const selectedCell = document.querySelector(`.${this.$options.CURRENT_SELECTED_CELL_CLASS}`)
			if(!selectedCell){
				return
			}
			if(selectedCell.classList.contains(this.$options.ACTIVE_CELL_CLASS)){
				selectedCell.classList.remove(this.$options.ACTIVE_CELL_CLASS)
				this.currentCell.active = false
				return
			}
			selectedCell.classList.add(this.$options.ACTIVE_CELL_CLASS)
			this.currentCell.active = true
		},
		applyRow(){
			const row = document.querySelectorAll(`input[row="${this.currentCell.row}"]`)
			row.forEach(box => box.classList.add(this.$options.ACTIVE_CELL_CLASS))
		},
		applyColumn(){
			const row = document.querySelectorAll(`input[column="${this.currentCell.column}"]`)
			row.forEach(box => box.classList.add(this.$options.ACTIVE_CELL_CLASS))
		},
		clearAll(){
			const allCells = document.querySelectorAll('.day > input')
			allCells.forEach(input => {
				input.classList.remove(this.$options.CURRENT_SELECTED_CELL_CLASS)
				input.classList.remove(this.$options.ACTIVE_CELL_CLASS)
				input.value = ''
			})
		},
		updateActiveRowData(){
			if(!this.isSelected){
				return false
			}
			const currentRow = document.querySelectorAll(`input[row="${this.currentCell.row}"]`)
			this.currentCell.activeRow = !Array.from(currentRow).filter(input => !input.classList.contains(this.$options.ACTIVE_CELL_CLASS)).length
		},
		updateActiveColumnData(){
			if(!this.isSelected){
				return false
			}
			const currentColumn = document.querySelectorAll(`input[column="${this.currentCell.column}"]`)
			this.currentCell.activeColumn = !Array.from(currentColumn).filter(input => !input.classList.contains(this.$options.ACTIVE_CELL_CLASS)).length
		},

	}
}
</script>
<style>

	.wrapper {
		z-index: 2;
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: space-between;
		align-items: center;
		padding-top: 50px;
		padding-bottom: 50px;
	}
	.selected {
		border-style: dashed;
	}
	.wrapper-table {
		width: calc(100vw - 200px);
	}
	.main {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.25em;
		width: 100%;
	}
	.week {
		display: grid;
		grid-template-columns: 50px repeat(7,1fr);
		gap: 0.25em;
		max-width: 100%;
		text-align: center;
	}
	.day input {
		width: 100%;
		outline: none;
		background-color: antiquewhite;
		text-align: center;
	}
	.day .active {
		background-color: brown;
	}
	.week-title {
		display: flex;
		flex-direction: column;
	}
	.week-title input {
		height: 20px;
		font-size: 10px;
		border: none;
	}
	.table-footer {
		display: flex;
		justify-content: space-between;
		max-width: 100%;
		margin-top: 1em;
	}

	.footer-left {
		display: flex;
		gap: 1em;
	}
	footer {

	}
	.download {
		border-radius: 0.25rem;
		background-color: green;
		color: white;
		padding: .125rem .5rem;
	}
	.initial-state {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
	}
	.created {
		margin-top: 50px;
		height: 20vh;
	}
	.initial-state-form {
		display: flex;
		flex-direction: column;
		gap: 1em;
		margin-bottom: 50px;
		text-align: left;
	}
	button:disabled {
		color: red;
	}
	input[type=checkbox][disabled] {
		color: red;
	}
	.create-calendar {
		appearance: none;
		backface-visibility: hidden;
		background-color: #27ae60;
		border-radius: 8px;
		border-style: none;
		box-shadow: rgba(39, 174, 96, .15) 0 4px 9px;
		box-sizing: border-box;
		color: #fff;
		cursor: pointer;
		display: inline-block;
		font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: normal;
		line-height: 1.5;
		outline: none;
		overflow: hidden;
		padding: 13px 20px;
		position: relative;
		text-align: center;
		text-decoration: none;
		transform: translate3d(0, 0, 0);
		transition: all .3s;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		vertical-align: top;
		white-space: nowrap;
 }

	.create-calendar:hover {
		background-color: #1e8449;
		opacity: 1;
		transform: translateY(0);
		transition-duration: .35s;
	}

	.create-calendar:active {
		transform: translateY(2px);
		transition-duration: .35s;
	}

	.create-calendar:hover {
		box-shadow: rgba(39, 174, 96, .2) 0 6px 12px;
	}
	.blur {
		position: absolute;
		width: 100vw;
		height: 100vh;
		opacity: .4;
		background: brown;
		z-index: -1;
	}
</style>

<template>
	<div class="blur"></div>
	<div class="wrapper">
	<div v-if="isCreated" class="wrapper-table">
		<div class="main">
			<div class="week">
				<div>/</div>
				<div>Sunday</div>
				<div>Monday</div>
				<div>Tuesday</div>
				<div>Wednesday</div>
				<div>Thursday</div>
				<div>Friday</div>
				<div>Saturday</div>
			</div>
			<div v-for="(week, i) in weeks" :key="week" class="week">
				<div class="week-title">
					<input type="text" maxlength="5" class="" placeholder="XX.XX">
					<input type="text" maxlength="5" class="" placeholder="XX.XX">
				</div>
				<div v-for="(day, j) in days" :key="day" class="day">
					<input
							type="text"
							:row="i"
							:column="j"
							@focus="selectCell">
				</div>
			</div>
		</div>
		<div class="table-footer">
			<div class="footer-left">
				<button @click="addRow">+ add row</button>
				<button @click="deleteRow">- delete row</button>
				<label for="apply-day">
					<button :disabled="!isSelected" @click="applyDay" id="apply-day">{{ applyDayButton.name = isActive ? $options.OPEN_DAY_BUTTON_NAME : $options.APPLY_DAY_BUTTON_NAME }}</button>&nbsp;
				</label>
				<label for="apply-row">
					<input :disabled="!isSelected" :checked="currentCell.activeRow" @click="applyRow" type="checkbox" id="apply-row">&nbsp;
					<span>apply row</span>
				</label>
				<label for="apply-col">
					<input :disabled="!isSelected" :checked="currentCell.activeColumn" @click="applyColumn" type="checkbox" id="apply-col">&nbsp;
					<span>apply column</span>
				</label>
				<button @click="clearAll">x clear all</button>
				<button @click="test">test</button>
			</div>
			<button class="download">download PDF</button>
		</div>
	</div>
	<div class="initial-state"
			:class="{
			'created': isCreated
			}">
		<div class="initial-state-form" >
			<input type="number" v-model="initialWeeksCount" @keydown.enter="createCalendar" placeholder="Enter number of weeks"> <button @click="createCalendar" class="create-calendar">Create Calendar</button>
		</div>
		<footer>
			Made with <span>Vue.js</span> by <a href="https://github.com/Jurason">Evgeniy</a>.
			Open Source on <a href="https://github.com/Jurason">GitHub</a>.
		</footer>
	</div>
	</div>
</template>


