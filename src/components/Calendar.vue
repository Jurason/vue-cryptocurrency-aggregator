<script>
export default {
	name: 'CalendarTable',
	data(){
		return{
			msg: '',
			days: 7,
			weeks: 4,
		}
	}
}
</script>
<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: space-between;
		align-items: center;
		padding-top: 50px;
		padding-bottom: 50px;
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
	.week input {
		width: 100%;
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

</style>

<template>
	<div class="wrapper">
	<div class="wrapper-table">
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
			<div v-for="week in weeks" :key="week" class="week">
				<div class="week-title">
					<input type="text" maxlength="5" class="" placeholder="XX.XX">
					<input type="text" maxlength="5" class="" placeholder="XX.XX">
				</div>
				<div v-for="day in days" :key="day" class="day">
					<input type="text" :id="day">
				</div>
			</div>
		</div>
		<div class="table-footer">
			<div class="footer-left">
				<button >+ add row</button>
				<button >- delete row</button>
				<label for="apply-row">
					<input type="checkbox" id="apply-row">
					<span>apply row</span>
				</label>
				<label for="apply-col">
					<input type="checkbox" id="apply-col">
					<span>apply column</span>
				</label>
				<button >x clear all</button>
			</div>
			<button class="download">download PDF</button>
		</div>
	</div>
	<footer class="">
		Made with <span>Vue.js</span> by <a href="https://github.com/Jurason">Evgeniy</a>.
		Open Source on <a href="https://github.com/Jurason">GitHub</a>.
	</footer>
	</div>
</template>


