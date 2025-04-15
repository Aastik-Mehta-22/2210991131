// register.js
const axios = require('axios');

const registrationData = {
  email: "aastik1131.be22@chitkara.edu.in",
  name: "aastik",
  mobileNo: "9896192975",
  githubUsername: "aastik-mehta-22",
  rollNo: "2210991131",
  collegeName: "Chitkara University",
  accessCode: "PwzufG"
};

axios.post("http://20.244.56.144/evaluation-service/register", registrationData)
  .then(res => console.log(" done :", res.data))
  .catch(err => console.error("fail:", err.response?.data || err.message));
