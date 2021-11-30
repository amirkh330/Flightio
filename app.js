const { google } = require("googleapis");
const moment = require("jalali-moment");
const key = require("./key.json");
const { sendEmailTest } = require("./emailSender");
const corn = require("node-cron");
const data = new Date();
const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  `https://www.googleapis.com/auth/spreadsheets.readonly`,
]);


corn.schedule("00 59 21 * * 0-6", function () {
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

client.authorize(function (err, token) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Connected :)");
    getSheet(client);
  }
});

async function getSheet(auth) {
  const gsapi = google.sheets({ version: "v4", auth: auth });

  const opt = {
    spreadsheetId: "18EE84SjkM91ate4AMEOFIFY_nXuIEF1ue46WI4GUahY",
    range: "!A2:C1000",
  };

  let res = await gsapi.spreadsheets.values.get(opt);

 
  res.data.values.map((item,index) => {
   
const x=  moment.from(item[2], "fa", "YYYY/MM/DD").format("DD/MM/YYYY") 
const y=  moment
.from(item[2], "fa", "YYYY/MM/DD")
.add(30, "day")
.format("DD/MM/YYYY")


console.log(!!moment(x).isAfter(moment([])));

 
    
    if (
      moment.from(item[2], "fa", "YYYY/MM/DD").format("DD/MM/YYYY") <
      moment
        .from(item[2], "fa", "YYYY/MM/DD")
        .add(30, "day")
        .format("DD/MM/YYYY")
    ) {
      console.log(item[2]);
      sendEmailTest(item[0]);
    } else {
      console.log("its correct");
    }
  });
}

// To Do List
//.1 create email plat form              *DONE*
//.2 send All Detail of sheet            *DONE*
//.3 run funcation at 10:00 am           *DONE*
//.4 run service worker on the hub
