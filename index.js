// https://discordapp.com/oauth2/authorize?client_id=CLIENTID&scope=bot

console.log("BEGIN");

const Discord = require("discord.js");
const axios = require("axios");
const dis = new Discord.Client();

const roll = (size) => {
  return Math.floor((Math.random() * size)) + 1;
};

const rollMany = (count, size) => {
  var result = {
    rolls: [],
    total: 0
  };

  for(var i = 0; i < count; i++){
    var num = roll(size);
    result.total += num;
    result.rolls.push(num);
  }
  return "" + result.rolls.toString() + ". Total: " + result.total;
};

dis.on("ready", () => {
  console.log("Logged in as " + dis.user.tag);
});

dis.on("message", msg => {
  //console.log(msg);
  msg.content = msg.content.toLowerCase();

  if(msg.content.substr(0,3) != "toy") return;

  args = msg.content.split(' ');
  
  switch(args[1]){
    case "hi":
    case "hello":
      msg.reply("Hi there!");
      break;
    case "bye":
      msg.reply("See you later!");
      break;
    case "say":
      args.length > 2 ? 
        msg.reply(msg.content.substr(8)) : 
        msg.reply("What should I say?");
      break;
    case "profile":
      msg.reply("You are " + msg.author.username + "#" + msg.author.discriminator);
      break;
    case "roll":
      args.length == 3 ? 
        msg.reply("Rolling " + args[2] + ". You got " + roll(args[2].substr(1))) :
        args.length == 4 ? 
          msg.reply("Rolling " + args[2] + " " + args[3] + ". You got " + rollMany(args[2], args[3].substr(1))) :
          msg.reply("Invalid command\nTry 'toy roll 3 d8' or 'toy roll d4'");
      break;
    case "jojo":
      getJojo(msg);
      break;
    case "stream":
      streamer(msg, args);
      break;
  }

  console.log("===========================================");

});

dis.login(process.env.token);
//console.log(dis);

const getJojo = (msg) => {
  axios.get("https://api.giphy.com/v1/gifs/search", {
    params: {
      api_key: process.env.apiKey,
      q: "jojos bizarre adventure",
      limit: 20
    }
  }).then(res => {
    msg.reply(res.data.data[roll(21) - 1].bitly_url);
  }).catch(err => {
    console.log(err);
  }).then(() => {
    console.log("Jojos delivered");
  });
};

function streamer(msg, args){
  if(args.length == 2) {
    startStream(msg);
  } else if(args.length == 3){
    startStreamByName(msg, args[2]);
  }
}

function startStream(msg) {
  console.log("Stream General");
  if(msg.guild.available){
    if(msg.guild.channels){
      msg.guild.channels.cache.map(ch => {
        if(ch.name === "General") {
          console.log(ch.id);
          msg.reply("https://discordapp.com/channels/" + msg.guild.id + "/" + ch.id);
        }
      });
    }
  }
};

function startStreamByName(msg, channelName) {
  console.log("Stream " + channelName);
  if(msg.guild.available){
    if(msg.guild.channels){
      msg.guild.channels.cache.map(ch => {
        if(ch.name.toLowerCase() === channelName && ch.type == "voice") {
          console.log(ch.id);
          msg.reply("https://discordapp.com/channels/" + msg.guild.id + "/" + ch.id);
        }
      });
    }
  }
};

const http = require('http');
http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);