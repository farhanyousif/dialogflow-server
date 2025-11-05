const dialogflow = require("@google-cloud/dialogflow");
const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.post("/webhook", async (req, res) => {
  var id = res.req.body.session.substr(43);
  console.log(id);
  const agent = new WebhookClient({ request: req, response: res });

  function hi(agent) {
    console.log(`intent  =>  hi`);
    agent.add("Hello there, I am hammad from serever side!");
  }

  function fallback(agent) {
    agent.add("Fallback Intent called!");
  }

  function order(agent) {
    const { orderName, name, phoneNumber, city, email , quantity } =
      agent.parameters;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "farhanyousif6@gmail.com",
        pass: "ighe gvbu scsh lhtr",
      },
    });

    agent.add(
      `Your name is ${name.name} and quantity is ${quantity} and phone number is ${phoneNumber} and your email is ${email} and city is ${city}`
    );

    console.log(name);
    console.log(quantity);
    console.log(phoneNumber);
    console.log(email);
(async () => {
  const info = await transporter.sendMail({
    from: '"Farhan Yousif" <farhanyousif6@gmail.com>',
    to: email,
    subject: "Your Order Has Been Booked ✔",
    text: `Your name is ${name.name} and quantity is ${quantity} and phone number is ${phoneNumber} and your email is ${email} and city is ${city}`, // plain‑text body
  });
  console.log("Message sent:", info.messageId);
})();
  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", hi);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("order", order);
  agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});