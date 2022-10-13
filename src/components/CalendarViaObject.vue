<script>
export default {
	name: "CalendarViaObject",
	data(){
		return {
			table: [],
			currentSelectedCellCoords: {row: -1, column: -1},
			weekCount: 0,
			isCreated: false,
			applyDayButton: {
				name: this.$options.APPLY_DAY_BUTTON_NAME
			},
		}
	},

	APPLY_DAY_BUTTON_NAME: 'apply day',
	OPEN_DAY_BUTTON_NAME: 'open day',

	APPLY_ROW_BUTTON_NAME: 'apply row',
	OPEN_ROW_BUTTON_NAME: 'open row',

	APPLY_COLUMN_BUTTON_NAME: 'apply column',
	OPEN_COLUMN_BUTTON_NAME: 'open column',

	mounted(){

	},
	beforeUnmount(){

	},
	computed: {
		isSelected(){
			return !Object.values(this.currentSelectedCellCoords).every(value => value === -1)
		},
		selectedCellIsActive(){
			if(!this.isSelected){
				return false
			}
			return this.table[this.currentSelectedCellCoords.row].days[this.currentSelectedCellCoords.column].active
		},
		selectedRowIsActive(){
			if(!this.isSelected){
				return false
			}
			return this.table[this.currentSelectedCellCoords.row].days.every(day => day.active)
		},
		selectedColumnIsActive(){
			if(!this.isSelected){
				return false
			}
			return this.table.every(week => week.days[this.currentSelectedCellCoords.column].active)
		},
	},
	methods: {
		createTable(n){
			const table = new Array(n)
			for (let i = 0; i < table.length; i++) {
				table[i] = {
					days: new Array(7),
					start: 'xx.xx',
					finish: 'xx.xx',
					active: false
				}
				for (let j = 0; j < table[i].days.length; j++) {
					table[i].days[j] = {
						value: '',
						active: false,
						selected: false
					}
				}
			}
			this.table = table
			this.isCreated = true
		},
		addRow(){
			const row = {
				days: new Array(7),
				start: 'xx.xx',
				finish: 'xx.xx',
				active: false
			}
			for (let i = 0; i < row.days.length; i++) {
				row.days[i] = {
					value: '',
					active: false,
					selected: false
				}
			}
			this.table.push(row)
		},
		deleteRow(){
			this.table.pop()
		},
		testConsole(){
			console.log('this.table:', this.table)
		},
		selectCell(e){
			const id = e.target.id.split(':')
			this.currentSelectedCellCoords.row = id[0]
			this.currentSelectedCellCoords.column = id[1]
			this.table[this.currentSelectedCellCoords.row].days[this.currentSelectedCellCoords.column].selected = true
		},
		applyDay(){
			const currentCell = this.table[this.currentSelectedCellCoords.row].days[this.currentSelectedCellCoords.column]
			currentCell.active = !currentCell.active
			this.cancelSelection()
		},
		applyRow(){
			if(this.table[this.currentSelectedCellCoords.row].days.every(day => day.active)){
				this.table[this.currentSelectedCellCoords.row].days.forEach(day => day.active = false)
				this.cancelSelection()
				return
			}
			this.table[this.currentSelectedCellCoords.row].days.forEach(day => day.active = true)
			this.cancelSelection()
		},
		applyColumn(){
			if(this.table.every(week => week.days[this.currentSelectedCellCoords.column].active)){
				this.table.forEach(week => week.days[this.currentSelectedCellCoords.column].active = false)
				this.cancelSelection()
				return
			}
			this.table.forEach(week => week.days[this.currentSelectedCellCoords.column].active = true)
			this.cancelSelection()
		},
		clearAll(){
			this.createTable(this.table.length)
		},
		cancelSelection(){
			this.table.forEach(week => week.days.forEach(day => day.selected = false))
			Object.keys(this.currentSelectedCellCoords).forEach(key => this.currentSelectedCellCoords[key] = -1)
		}
	},
}
</script>

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
			<div v-for="(week, i) in table" :key="week" class="week">
				<div class="week-title">
					<input type="text" maxlength="5" v-model="week.start">
					<input type="text" maxlength="5" v-model="week.finish">
				</div>
				<div v-for="(day, j) in week.days" :key="day" class="day" :class="{'active': day.active}">
					<input
							type="text"
							:id="`${i}:${j}`"
							v-model="day.value"
							@focus="selectCell"
					>
				</div>
			</div>
		</div>
		<div class="table-footer">
			<div class="footer-left">
				<button @click="addRow">+ add row</button>
				<button :disabled="!table.length" @click="deleteRow">- delete row</button>
				<label for="apply-day">
					<button :disabled="!isSelected" @click="applyDay" id="apply-day">{{selectedCellIsActive ? $options.OPEN_DAY_BUTTON_NAME : $options.APPLY_DAY_BUTTON_NAME}}</button>&nbsp;
				</label>
				<label for="apply-row">
					<button :disabled="!isSelected" @click="applyRow" id="apply-row">{{selectedRowIsActive ? $options.OPEN_ROW_BUTTON_NAME : $options.APPLY_ROW_BUTTON_NAME}}</button>&nbsp;
				</label>
				<label for="apply-col">
					<button :disabled="!isSelected" @click="applyColumn" id="apply-column">{{selectedColumnIsActive ? $options.OPEN_COLUMN_BUTTON_NAME : $options.APPLY_COLUMN_BUTTON_NAME}}</button>&nbsp;
				</label>
				<button @click="clearAll">x clear all</button>
				<button @click="testConsole">test</button>
			</div>
			<button class="download">download PDF</button>
		</div>
	</div>
	<div class="initial-state" :class="{'created': isCreated}">
		<div class="initial-state-form" >
			<input type="number" placeholder="Enter number of weeks" v-model="weekCount"> <button @click="createTable(weekCount)" class="create-calendar">Create Calendar</button>
		</div>
		<footer>
			Made with <span>Vue.js</span> by <a href="https://github.com/Jurason">Evgeniy</a>.
			Open Source on <a href="https://github.com/Jurason">GitHub</a>.
		</footer>
	</div>
	</div>

</template>

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
.active {
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
