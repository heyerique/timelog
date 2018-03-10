
class Util {
	
	convertToMinute(time) {
		var totalMinute = 0
		if(time === '') {
			return totalMinute
		}
		var timeList = time.split(':')
		var hour = Number(timeList[0])
		var minute = Number(timeList[1])
		totalMinute = hour * 60 + minute
		return totalMinute
	}
	
	convertToHour(minute) {
		var time = NO_TIME
		if(minute === '') {
			return time
		}
		
		var newHour = Math.floor(minute / 60)
		var newMinute = parseInt(minute % 60)
		return this.formatTime(`${newHour}:${newMinute}`)
	}
	
	formatTime(time) {
		if(time === '') {
			time = NO_TIME
		}

		var newTime = time.split(':')
		
		return `${this.toTwoDigits(newTime[0])}:${this.toTwoDigits(newTime[1])}`
	}
	
	getDate() {
		var date = new Date()
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var day = date.getDate()
		
		return `${this.toTwoDigits(day)}/${this.toTwoDigits(month)}/${year}`
		//return date.toLocaleDateString()
	}
	
	toTwoDigits(n) {
		n = parseInt(n)
		n = (n >= 0 && n < 10) ? `0${n}` : String(n)
		return n
	}

	toCSVContent(data) {
		let content = ''
		
		if(data.length === 0) {
			return content
		}
		
		data.forEach((d) => {
			//console.log(d)
			let dataStr = d.join(',')
			content += `${dataStr}\n`
		})
		return content
	}

	exportToCSV(filename, data) {
		let csvContent = "data:text/csv;charset=utf-8,"
		var encodedUri = encodeURI(csvContent + data)
		//console.log(encodedUri)
		
		var link = document.createElement("a")
		link.setAttribute("href", encodedUri)
		link.setAttribute("download", filename)
		document.body.appendChild(link) // Required for FF
		link.click()
	}
}