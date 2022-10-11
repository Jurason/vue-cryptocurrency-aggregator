<template>
		<calendar-via-object/>
</template>

<script>

import CalendarViaObject from './components/CalendarViaObject'

export default {
  name: 'App',
	components: {
		CalendarViaObject
	},
  data() {
    return {
			msg: 'Hello World!',
			isInitialModalOpen: true,
			isCalendarCreated: false,
			weekCount: 0,

    }
  },
  created() {

  },

	beforeUnmount() {

	},
	computed: {

  },
  methods: {
		createCalendar(count){
			console.log('Created event!')
			console.log('count:', count)

			this.isInitialModalOpen = false
			this.weekCount = count
			this.isCreated = true
		}
  },
  watch: {

  }
}
</script>
<style>
	.main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		max-height: 100vh;
	}
</style>

