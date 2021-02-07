//helpful url https://discordapp.com/developers/applications/me

//stuff to add:
//more originals

//admin only commands
//make countering and percentage local to each server
//make whitelist global
//get rid of show whitelist command, make whitelist toggle only
//update profile picture command
//reactions to messages
//special behavior

//NEW IDEA:
//make countering/percentage info local to each channel
//add a !menu command that prints the local information for the channel and provides emojis to change the options

var lastUpdated = new Date(2021, 1, 7, 3, 16); //the month is 0-indexed

//Colors first
console.log("Initializing Colors");
	var colors = require('colors');
	colors.setTheme({
		system: ['cyan'],
		info: ['green'],
		warning: ['yellow'],
		error: ['red']
	});
console.log("Colors Initialized\n".rainbow);

// Initialize Librarys
console.log("Importing ".system + "discord.js" + " and ".system + "fs");
	const Discord = require("discord.js");
	const fs = require('fs');
console.log("Finished Importing ".system + "Discord.js");
console.log("Initializing new ".system + "Client");
	const client = new Discord.Client();
console.log("Finished Initializing new ".system + "Client\n");

// Starting Command
console.log("Loading Original and Other Memory Files".system);
	if (process.argv[2] === null || process.argv[2] === "" || process.argv[2] === undefined) {	
		console.log("Error: Original to copy not defined\nClosing program".error);
		process.exit();
	}
	var startingCommand = process.argv[2];
	if (!fs.existsSync('./Originals/' + startingCommand + '/info.json')) {
		console.log("Error: Invalid Original\nClosing program".error);
		process.exit();
	}
	var filePath = './Originals/' + startingCommand + '/';

	// Get Copycat Information
	var info = require(filePath + 'info.json');
	var uniqueData = require(filePath + 'uniqueData.json');
		var catchphrases = uniqueData.catchphrases;
		var mentionResponses = uniqueData.mentionResponses;
		var customCommands = uniqueData.customCommands;
		var equivalentCommands = uniqueData.equivalentCommands;
		var customResponses = uniqueData.customResponses;
	var memory = JSON.parse(fs.readFileSync(filePath + 'memory.json'));
	var uniqueFunc = require(filePath + 'uniqueFunctions.js');
	var quotes = require(filePath + 'quotes.json').quotes;
	var gramCor = require('./grammarCorrections.json').corrections;
console.log("Files Loaded Successfully\n".system);
	
	
var typingSpeed = 10;

//Commands
var commandDescriptions = [
	{
		"triggers": ["help", "commands", "cmds"],
		"description": "Sends a direct message to the message author, specifying all possible commands."
	},
	{
		"triggers": ["quote", "archives"],
		"description": "Prints a quote from the archives."
	},
	{
		"triggers": ["say"],
		"description": "Takes a string encased in \"\" as input and outputs it back at the user. Converts %33 to !, \\n to newlines, and \\t to tabs."
	},
	{
		"triggers": ["reportpercentage", "currentpercentage"],
		"description": "Prints out the current " + uniqueData.percentageName + "."
	},
	{
		"triggers": ["increasepercentage"],
		"description": "Increases the " + uniqueData.percentageName + " by the number specified.\nIf no number specified, increases by 1%."
	},
	{
		"triggers": ["decreasepercentage", "reducepercentage"],
		"description": "Decreases the " + uniqueData.percentageName + " by the number specified.\nIf no number specified, decreases by 1%."
	},
	{
		"triggers": ["changepercentage", "modifypercentage", "shiftpercentage"],
		"description": "Changes the " + uniqueData.percentageName + " by the number specified.\nIf no number specified, increases by 1%."
	},
	{
		"triggers": ["setpercentage", "percentage="],
		"description": "Sets the " + uniqueData.percentageName + " to the number specified."
	},
	{
		"triggers": ["quietmode"],
		"description": "Sets the " + uniqueData.percentageName + " to 0%."
	},
	{
		"triggers": ["crazymode"],
		"description": "Sets the " + uniqueData.percentageName + " to 100%."
	},
	{
		"triggers": ["countering", "counter"],
		"description": "Toggles the countering feature on or off."
	},
	{
		"triggers": ["ignore", "dontnotice", "disregard"],
		"description": "Ignores the specified user, preventing this bot from randomly responding to their messages (will still respond to mentions and commands).\nIf no user specified, defaults to message author.\nCan take multiple inputs at once."
	},
	{
		"triggers": ["unignore", "notice", "regard"],
		"description": "Unignores the specified user, allowing this bot to randomly respond to their messages.\nIf no user specified, defaults to message author.\nCan take multiple inputs at once."
	},
	{
		"triggers": ["whitelist", "enable"],
		"description": "Whitelists the specified channel, allowing this bot to randomly respond to messages there.\nIf no channel specified, defaults to channel of command message.\nCan take multiple inputs at once."
	},
	{
		"triggers": ["unwhitelist", "disable"],
		"description": "Unwhitelists the specified channel, preventing this bot from randomly responding to messages there (will still respond to mentions and commands).\nIf no channel specified, defaults to channel of command message.\nCan take multiple inputs at once."
	},
	{
		"triggers": ["printwhitelist", "currentwhitelist", "seewhitelist", "showwhitelist", "reportwhitelist"],
		"description": "Prints out the current whitelisted channels in the server."
	},
	{
		"triggers": ["printignoreduserlist", "seeignoredusers", "currentignoredusers", "showignoredusers", "reportignoredusers" , "ignoredusers"],
		"description": "Prints out the current ignored users in the server."
	}
]

// Define Discord Bot Functions
client.on('ready', () => {
	var options = process.argv.slice(3);
	
	if (options.includes("no_activity")) client.user.setActivity("");
	else client.user.setActivity(info.original.username, {type: 'WATCHING'});
	
	if (options.includes("invisible")) client.user.setStatus('invisible');
	
	
	//client.user.setAvatar(filePath + 'botavatar.png');
	
	console.log("Logged in as:".system);
	console.log("\tUsername: ".info + client.user.tag);
	console.log("\tID:       ".info + client.user.id);
	
	console.log("\tAvatar:       ".info + client.user.avatar);
	console.log("\tBot account:  ".info + client.user.bot);
	var test = client.user.localPresence.game;
	if (test !== undefined && test !== null) console.log("\tPlaying game: ".info + client.user.localPresence.game.name);
	console.log("\tStatus:       ".info + client.user.localPresence.status);
	if (client.user.avatar === null) console.log("\tHas no avatar".warning);
	if (client.guilds.array().length === 0) console.log("\tNot included in any servers".warning);
	
	console.log();
});
client.on('error', error => {
	console.log("Connection Error: ".error + error);
});
client.on('reconnecting', () => {
	console.log("Attempting Reconnection...\n".error);
});
client.on('message', message => {
	console.log("Recieved Message".system);
	
	//add extra message format functions
	message.lowercased = function() { return this.content.toLowerCase(); }
	message.grammarized = function() { return grammarStandardizer(this.content) };
	message.withoutMentions = function() { return removeMentions(this); };

	//log, even if self message
	addToUserIDLog(message.author.tag, message.author.id);

	//if self message, skip
	if (message.author.id == client.user.id) {
		console.log("\tMessage is from Self - Ignoring\n".info);
		return;
	}

	//log message
	logMessage(message);
	
	if (isIgnoredUser(message.author) && !isMentioning(message) && message.channel.type !== 'dm') 
	{
		console.log("\tMessage Author Ignored - Ignoring".info);
		
		console.log();
		return;
	}
	if (!isWhitelistedChannel(message.channel) && !isMentioning(message) && message.channel.type !== 'dm') 
	{
		console.log("\tMessage Channel Not Whitelisted - Ignoring".info);
		
		console.log();
		return;
	}
	
	//check to see if it is a special message
	console.log("\tTesting for Valid Mention".info);
	if (isMentioning(message))
	{		
		console.log("\tTest Returned Positive".info);
		
		mentioned(message);
		
		console.log();
		return;
	}
	else
	{
		console.log("\tTest Returned Negative".info);
	}
	
	//check to see if coming from private DM (same effect as mentioning)
	console.log("\tTesting to See if DM Message".info);
	if (message.channel.type === 'dm')
	{		
		console.log("\tTest Returned Positive".info);
		
		mentioned(message);
		
		console.log();
		return;
	}
	else
	{
		console.log("\tTest Returned Negative".info);
	}
	
	//countering original
	if (message.author.id === info.original.userID)
	{
		console.log("\tMessage from Original (".info + info.original.username + ")".info);
		if (memory.countering)
		{
			console.log("\t\tCountering is On".info);
			
			if (countering(message)) 
			{
				console.log("\t\tCountering was Triggered".info);
				
				console.log();
				return;
			}
			
			console.log("\t\tCountering not Triggered".info);
		}
		else
		{
			console.log("\t\tCountering is Off".info);
		}
	}
	
	//random catchphrase responses
	console.log("\tRandom Chance for Catchphrase".info);
	if (randomChance(memory.percentage))
	{
		console.log("\tRandom Chance Succeeded".info);
		var str = randomArrayElement(catchphrases);	 
		 
		console.log("\t\tResponding with Catchphrase:".info);
		console.log("\t\t\t" + str);
		sendMessage(message.channel, str, undefined, true);
	}
	else
	{
		console.log("\tRandom Chance Failed".info);
	}
	
	console.log();
	return;
	
});

var logMessage = function(message) {
	var authorName = "", authorID = "", content = "", guildName = "", guildID = "", channelName = "", channelID = "", createdAt = "";
	if (message.channel.type === "text")
	{
		authorName = message.author.username;
		authorID = message.author.id;
		content = message.cleanContent;
		guildName = message.guild.name;
		guildID = message.guild.id;
		channelName = message.channel.name;
		channelID = message.channel.id;
		createdAt = message.createdAt;
	}
	else if (message.channel.type === "dm")
	{
		authorName = message.author.username;
		authorID = message.author.id;
		content = message.cleanContent;
		guildName = "None";
		guildID = "DM";
		channelName = "@" + message.channel.recipient.username;
		channelID = message.channel.id;
		createdAt = message.createdAt;
	}
	else
	{
		console.log("\tChannel Type Not Accepted:".error);
		console.log("\t\t" + message.channel.type);
		console.log("\tCannot Log Message".error);
		return;
	}
	
	console.log("\tMessage:".info);
		console.log("\t\tAuthor: \"".info + authorName + "\" (".info + authorID + ")".info);
		console.log("\t\tContent: ".info);
			console.log("\t\t\t".info + content);
		console.log("\t\tLocation: ".info);
			console.log("\t\t\tGuild:    \"".info + guildName + "\" (".info + guildID + ")".info);
			console.log("\t\t\tChannel:  \"".info + channelName + "\" (".info + channelID + ")".info);
		console.log("\t\tCreated At: ".info + createdAt);
}

var mentioned = function(message) {
	//remove mention
	var noMention = message.content.replace("<@" + client.user.id + ">", "");
	noMention = noMention.replace("<@!" + client.user.id + ">", "");
	noMention = noMention.trim();
	
	console.log("\t\tMessage Without Mentions:".info);
	console.log("\t\t\t" + noMention);

	console.log("\t\tTesting Custom Responses".info);
	if (checkCustomResponses(message))
	{
		console.log("\t\t\tTest Returned Positive".info);
		return;
	}
	else
	{
		console.log("\t\t\tTest Returned Negative".info);
	}
	
	//search for commands
	var splitMsg = noMention.split(/[\s\n]+/);
	console.log("\t\tSplit Message:".info);
	console.log("\t\t\t" + splitMsg);
	var wasCmd = false;
	console.log("\t\tScanning Sections For Commands".info);
	for (var i = 0; i < splitMsg.length; i++)
	{
		console.log("\t\t\tScanning Section:".info);
		console.log("\t\t\t\t" + splitMsg[i]);
		if (isCommand(splitMsg[i]))
		{
			console.log("\t\t\tCommand Recognized".info);
			
			var afterCmd = splitMsg.slice(i + 1, splitMsg.length);
			
			console.log("\t\t\tCreated AfterCommand Array:".info);
			console.log("\t\t\t\t" + afterCmd);
			
			commanded(message, splitMsg[i], afterCmd);
			
			wasCmd = true;
		}
	}
	if (wasCmd) return;
	
	//not custom or command, regular reply
	console.log("\t\tMessage Has No Commands".info);
	console.log("\t\tRandom Chance for Mention Response or Catchphrase".info);
	if(randomChance(0.5))
	{	
		var str = randomArrayElement(mentionResponses);
		
		console.log("\t\t\tSending Mention Response:".info);
		console.log("\t\t\t\t" + str);
		
		sendMessage(message.channel, str, undefined, true);
	}
	else
	{
		var str = randomArrayElement(catchphrases);
		
		console.log("\t\t\tSending Catchphrase:".info);
		console.log("\t\t\t\t" + str);
		
		sendMessage(message.channel, str, undefined, true);	
	}
	
}

var checkCustomResponses = function(message) {
	console.log("\t\t\tChecking For Custom Responses".info);
	
	var toCheck = message.withoutMentions();
	toCheck = toCheck.toLowerCase();
	toCheck = grammarStandardizer(toCheck);
	
	for (var i = 0; i < customResponses.length; i++)
	{
		for (var i2 = 0; i2 < customResponses[i].triggers.length; i2++)
		{
			if (toCheck === customResponses[i].triggers[i2])
			{		
				var str = randomArrayElement(customResponses[i].responses);
				
				console.log("\t\t\tMatch Found:".info);
				console.log("\t\t\t\tOriginal:".info);
				console.log("\t\t\t\t\t" + toCheck);
				console.log("\t\t\t\tResponse:".info);
				console.log("\t\t\t\t\t" + str);
				sendMessage(message.channel, str, undefined, true);
				return true;
			}
		}
	}
			
	return false;
}

var commanded = function(message, cmd, afterCmd) {
	cmd = cmd.toLowerCase();
	cmd = cmd.trim();
	cmd = cmd.slice(1, cmd.length); //remove ! at beginning
	cmd = commandStandardizer(cmd); //equivalent Commands
	
	console.log("\t\t\tFormated Command".info);
	console.log("\t\t\t\t" + cmd);
	
	switch (cmd)
	{
		case "help":
		case "commands":
		case "cmds":
			help(message);
			break;
		
		case "quote":
		case "archives":
			quote(message);
			break;
			
		case "say":
			say(message, afterCmd);
			break;
		
		case "reportpercentage":
		case "currentpercentage":
			reportPercentage(message);
			break;
			
		case "increasepercentage":
			changePercentage(message, parseToIntForPercentageChanging(afterCmd, '+'));
			break;
			
		case "decreasepercentage":
		case "reducepercentage":
			changePercentage(message, parseToIntForPercentageChanging(afterCmd, '-'));
			break;
			
		case "changepercentage":
		case "modifypercentage":
		case "shiftpercentage":
			changePercentage(message, parseToIntForPercentageChanging(afterCmd, '+-'));
			break;
			
		case "setpercentage":
		case "percentage=":
			setPercentage(message, parseToIntForPercentageChanging(afterCmd, '='));
			break;
		
		case "quietmode":
			setPercentage(message, 0);
			break;
			
		case "crazymode":
			setPercentage(message, 100);
			break;
			
		case "countering":
		case "counter":
			toggleCountering(message);
			break;
		
		case "ignore":
		case "dontnotice":
		case "disregard":
			ignore(message, afterCmd);
			break;
		
		case "unignore":
		case "notice":
		case "regard":
			unignore(message, afterCmd);
			break;	
			
		case "whitelist":
		case "enable":
			whitelist(message, afterCmd);
			break;
		
		case "unwhitelist":
		case "disable":
			unwhitelist(message, afterCmd);
			break;
		
		case "printwhitelist":
		case "currentwhitelist":
		case "seewhitelist":
		case "showwhitelist":
		case "reportwhitelist":
			printServerWhitelist(message);
			break;
			
		case "printignoreduserlist":
		case "ignoredusers":
		case "seeignoredusers":
		case "currentignoredusers":
		case "showignoredusers":
		case "reportignoredusers":
			printServerIgnoredUsersList(message);
			break;
		
		default:
			if (!checkCustomCommands(message, cmd, afterCmd))
			{
				console.log("\t\t\tCommand Not Recognized".info);
				console.log("\t\t\tSending Incorrect Command Response".info);
				var richEmbed = {
					"embed": {
						"title": "Command Not Recognized",
						"description": uniqueData.incorrectCommandResponse,
						"color": 16711680, //red
					}
				}
				sendMessage(message.channel, "", richEmbed, false);
			}
			break;
	}
}

var checkCustomCommands = function(message, cmd, afterCmd) {	
	console.log("\t\t\tChecking Custom Commands".info);
	
	for (var i = 0; i < customCommands.length; i++)
	{
		for (var i2 = 0; i2 < customCommands[i].commands.length; i2++)
		{
			if (cmd === customCommands[i].commands[i2])
			{				
				if (typeof uniqueFunc[customCommands[i].func] !== 'undefined')
				{
					console.log("\t\t\tCommand is a Custom Command".info);
					console.log("\t\t\tCalling External Function:".info);
					console.log("\t\t\t\t" + customCommands[i].func);
					uniqueFunc[customCommands[i].func]
					({
						client: client, 
						message: message, 
						command: cmd, 
						afterCommand: afterCmd, 
						filePath: filePath, 
						sendMessageFunc: sendMessage
					});
					return true;
				}
				else 
				{
					console.log("\t\t\tFound Bug in External Files:".error);
					console.log("\t\t\t\tCommand ".error + customCommands[i].commands[i2] + " has the function ".error + customCommands[i].func + " which is not defined in ".error + filePath + "uniqueFunctions.js");
				}
			}
		}
	}
	
	return false;
}

var help = function(message) {
	var richEmbed = {
		"embed": {
			"author": {
				"name": client.user.username,
				"icon_url": client.user.avatarURL
			},
			"title": "COMMANDS",
			"description": "Log of all active commands for the '" + client.user.username + "' Doppelganger bot\n\n\n_____",
			"color": 9605778, //gray
			//"timestamp": "2018-09-22T02:09:50.386Z",
			"timestamp": lastUpdated.toISOString(),
			"footer": {
				"icon_url": client.user.avatarURL,
				"text": "Last Updated"
			},
			"fields": []
		}
	}
	
	//DEFAULT COMMANDS
	richEmbed.embed.fields.push({
		"name": "__Default Commands:__",
		"value": "Commands that every Doppelganger bot has\n*Italicized commands* are special equivalencies unique to this bot\n_____"
	});
	
	for (var i = 0; i < commandDescriptions.length; i++)
	{
		var title = "";
		var description = ":arrow_right: " + commandDescriptions[i].description;
		var equivalentCommandsIndex = -1;
		
		for (var i2 = 0; i2 < commandDescriptions[i].triggers.length; i2++)
		{
			if (i2 !== 0) title += " :heavy_plus_sign: ";
			title += "!" + commandDescriptions[i].triggers[i2];
			
			for (var i3 = 0; i3 < equivalentCommands.length; i3++)
			{
				if (equivalentCommands[i3].convertTo === commandDescriptions[i].triggers[i2]) equivalentCommandsIndex = i3;
			}
		}
		
		if (equivalentCommandsIndex !== -1)
		{
			for (var i2 = 0; i2 < equivalentCommands[equivalentCommandsIndex].commands.length; i2++)
			{
				title += " :heavy_plus_sign: ";
				title += "*!" + equivalentCommands[equivalentCommandsIndex].commands[i2] + "*";
			}
		}
		
		//if the last one
		if (i === commandDescriptions.length - 1) description += "\n\n\n_____";
		else description += "\n_____";
		
		richEmbed.embed.fields.push({
			"name": title,
			"value": description
		});
	}
	
	//CUSTOM COMMANDS
	richEmbed.embed.fields.push({
		"name": "__Custom Commands:__",
		"value": "Commands with special results that only this bot has\n_____"
	});
	
	for (var i = 0; i < customCommands.length; i++)
	{
		var title = "";
		var description = ":arrow_right: " + customCommands[i].description;
		
		for (var i2 = 0; i2 < customCommands[i].commands.length; i2++)
		{
			if (i2 !== 0) title += " :heavy_plus_sign: ";
			title += "!" + customCommands[i].commands[i2];
		}
		
		if (i !== commandDescriptions.length - 1) description += "\n_____";
		
		richEmbed.embed.fields.push({
			"name": title,
			"value": description
		});
	}
	
	sendMessage(message.author, "", richEmbed, false);
}

var quote = function(message) {
	console.log("\t\t\tGenerating Quote".info);
	var str = randomArrayElement(quotes)
	console.log("\t\t\tQuote Generated:".info);
	console.log("\t\t\t\t" + str);
	sendMessage(message.channel, "", { "embed": {
		"description": str,
		"color": 9605778, //gray
		"author": {
			"name": info.original.username,
			"icon_url": info.original.avatarURL
		},
	} }, false);
}

var say = function(message, afterCmd) {	
	console.log("\t\t\tParsing What to Say".info);
	
	var unsplit = "";
	for (var i = 0; i < afterCmd.length; i++)
	{
		unsplit += afterCmd[i];
		if (i != afterCmd.length - 1) unsplit += ' ';
	}
	
	var start_pos = unsplit.indexOf('"') + 1;
	var end_pos = unsplit.indexOf('"', start_pos);
	
	if (start_pos === -1 || end_pos === -1)
	{
		console.log("\t\t\tCould not recognize string");
		sendMessage(message.channel, "", { "embed": {
			"title": "Parsing Error",
			"description": "The string you sent could not be parsed.",
			"color": 16711680, //red
		} }, false);
		//sendMessage(message.channel, "> The string you sent could not be parsed.", undefined, false);
		return;
	}
	
	var toSay = unsplit.substring(start_pos, end_pos);
	toSay = toSay.replace(/%33/gi, '!');
	toSay = toSay.replace(/\\n/gi, '\n');
	toSay = toSay.replace(/\\t/gi, '\t');
	
	console.log("\t\t\tParsed:".info);
	console.log("\t\t\t\t" + toSay);
	
	sendMessage(message.channel, toSay, undefined, false);
}

var reportPercentage = function(message) {
	console.log("\t\t\tReporting Percentage".info);
	sendMessage(message.channel, "", { "embed": {
		"title": "Percentage Report",
		"description": "Current " + uniqueData.percentageName + " is at " + memory.percentage * 100 + "%",
		"color": 9605778, //gray
	} }, false);
}

var parseToIntForPercentageChanging = function(afterCmd, type) {
	console.log("\t\t\tParsing Integer From: ".info + afterCmd[0]);
	
	var num = parseInt(afterCmd[0]);
	console.log("\t\t\tParsed: ".info + num);
	if (isNaN(num))
	{
		console.log("\t\t\tParse Returned NaN".warning);
		console.log("\t\t\tSetting to Default Value".info);
		
		if (type === '=') return undefined;	
		num = 1;
	}
	if (type === '-') num *= -1;
	return num;
}

var changePercentage = function(message, num) {
	var before = memory.percentage;
	memory.percentage += num / 100;
	if (memory.percentage < 0) memory.percentage = 0;
	if (memory.percentage > 1) memory.percentage = 1;
	syncMemory();
	
	var richEmbed = {
		"embed": {
			"title": "Modifying Percentage",
			"description": captializeFirstLetter(uniqueData.percentageName) + " has been changed by " + num + ", from " + before * 100 + "% to " + memory.percentage * 100 + "%",
			"color": 65280, //green
		}
	}
	
	console.log("\t\t\tChanging Percentage By: ".info + num);
	sendMessage(message.channel, "", richEmbed, false);
}

var setPercentage = function(message, set) {
	if (set === undefined)
	{
		console.log("\t\t\tParsing Failed".warning);
		console.log("\t\t\tSending Error Message to User".info);
		sendMessage(message.channel, "", { "embed": {
			"title": "Could Not Recognize Number",
			"description": "The number you sent could not be parsed",
			"color": 16711680, //red
		} }, false);
		//sendMessage(message.channel, "> The number you sent could not be parsed", undefined, false);
		return;
	}
	
	var before = memory.percentage;
	
	if (set < 0) set = 0;
	if (set > 100) set = 100;
	
	console.log("\t\t\tSetting Percentage: ".info + set);

	memory.percentage = set / 100;
	syncMemory();	
	
	sendMessage(message.channel, "", { "embed": {
		"title": "Modifying Percentage",
		"description": captializeFirstLetter(uniqueData.percentageName) + " has been changed from " + before * 100 + "% to " + memory.percentage * 100 + "%",
		"color": 65280, //green
	} }, false);
}

var toggleCountering = function(message) {
	memory.countering = !memory.countering;
	syncMemory();
	
	var type = "on";
	if (!memory.countering) type = "off";
	
	console.log("\t\t\tToggling Countering: ".info + !memory.countering + " -> ".info + memory.countering);
	sendMessage(message.channel, "", { "embed": {
		"title": "Countering",
		"description": "Countering is now " + type,
		"color": 65280 //green
	} }, false);
}

var extractMentionOfAUser = function(str) {
	str = str.trim();
	if (str.substring(0, 2) === "<@" && str.charAt(str.length - 1) === ">")
	{
		if (str.charAt(2) === '!')	str = str.substring(3, str.length - 1);
		else str = str.substring(2, str.length - 1);
		
		return str;
	}
	
	return undefined;
}

var extractMentionOfAChannel = function(str) {
	str = str.trim();
	if (str.substring(0, 2) === "<#" && str.charAt(str.length - 1) === ">")
	{
		return str.substring(2, str.length - 1);
	}
	
	return undefined;
}

var ignore = function (message, afterCmd) {
	//make artifical user
	if (afterCmd[0] === undefined) afterCmd[0] = "<@" + message.author.id + ">"
	
	for (var i = 0; i < afterCmd.length; i++)
	{
		var user = extractMentionOfAUser(afterCmd[i]);
		
		console.log("\t\t\tExtracted User Mention".info);
		console.log("\t\t\t\tUser:    ".info + user);
		
		if (user === undefined)
		{
			console.log("\t\t\tExtraction of User Mention Failed".warning);
			console.log("\t\t\tSending Error Message to User".info);

			sendMessage(message.channel, "", { "embed": {
				"title": "User Not Recognized",
				"description": "The user you specified to ignore could not be recognized. Please make sure to use a correctly formated mention (@user#0000).",
				"color": 16711680, //red
			} }, false);
			continue;
		}

		var alreadyIgnored = false;
		for (var i2 = 0; i2 < memory.ignoredUsers.length; i2++)
		{
			if (memory.ignoredUsers[i2] === user)
			{
				alreadyIgnored = true;
				console.log("\t\t\tUser Already Ignored".warning);
				console.log("\t\t\tSending Error Message to User".info);
				sendMessage(message.channel, "", { "embed": {
					"title": "User Already Ignored",
					"description": "<@" + user + "> is already being ignored. No change has been made.",
					"color": 16762880, //yellow-orange
				} }, false);
				continue;
			}
		}
		if (alreadyIgnored) continue;
			
		memory.ignoredUsers.push(user);
		syncMemory();
			
		console.log("\t\t\tUser Ignored".info);
		sendMessage(message.channel, "", { "embed": {
			"title": "User Ignored",
			"description": "<@" + user + "> will be ignored.",
			"color": 65280, //green
		} }, false);
	}
}

var unignore = function (message, afterCmd) {
	//make artifical user
	if (afterCmd[0] === undefined) afterCmd[0] = "<@" + message.author.id + ">"
	
	for (var i = 0; i < afterCmd.length; i++)
	{
		var user = extractMentionOfAUser(afterCmd[i]);

		console.log("\t\t\tExtracted User Mention".info);
		console.log("\t\t\t\tUser:    ".info + user);
		
		if (user === undefined)
		{
			console.log("\t\t\tExtraction of User Mention Failed".warning);
			console.log("\t\t\tSending Error Message to User".info);
			sendMessage(message.channel, "", { "embed": {
				"title": "User Not Recognized",
				"description": "The user you specified to unignore could not be recognized. Please make sure to use a correctly formated mention (@user#0000).",
				"color": 16711680, //red
			} }, false);
			continue;
		}
		
		var success = false;
		for (var i2 = 0; i2 < memory.ignoredUsers.length; i2++)
		{
			if (memory.ignoredUsers[i2] === user)
			{
				memory.ignoredUsers.splice(i2, 1);
				syncMemory();
				
				console.log("\t\t\tUser Unignored".info);
				sendMessage(message.channel, "", { "embed": {
					"title": "User Unignored",
					"description": "<@" + user + "> will no longer be ignored.",
					"color": 65280, //green
				} }, false);
				
				success = true;
				break;
			}
		}
		
		if (!success)
		{
			console.log("\t\t\tUser Already Not Ignored".warning);
			console.log("\t\t\tSending Error Message to User".info);
			sendMessage(message.channel, "", { "embed": {
				"title": "User Already Not Ignored",
				"description": "<@" + user + "> is already not being ignored. No change has been made.",
				"color": 16762880, //yellow-orange
			} }, false);
		}
	}
}

var whitelist = function(message, afterCmd) {
	//make artifical channel
	if (afterCmd[0] === undefined) afterCmd[0] = "<#" + message.channel.id + ">"	

	for (var i = 0; i < afterCmd.length; i++)
	{
		var channel = extractMentionOfAChannel(afterCmd[i]);
		
		console.log("\t\t\tExtracted Channel Mention".info);	
		console.log("\t\t\t\tChannel: ".info + channel);

		if (channel === undefined)
		{
			console.log("\t\t\tExtraction of Channel Mention Failed".warning);
			console.log("\t\t\tSending Error Message to User".info);
			sendMessage(message.channel, "", { "embed": {
				"title": "Channel Not Recognized",
				"description": "The channel you specified to whitelist could not be recognized. Please make sure to use a correctly formated channel reference (#channel_name).",
				"color": 16711680, //red
			} }, false);
			continue;
		}
		
		var alreadyWhitelisted = false;
		for (var i2 = 0; i2 < memory.whitelistedChannels.length; i2++)
		{
			if (memory.whitelistedChannels[i2] === channel)
			{
				alreadyWhitelisted = true;
				console.log("\t\t\tChannel Already Whitelisted".warning);
				console.log("\t\t\tSending Error Message to User".info);
				sendMessage(message.channel, "", { "embed": {
					"title": "Channel Already Whitelisted",
					"description": "<#" + channel + "> is already whitelisted. No change has been made.",
					"color": 16762880, //yellow-orange
				} }, false);
				continue;
			}
		}
		if (alreadyWhitelisted) continue;
			
		memory.whitelistedChannels.push(channel);
		syncMemory();
			
		console.log("\t\t\tChannel Whitelisted".info);
		sendMessage(message.channel, "", { "embed": {
			"title": "Channel Whitelisted",
			"description": "<#" + channel + "> has been whitelisted.",
			"color": 65280, //green
		} }, false);
	}
}

var unwhitelist = function(message, afterCmd) {
	//make artifical channel
	if (afterCmd[0] === undefined) afterCmd[0] = "<#" + message.channel.id + ">"	
	
	for (var i = 0; i < afterCmd.length; i++)
	{
		var channel = extractMentionOfAChannel(afterCmd[i]);
		
		console.log("\t\t\tExtracted User/Channel Mentions".info);
		console.log("\t\t\t\tChannel: ".info + channel);
		
		if (channel === undefined)
		{
			console.log("\t\t\tExtraction of Channel Mention Failed".warning);
			console.log("\t\t\tSending Error Message to User".info);
			sendMessage(message.channel, "", { "embed": {
				"title": "Channel Not Recognized",
				"description": "The channel you specified to unwhitelist could not be recognized. Please make sure to use a correctly formated channel reference (#channel_name).",
				"color": 16711680, //red
			} }, false);
			continue;
		}
		
		var success = false;
		for (var i2 = 0; i2 < memory.whitelistedChannels.length; i2++)
		{
			if (memory.whitelistedChannels[i2] === channel)
			{
				memory.whitelistedChannels.splice(i2, 1);
				syncMemory();
				
				console.log("\t\t\tChannel Unwhitelisted".info);
				sendMessage(message.channel, "", { "embed": {
					"title": "Channel Unwhitelisted",
					"description": "<#" + channel + "> will no longer be whitelisted.",
					"color": 65280, //green
				} }, false);
				
				success = true;
				break;
			}
		}	
		
		if (!success)
		{
			console.log("\t\t\tChannel Already Not Whitelisted".warning);
			console.log("\t\t\tSending Error Message to User".info);
			sendMessage(message.channel, "", { "embed": {
				"title": "Channel Already Not Whitelisted",
				"description": "<#" + channel + "> is already not whitelisted. No change has been made.",
				"color": 16762880, //yellow-orange
			} }, false);
		}
	}
}

var printServerWhitelist = function(message) {
	console.log("\t\t\tGenerating Server Whitelist".info);
	
	var serverChannels = message.guild.channels.array();
	
	var richEmbed = {
		"embed": {
			"title": "Whitelisted Channels Of '" + message.guild.name + "'",
			"description": "",
			"color": 9605778, //gray
			"timestamp": new Date(message.createdTimestamp).toISOString(),
			"footer": { "text": "Current As Of" },
			"fields": []
		}
	}
	
	for (var i = 0; i < memory.whitelistedChannels.length; i++)
	{
		var isInServer = false;
		for (var i2 = 0; i2 < serverChannels.length; i2++)
		{
			if (serverChannels[i2].id === memory.whitelistedChannels[i]) isInServer = true;
		}
		
		if (isInServer) richEmbed.embed.description += "<#" + memory.whitelistedChannels[i] + ">\n";
	}
	
	if (richEmbed.embed.description === "") richEmbed.embed.description = "[None]";

	console.log("\t\t\tSending Server Whitelist Message".info);
	sendMessage(message.channel, "", richEmbed, false);
}

var printServerIgnoredUsersList = function(message) {
	console.log("\t\t\tGenerating Server Ignored User List".info);
	
	var serverUsers = message.guild.members.array();	

	var richEmbed = {
		"embed": {
			"title": "Ignored Users In '" + message.guild.name + "'",
			"description": "",
			"color": 9605778, //gray
			"timestamp": new Date(message.createdTimestamp).toISOString(),
			"footer": { "text": "Current As Of" },
			"fields": []
		}
	}
	
	for (var i = 0; i < memory.ignoredUsers.length; i++)
	{
		var isInServer = false;
		for (var i2 = 0; i2 < serverUsers.length; i2++)
		{
			if (serverUsers[i2].id === memory.ignoredUsers[i]) isInServer = true;
		}
		
		if (isInServer) richEmbed.embed.description += "\t<@" + memory.ignoredUsers[i] + ">\n";
	}
	
	if (richEmbed.embed.description === "") richEmbed.embed.description = "[None]";
	
	console.log("\t\t\tSending Server Ignored User List Message".info);
	sendMessage(message.channel, "", richEmbed, false);
}

var countering = function(message) {
	for (var i = 0; i < catchphrases.length; i++)
	{
		var toTest = message.content.toLowerCase();
		
		if (message.content.toLowerCase().includes(catchphrases[i].toLowerCase()))
		{
			console.log("\t\t\tCountering Triggered:".info);
			console.log("\t\t\t\t" + catchphrases[i]);
			sendMessage(message.channel, catchphrases[i], undefined, false);
			return true;
		}
	}
	
	return false;
}

var sendMessage = function(channel, content, options, simTyping) {	
	if (simTyping === undefined) simTyping = false;
	
	console.log("Sending Message:".system);
		console.log("\tContains:".info);
			console.log("\t\tContent:".info);
				console.log("\t\t\t" + content);
			console.log("\t\tOptions:".info);
				console.log("\t\t\t" + JSON.stringify(options));
		console.log("\tSending To:".info);
			if (channel.guild !== undefined) console.log("\t\tGuild:   \"".info + channel.guild.name + "\" (".info + channel.guild.id + ")".info);
			console.log("\t\tChannel: \"".info + channel.name + "\" (".info + channel.id + ")".info);
	
	if (simTyping && content !== "")
	{
		var timeTypeSec = content.length / typingSpeed ;
		
		channel.startTyping();
		setTimeout(
			function() { 
				channel.stopTyping(); 
				channel.send(content, options).catch(sendingMessageError);
			}, 
			timeTypeSec * 1000
		);
	}
	else
	{
		if (content !== "") channel.send(content, options).catch(sendingMessageError);
		else channel.send(options).catch(sendingMessageError);
	}	
}

var removeMentions = function(message) {
	var str = message.content;
	
	str = str.replace("@everyone", "");
	str = str.replace("@here", "");
	
	var users = message.mentions.users.array();
	for (var i = 0; i < users.length; i++)
	{
		str = str.replace("<@" + users[i].id + ">", "");
		str = str.replace("<@!" + users[i].id + ">", "");
	}
	
	var roles = message.mentions.roles.array();
	for (var i = 0; i < roles.length; i++)
	{
		str = str.replace("<@&" + roles[i].id + ">", "");
	}
	
	return str.trim();
}

var grammarStandardizer = function (str) {
	//str = str.toLowerCase();
	
	//split string
	var strs = str.split(' ');
	
	//edit string piece by piece
	for (var i = 0; i < strs.length; i++)
	{
		for (var i2 = 0; i2 < gramCor.length; i2++)
		{
			for (var i3 = 0; i3 < gramCor[i2].incorrect.length; i3++)
			{
				if (strs[i].toLowerCase() === gramCor[i2].incorrect[i3])
				{
					strs[i] = gramCor[i2].correct;
				}
			}
		}
	}
	
	//rebuild string
	str = '';
	for (var i = 0; i < strs.length; i++)
	{
		str += strs[i];
		if (i != strs.length - 1) str += ' ';
	}
		
	return str;
}

var commandStandardizer = function (str) {
	for (var i = 0; i < equivalentCommands.length; i++)
	{
		for (var i2 = 0; i2 < equivalentCommands[i].commands.length; i2++)
		{
			if (str === equivalentCommands[i].commands[i2])
			{
				return equivalentCommands[i].convertTo;
			}
		}
	}

	return str;
}

var captializeFirstLetter = function (str) {
	return str.charAt(0).toUpperCase() + str.substring(1, str.length);
}

var isMentioning = function (message) {
	//var mentioned = false;
	
	var users = message.mentions.users.array();
	var roles = message.mentions.roles.array();
	
	if (message.mentions.everyone) return true;
	
	if (message.isMentioned(client.user)) return true;
	
	for (var i = 0; i < roles.length; i++)
	{
		var members = roles[i].members.array();
		
		for (var i2 = 0; i2 < members.length; i2++)
		{
			if (client.user === members[i2].user)
			{
				return true;
			}
		}
	}
	
	return false;
}

var isCommand = function(str) {
	str = str.trim();
	
	return str.charAt(0) === '!';
}

var isWhitelistedChannel = function(channel) {
	for (var i = 0; i < memory.whitelistedChannels.length; i++)
	{
		if (channel.id === memory.whitelistedChannels[i]) return true;
	}
	
	return false;
}

var isIgnoredUser = function(user) {
	for (var i = 0; i < memory.ignoredUsers.length; i++)
	{
		if (user.id === memory.ignoredUsers[i]) return true;
	}
	
	return false;
}

var randomChance = function(percent) {
	var randNum = Math.floor(Math.random() * (1 / percent));
	if (randNum === 0) return true;
	return false;
}

var randomArrayElement = function(arr) {
	return arr[randomInteger(0, arr.length)];
}

var randomInteger = function(min, max) {
	if (max < min)
	{
		var temp = max;
		max = min;
		min = temp;
	}
	
	return Math.floor(Math.random() * max + min);
}

var syncMemory = function() {	
	console.log("Syncing memory.json".system);
	fs.writeFileSync(filePath + "memory.json", JSON.stringify(memory)); 
}

var addToUserIDLog = function(tag, userID) {
	var log = JSON.parse(fs.readFileSync("./userIDLog.json"));
	
	var alreadyHas = false;
	var save = false;
	for (var i = 0; i < log.log.length; i++)
	{
		if (log.log[i].userID === userID)
		{
			if (log.log[i].tag !== tag)
			{
				log.log[i].tag = tag;
				save = true;
			}
			alreadyHas = true;
		}
	}
	
	if (!alreadyHas)
	{
		log.log.push(
			{
				"tag": tag,
				"userID": userID
			}
		);
		
		save = true;
	}
	
	if (save)
	{
		console.log("Updating userIDLog.json".system);
		fs.writeFileSync("./userIDLog.json", JSON.stringify(log)); 		
	}
}

var sendingMessageError = function(err) {
	if (err != null) console.log("\tCould not send message: ".error + err);
}

console.log("Logging In...".system);
client.login(info.bot.token);