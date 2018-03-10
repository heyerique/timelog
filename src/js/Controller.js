/* jshint undef: true, unused: true, esversion: 6, asi: true */

const WEB_STORAGE_TIMESHEET_INDICATOR	= 'timesheet'
const WEB_STORAGE_LOGS_INDICATOR		= 'logs'
const WEB_STORAGE_LOG_INFO_INDICATOR	= 'loginfo'
const WEB_STORAGE_PROJECTS_INDICATOR	= 'projects'
//const WEB_STORAGE_SETTINGS_INDICATOR	= 'settings'

const TIMESHEET_TITLE = ['Project', 'Phase', 'Date', 'Start', 'Interruption Time', 'Stop', 'Delta Time', 'Comments']

const PHASE_1	= 'Planning'
const PHASE_2	= 'Analysis'
const PHASE_3	= 'Design'
const PHASE_4	= 'Coding'
const PHASE_5	= 'Test'

const PHASES = [
			{name: PHASE_1}, 
			{name: PHASE_2}, 
			{name: PHASE_3}, 
			{name: PHASE_4}, 
			{name: PHASE_5}
		]

const LOG_FILE_COLUMN_NUM = 8

const LOG_INFO_STUDENT_INDEX	= 0
const LOG_INFO_PROGRAM_INDEX	= 1
const LOG_INFO_INSTRUCTOR_INDEX = 2

const NO_TIME = '00:00'

const EXPORT_FILE_NAME = 'timesheet'
const EXPORT_FILE_EXTENTION = '.csv'


class Controller {
	
	constructor() {
		this.newLog = {}
		this.newProject = {}
		this.title = TIMESHEET_TITLE
		this.phases = PHASES
		this.currentLog = {}
		this.timesheet = new Timesheet()
		this.util = new Util()
	}
	
	init() {
		this.loadLogFromWebStorage()
		//console.log(this.timesheet)
	}
	
	updateForm() {
		var time = new Date()
		this.newLog = {
			startTime: this.util.formatTime(`${time.getHours()}:${time.getMinutes()}`),
			date: this.util.getDate(),
			project: '0'
		}
		$('#modal_title').html('New Log')
		$('#modal_button_save').show()
		$('#modal_button_update').hide()
	}
	
	setWebStorage() {
		//console.log(this.logInfo)
		localStorage.setItem(WEB_STORAGE_TIMESHEET_INDICATOR, JSON.stringify(this.timesheet))
	}
	
	loadLogFromWebStorage() {
		let timesheet = JSON.parse(localStorage.getItem(WEB_STORAGE_TIMESHEET_INDICATOR))
		if(timesheet !== null) {
			this.timesheet.setInfo(timesheet.student, timesheet.program, timesheet.instructor)
			this.timesheet.allLogs = timesheet.allLogs
			this.timesheet.allProjects = timesheet.allProjects
		}
	}
	
	updateInfo() {
		this.setWebStorage()
	}
	
	addProject() {
		if(!angular.isDefined(this.newProject.name)) {
			return false
		}
		
		this.newProject.colour = angular.isDefined(this.newProject.colour) ? this.newProject.colour : "#000000"
		
		this.timesheet.addProject(this.newProject.name, this.newProject.colour.toUpperCase())
		this.setWebStorage()
		$('#newProject').modal('hide')
		
		return true
	}
	
	removeProject(project) {
		if(this.timesheet.isProjectEmpty(project.id)) {
			this.timesheet.removeProject(project.id)
			this.setWebStorage()
			return true
		}
		
		$('#info').modal('show')
		return false
	}
	
	addTimeLog() {
		if(!angular.isDefined(this.newLog.startTime)) {
			return false
		}
		
		if(!angular.isDefined(this.newLog.date)) {
			return false
		}
		
		if(!angular.isDefined(this.newLog.stopTime)) {
			this.newLog.stopTime = NO_TIME
		}
		
		if(!angular.isDefined(this.newLog.intlTime)) {
			this.newLog.intlTime = NO_TIME
		}
		
		if(!angular.isDefined(this.newLog.deltaTime)) {
			this.newLog.deltaTime = NO_TIME
		}
				
		if(!angular.isDefined(this.newLog.phase)) {
			this.newLog.phase = ''
		}
		
		if(!angular.isDefined(this.newLog.project)) {
			this.newLog.project = ''
		}
		
		if(!angular.isDefined(this.newLog.comment)) {
			this.newLog.comment = ''
		}

		this.timesheet.addLog2(this.newLog.project, this.newLog.phase, 
									this.newLog.date, this.newLog.startTime, this.newLog.intlTime, 
										this.newLog.stopTime, this.newLog.deltaTime, this.newLog.comment)
		$('#newTime').modal('hide')
		this.newLog = {}
		this.setWebStorage()
		
		return true
	}
	
	getCurrentLog(log) {
		this.currentLog = log
	}
	
	editLog(log) {
		
		this.currentLog = log
		var theLog = this.timesheet.getTheLog(log.project, log.id)
		
		this.newLog = {
			project : theLog.project,
			phase : theLog.phase, 
			date : theLog.date,
			startTime : theLog.startTime,
			intlTime : theLog.intlTime, 
			stopTime : theLog.stopTime,
			deltaTime : theLog.deltaTime,
			comment : theLog.comment
		}
		
		$('#modal_title').html('Modify Log')
		$('#modal_button_save').hide()
		$('#modal_button_update').show()
		$('#newTime').modal('show')
	}
	
	updateTimeLog() {
		this.timesheet.updateLog2(this.currentLog.project, this.currentLog.id, this.newLog)
		this.setWebStorage()
		$('#newTime').modal('hide')
		this.newLog = {}
	}
	
	removeLog() {
		if(this.currentLog.length === 0) {
			return false
		}
		
		this.timesheet.removeLog2(this.currentLog.project, this.currentLog.id)
		this.setWebStorage()
		$('#confirm').modal('hide')
		return true
	}
	
	addLogFromFile($fileContent) {

		if($fileContent === null) {
			return false
		}
		
		var listData = $fileContent.split('\n')
		
		var studentList = listData[1].split(",")
		var programList = listData[2].split(",")
		var instructorList = listData[3].split(",")
		
		this.timesheet.setInfo(studentList[1], programList[1], instructorList[1])
		
		var projectId = ''
		
		for (let i = 6; i < listData.length; i+= 1) {
			let logs = []
			let logList = listData[i].split(",")
			for (let j = 0; j < logList.length; j += 1) {
				logs.push(logList[j])
			}
			
			if(logs.length == LOG_FILE_COLUMN_NUM) {
				projectId = this.timesheet.addProject(logs[0])
				this.timesheet.addLog2(projectId, logs[1], logs[2], logs[3], logs[4], logs[5], logs[6], logs[7])
			}
			projectId = ''
		}
		this.setWebStorage()
		
		return true
	}
	
	getSumIntlTime(p) {
		//return this.util.convertToHour(new BaseCal(this.timesheet.getAllIntlTime2(p)).sum())
		return this.util.convertToHour(new BaseCal(this.timesheet.getAllIntlTime3(p)).sum())
	}
	
	getAveIntlTime(p) {
		return this.util.convertToHour(new BaseCal(this.timesheet.getAllIntlTime3(p)).mean())
	}
	
	getSumDeltaTime(p) {
		return this.util.convertToHour(new BaseCal(this.timesheet.getAllDeltaTime3(p)).sum())
	}
	
	getAveDeltaTime(p) {
		return this.util.convertToHour(new BaseCal(this.timesheet.getAllDeltaTime3(p)).mean())
	}
	
	getPCC(p) {
		return new Cal(this.timesheet.getAllIntlTime3(p), this.timesheet.getAllDeltaTime3(p)).correlationCoefficient()
	}
	
	saveToCSV() {
		var logs = this.timesheet.getAllLogs()
		var newLogs = []
		var csvcontent = 'PSP Time Recording Log\n'
		
		newLogs.push(TIMESHEET_TITLE)
		
		logs.forEach((log) => {
			let row = [log.projectName, log.phase, log.date, log.startTime, log.intlTime, log.stopTime, log.deltaTime, log.comment]
			newLogs.push(row)
		})
		
		var date = new Date()
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var day = date.getDate()
		
		var filedate = `${this.util.toTwoDigits(day)}${this.util.toTwoDigits(month)}${year}`
		
		var filename = `${EXPORT_FILE_NAME}_${filedate}${EXPORT_FILE_EXTENTION}`
		
		csvcontent += `Student:,${this.timesheet.student}\n`
		csvcontent += `Program:,${this.timesheet.program}\n`
		csvcontent += `Instructor:,${this.timesheet.instructor}\n\n`
		csvcontent += this.util.toCSVContent(newLogs)
		this.util.exportToCSV(filename, csvcontent)
	}
}
