const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const events = require("events");
const http2 = require("http2");
const eventEmitter = new events.EventEmitter();
const port = 8090;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use("/", express.static("public"));

const expressWs = require("express-ws")(app);

app.post("/book", async (req, res) => {
    console.log("Recieved Booking Request for Scooter ID_" + req.body.scooterId + " - handing over to Zeebe!");
    const result = await zbc.createWorkflowInstance("scooter_booking", req.body);
    console.log("Zeebe accepted with workflowKey: " + result.workflowKey);
    res.sendStatus(200);
});

app.ws("/", function (ws, req) {
    const successNotification = () => {
        console.log("websockets sends success");
        ws.send("SUCCESS");
    };
    eventEmitter.addListener("send_success_notification", () => {
        if (ws.readyState === ws.OPEN) {
            successNotification();
        } else {
            eventEmitter.removeListener("send_success_notification", successNotification);
        }
    });

    const rejectionNotification = () => {
        console.log("websockets sends rejection");
        ws.send("REJECTED");
    };

    eventEmitter.addListener("send_rejection_notification", () => {
        if (ws.readyState === ws.OPEN) {
            rejectionNotification();
        } else {
            eventEmitter.removeListener("send_rejection_notification", rejectionNotification);
        }
    });
});

app.listen(port, () => {
    console.log(`Scooter-Web-Api running in docker-network under ${port}`);
});

function book_scooter(job, complete, worker) {
    console.log("book_scooter");
    complete.success();
}

function send_success_notification(job, complete, worker) {
    console.log("send_success_notification");
    eventEmitter.emit("send_success_notification");
    complete.success();
}

function send_rejection_notification(job, complete, worker) {
    console.log("send_rejection_notification");
    eventEmitter.emit("send_rejection_notification");
    complete.success();
}

// Some docker-stuff: Full Start of Server when mongodb is available
async function alive() {
    await new Promise((resolve, reject) => {
        const func = () => {

			const client = http2.connect("http://zeebe:26500");
				
			client.on("error", () => {
				console.log("WAITING FOR ZEEBE TO START");
				setTimeout(() => func(), 1000);
			});

			client.on("socketError", () => {
				console.log("WAITING FOR ZEEBE TO START");
				setTimeout(() => func(), 1000);
			})
        };
        func();
    });
}

const startUpZeebeClient = async () => {
    await alive();
    const ZB = require("zeebe-node");
    const zbc = new ZB.ZBClient("zeebe:26500");

    const bookScooter = zbc.createWorker("book_scooter", book_scooter);
    const sendSuccessNotification = zbc.createWorker("send_success_notification", send_success_notification);
    const sendRejectionNotification = zbc.createWorker("send_rejection_notification", send_rejection_notification);
};

startUpZeebeClient();
