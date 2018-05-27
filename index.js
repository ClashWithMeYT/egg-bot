var D=require("discord.js"),DBG=require("debug")("Egg Bot"),COLOR=require("chalk"),ENMAP=require("enmap"),PROVIDER=require("enmap-sqlite");
function log(a,b){if(a==-1)DBG(COLOR.gray(b));if(a==0)console.log(COLOR.green.bold("[LOG]")+COLOR.grey(b));if(a==1)console.log(COLOR.orange.bold("[WARNING]")+COLOR.grey(b));if(a==2)console.log(COLOR.red.bold("[ERROR]")+COLOR.grey(b));if(a==3)console.log(COLOR.red.bold("[CRITICAL]")+COLOR.grey(b));};
var C = new D.Client(),PREFIX=">";
C.points = new EMNAP({provider: new PROVIDER({name: "eggs"})});
class PointManager {
  constructor() {}
  givePoints(member,value) { //Value minus = take away; Value plus = give;
    if(type member != "object" && type value != "number" || value == NaN) {
      log(1, "Incorrect format detected.");
      return false;
    }
    if(!C.points.has(`${member.guild.id}-${member.id}`)) {
      log(-1,"Making key for user.");
      C.points.set(`${member.guild.id}-${member.id}`, {
        user: member.id,
        guild: member.guild.id,
        eggs: value,
      });
      return true;
    }else{
      var currentPoints = C.points.getProp(`${member.guild.id}-${member.id}`, "eggs");
      C.points.setProp(`${member.guild.id}-${member.id}`, "eggs", currentPoints+value);
    }
  }
  getPoints(member) {
    if(type member != "object") {
      log(1, "Incorrect format detected.");
      return false;
    }
    if(!C.points.has(`${member.guild.id}-${member.id}`)) {
      log(-1,"Making key for user.");
      C.points.set(`${member.guild.id}-${member.id}`, {
        user: member.id,
        guild: member.guild.id,
        eggs: 0,
      });
      return 0;
    }else{
      var currentPoints = C.points.getProp(`${member.guild.id}-${member.id}`, "eggs");
      return currentPoints
    }
  }
}
var PM = new PointManager();
C.on("ready", () => {
  log(0, "Ready!");
});
C.on("message", M => {
  if(M.content.startsWith(PREFIX)) {
    var cmd = M.content.split(" ").splice(0)[0].replace(PREFIX,"");
    var args = M.content.split(" ").splice(1);
    if(cmd == "eggs") {
      M.reply(`You have ${PM.getPoints(M.member)} point(s).`);
    }
  }
});
process.on("exit", code => {
  await C.points.db.close();
});
C.login("yesn't-token-4-u")
