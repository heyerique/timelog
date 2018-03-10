/* jshint undef: true, unused: true, esversion: 6*/

class TimeLog {
	
	constructor(newId, newProject, newProjectName, newPhase, newDate, newStartTime, newIntlTime, newStopTime, newDeltaTime, newComment) {
		this.id = newId
		this.project = newProject
		this.projectName = newProjectName
		this.phase = newPhase
		this.date = newDate
		this.startTime = newStartTime
		this.intlTime = newIntlTime
		this.stopTime = newStopTime
		this.deltaTime = newDeltaTime
		this.comment = newComment
	}
}
