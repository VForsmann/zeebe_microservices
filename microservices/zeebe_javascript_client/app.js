const { ZBClient } = require('zeebe-node')

const handler = (job, complete, worker) => {

	const costPerMinute = job.variables.costPerMinute;
	const payedValue = job.variables.payedValue;
	const bookedTime = job.variables.bookedTime;
	const minutes = parseInt(bookedTime.split(":")[0]) + parseInt(bookedTime.split(":")[1]);

	// Maybe something wrong here?
	console.log(minutes, costPerMinute, payedValue);

	if(minutes * costPerMinute === payedValue) {
		console.log("PAYED CORRECTLY");
		complete.success({paymentSuccess: true});
	} else {
		console.log("PAYED INCORRECTLY");
		complete.success({paymentSuccess: false});
	}
}

const zbc = new ZBClient('zeebe:26500')

zbc.createWorker({
	taskType: 'check_payment',
	taskHandler: handler,
});

console.log("Zeebe-Client up :)")