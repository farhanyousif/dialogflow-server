const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");

const app = express();
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add("hi from server")
    }

    function fallback(agent) {
        // const { number , date , email} = agent.parameters;
       agent.add("fallback from server")
    }
    function myOrder(agent) {
        const {name, phoneNumber , order , city , email} = agent.parameters;
         agent.add(`Thank you ${name} for your order of ${order}. We will contact you shortly at ${phoneNumber} or via email at ${email}. Your order will be delivered to ${city}. Have a great day!`);
    }

    let intentMap = new Map(); 
    intentMap.set('Default Welcome Intent', hi); 
    intentMap.set('Default Fallback Intent', fallback); 
    intentMap.set('order', myOrder);
    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});