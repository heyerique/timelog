/* jshint undef: true, unused: true, esversion: 6*/

class BaseCal
{
  constructor(numbers) {
    this.numbers = numbers
  }

  count() {
    return this.numbers.length
  }

  sum() {
    var sum = 0
	
    if(this.count() === 0) {
		return sum
	}
	
    this.numbers.forEach((n) => {sum += n})
	  
    return sum
  }

  mean() {
    var mean = 0
	
    if(this.count() === 0) {
		return mean
	}
	
    mean = this.sum() / this.count()
	  
    return mean
  }
  
	aveDev() {
		var aveDev = 0

		if(this.count() === 0) {
			return aveDev
		}

		var sumOfDev = 0
		var mean = this.mean()
		this.numbers.forEach((n) => {sumOfDev += Math.abs(n - mean)})
		aveDev = sumOfDev / this.count()

		return aveDev
	}
}

class Cal {
	constructor() {
		this.x = new BaseCal(arguments[0])
		this.y = new BaseCal(arguments[1])
	}
	
	covariance() {
		var cov = 0
		var countX = this.x.count()
		var countY = this.y.count()
		
		//console.log(this.x)
		//console.log(this.y)
		
		if(countX === 0 || countY === 0) {
			return cov
		}
		
		if(countX != countY) {
			return cov	
		}
		
		var meanX = this.x.mean()
		var meanY = this.y.mean()
		
		for(let i = 1; i < countX; i += 1) {
			cov += (this.x.numbers[i] - meanX) * (this.y.numbers[i] - meanY)
		}
		
		//console.log('sum: ' + sum)
		
		//cov = sum / countX
		
		return cov
	}
	
	averageCovariance() {
		return this.covariance() / this.x.count()
	}
	
	correlationCoefficient() {
		var r = 0
		var countX = this.x.count()
		var countY = this.y.count()

		if(countX === 0 || countY === 0) {
			return r
		}
		
		if(countX != countY) {
			return r	
		}
		
		var meanX = this.x.mean()
		var meanY = this.y.mean()
		var sumX = 0
		var sumY = 0
		
		for(let i = 1; i < countX; i += 1) {
			sumX += Math.pow((this.x.numbers[i] - meanX), 2)
			sumY += Math.pow((this.y.numbers[i] - meanY), 2)
		}

		r = this.covariance() / (Math.sqrt(sumX) * Math.sqrt(sumY))

		return r === 'NaN' ? 0 : r
	}
}
