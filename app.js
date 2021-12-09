const { google } = require("googleapis");
const moment = require("jalali-moment");
const key = require("./key.json");
const { sendEmailTest } = require("./emailSender");
const corn = require("node-cron");
const data = new Date();
const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  `https://www.googleapis.com/auth/spreadsheets.readonly`,
]);


corn.schedule("00 00 10 * * 0-6", function () {
  client.authorize(function (err, token) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Connected :)");
      getSheet(client);
    }
  });
});


async function getSheet(auth) {
  const gsapi = google.sheets({ version: "v4", auth: auth });

  const opt = {
    spreadsheetId: "18EE84SjkM91ate4AMEOFIFY_nXuIEF1ue46WI4GUahY",
    range: "!A2:C1000",
  };

  let res = await gsapi.spreadsheets.values.get(opt);
  const expierdDate =moment().add(30, "day").format("L")
 
  res.data.values.map((item,index) => {
   
const contarctDate=  moment.from(item[2], "fa", "YYYY/MM/DD").format("L") 
    
    if (  
      moment(expierdDate).isAfter(contarctDate)
    ) {
      console.log(item[2]);
      sendEmailTest(item[0]);
    } else {
      console.log("its correct");
    }
  });
}

