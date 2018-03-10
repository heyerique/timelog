/* jshint undef: true, unused: true, esversion: 6*/

const DEFAULT_PROJECT_ID 	 = 	'0'
const DEFAULT_PROJECT_NAME	 =	'No Project'
const DEFAULT_PROJECT_COLOUR =	'#000000'

const DEFAULT_LOG_ID		=	'0'

class Timesheet {
	
	constructor() {
		this.student = ''
		this.program = ''
		this.instructor = ''
		//this.allLogs = []
		this.allProjects = [
			{
				id: DEFAULT_PROJECT_ID,
				name: DEFAULT_PROJECT_NAME,
				colour: DEFAULT_PROJECT_COLOUR,
				allLogs: []
			}
		]
		this.util = new Util()
	}
	
	setInfo(newStudent, newProgram, newInstructor) {
		this.student = newStudent
		this.program = newProgram
		this.instructor = newInstructor
	}
	
	addProject(name, colour) {
		var id = ''
		if(this.allProjects.length) {
			for(let i = 0; i < this.allProjects.length; i += 1) {
				if(this.allProjects[i].name === name) {
					id = this.allProjects[i].id
				}
			}
			if(id === '') {
				id = String(this.allProjects.length)
				let project = new Project(id, name, colour)
				this.allProjects.push(project)
			}
			
		} else {
			id = DEFAULT_PROJECT_ID
			let project = new Project(id, name, colour)
			this.allProjects.push(project)
		}
		return id
	}
	
	removeProject(id) {
		let index = this.findProjectIndex(id)
		this.allProjects.splice(index, 1)
	}
	
	isProjectEmpty(id) {
		let index = this.findProjectIndex(id)
		if(this.allProjects[index].allLogs.length) return false
		else return true
	}
	
	getProjectLogNum(id) {
		let index = this.findProjectIndex(id)
		return this.allProjects[index].allLogs.length
	}

	addLog2(newProject, newPhase, newDate, newStartTime, newIntlTime, newStopTime, newDeltaTime, newcomment) {
		
		var pid = String(newProject)
		var lid = ''
		var pname = ''
		var pindex = -1
		var lognum = 0
		
		if(pid === '') {
			pid = DEFAULT_PROJECT_ID
		}
		
		pindex = this.findProjectIndex(pid)
		
		if(pindex === -1) return lid
		
		lognum = this.allProjects[pindex].allLogs.length
		lid = lognum ? String(lognum) : DEFAULT_LOG_ID
		
		if(pid !== DEFAULT_PROJECT_ID) {
			pname = this.allProjects[pindex].name
		}

		var timeLog = new TimeLog(lid, pid, pname, newPhase, newDate, 
									this.util.formatTime(newStartTime), 
										this.util.formatTime(newIntlTime), 
											this.util.formatTime(newStopTime), 
												this.util.formatTime(newDeltaTime), newcomment)
		this.allProjects[pindex].allLogs.push(timeLog)
		
		return lid
	}

	updateLog2(projectId, logId, data) {
		
		var lindex = -1
		var pindex = -1
		var newLogId = ''
		var lognum = 0
		var oldLog = {}
		
		if(projectId === data.project) {
			lindex = this.findLogIndex(projectId, logId)
			pindex = this.findProjectIndex(projectId)
			oldLog = this.allProjects[pindex].allLogs[lindex]
			//hidden items
			data.id = oldLog.id
			data.projectName = oldLog.projectName
			//update
			this.allProjects[pindex].allLogs[lindex] = data
		} else {
			newLogId = DEFAULT_LOG_ID
			// create an id based on log number of target project
			pindex = this.findProjectIndex(data.project)
			lognum = this.allProjects[pindex].allLogs.length
			if(lognum) {
				newLogId = String(lognum)
			}
			// hidden items
			data.id = newLogId
			// change the project name of the log to the name of the target project
			data.projectName = (data.project === DEFAULT_PROJECT_ID) ? '' : this.allProjects[data.project].name
			this.allProjects[pindex].allLogs.push(data)
			this.removeLog2(projectId, logId)
		}
	}
	
	findLogIndex(projectId, LogId) {
		var index = -1
		var pindex = this.findProjectIndex(projectId)
		var logs = this.allProjects[pindex].allLogs
		for(let i = 0; i < logs.length; i += 1) {
			if(logs[i].id === LogId) index = i
		}
		return index
	}
	
	findProjectIndex(id) {
		var index = -1
		for(let i = 0; i < this.allProjects.length; i += 1) {
			if(this.allProjects[i].id === id) {
				index = i
			}
		}
		return index
	}
	
	getTheLog(projectId, logId) {
		var pindex = this.findProjectIndex(projectId)
		var lindex = this.findLogIndex(projectId, logId)
		return this.allProjects[pindex].allLogs[lindex]
	}

	removeLog2(projectId, logId) {
		var pindex = this.findProjectIndex(projectId)
		var lindex = this.findLogIndex(projectId, logId)
		this.allProjects[pindex].allLogs.splice(lindex, 1)
	}

	getAllIntlTime2() {
		var items = []
		if(this.allProjects.length === 0) {
			return items
		}
		this.allProjects.forEach((p) => {
			p.allLogs.forEach((l) => {
				items.push(this.util.convertToMinute(l.intlTime))
			})
		})
		return items
	}
	
	getAllIntlTime3(p) {
		var items = []
		p.allLogs.forEach((l) => {
			items.push(this.util.convertToMinute(l.intlTime))
		})
		return items
	}

	getAllDeltaTime3(p) {
		var items = []
		p.allLogs.forEach((l) => {
			items.push(this.util.convertToMinute(l.deltaTime))
		})
		return items
	}
	
	getAllLogs() {
		var logs = []
		if(this.allProjects.length > 0) {
			this.allProjects.forEach((p) => {
				if(p.allLogs.length) {
					p.allLogs.forEach((l) => {
						logs.push(l)
					})
				}
			})
		}
		return logs
	}
}