//helpful url https://discordapp.com/developers/applications/me

//stuff to add:
//more originals

//admin only commands
//change blacklist to whitelist
//make whitelist global
//get rid of show whitelist command, make whitelist toggle only

// Initialize Librarys
var Discord = require('discord.io');
const fs = require('fs');

// Starting Command
if (process.argv[2] === null || process.argv[2] === "" || process.argv[2] === undefined) {	
	console.log("Original to copy not defined, closing program");
	process.exit();
}
var startingCommand = process.argv[2];
if (!fs.existsSync('./Originals/' + startingCommand + '/info.json')) {
	console.log("Not a valid Original, closing program");
	process.exit();
}

var filePath = './Originals-old/' + startingCommand + '/';

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

//Commands
var commandDescriptions = [
	{
		"triggers": ["help", "commands", "cmds"],
		"description": "Sends a direct message to the user, specifying all possible commands"
	},
	{
		"triggers": ["quote", "archives"],
		"description": "Prints a quote from the archives"
	},
	{
		"triggers": ["say"],
		"description": "Takes a string encased in \"\" and spits it back at the user. Converts \\33 to !, \\n to newlines, and \\t to tabs."
	},
	{
		"triggers": ["reportpercentage", "currentpercentage"],
		"description": "Prints out the current " + uniqueData.percentageName
	},
	{
		"triggers": ["increasepercentage"],
		"description": "Increases the " + uniqueData.percentageName + " by the number specified. If no number specified, increases by 1%"
	},
	{
		"triggers": ["decreasepercentage", "reducepercentage"],
		"description": "Decreases the " + uniqueData.percentageName + " by the number specified. If no number specified, decreases by 1%"
	},
	{
		"triggers": ["changepercentage", "modifypercentage", "shiftpercentage"],
		"description": "Changes the " + uniqueData.percentageName + " by the number specified. If no number specified, increases by 1%"
	},
	{
		"triggers": ["setpercentage", "percentage="],
		"description": "Sets the " + uniqueData.percentageName + " to the number specified"
	},
	{
		"triggers": ["quietmode"],
		"description": "Sets the " + uniqueData.percentageName + " to 0%"
	},
	{
		"triggers": ["crazymode"],
		"description": "Sets the " + uniqueData.percentageName + " to 100%"
	},
	{
		"triggers": ["countering", "counter"],
		"description": "Toggles the countering feature"
	},
	{
		"triggers": ["blacklist", "ignore"],
		"description": "Blacklists the specified channel or user"
	},
	{
		"triggers": ["unblacklist", "unignore"],
		"description": "Unblacklists the specified channel or user"
	},
	{
		"triggers": ["printblacklist", "currentblacklist", "seeblacklist", "showblacklist", "reportblacklist"],
		"description": "Prints out the current blacklist"
	}
]
	
// Initialize Discord Bot
var bot = new Discord.Client({
		token: info.bot.token,
	autorun: true
});

// Define Discord Bot Functions
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');	
		
	bot.setPresence({game: {name: info.original.username}});
});
bot.on('message', function (user, userID, channelID, message, evt) {

	//log, even if self message
	addToUserIDLog(user, userID);

	//if self message, skip
	if (userID == info.bot.userID) return;

	console.log('Recieved message: [' + message + ']');
	
	if (isFromBlacklistedUser(userID) || isOnBlacklistedChannel(channelID)) 
	{
		console.log('Message triggered blacklist, ignoring');
		return;
	}
	
	//format message
	message = message.toLowerCase();
	message = message.trim();
	message = grammarStandardizer(message);
	
	console.log('\tFormated message: [' + message + ']');
	
	//check to see if it is a special message
	if (isMentioning(message))
	{		
		console.log('\tMessage is a mention');
		
		mentioned(user, userID, channelID, message, evt);
		return;
	}
	
	//countering original
	if (userID === info.original.userID && memory.countering)
	{
		console.log('\tMessage is from original, countering active');
		
		if (countering(user, userID, channelID, message, evt)) return;
		
		console.log('\tDid not trigger countering');
	}
	
	//random catchphrase responses
	if (randomChance(memory.percentage))
	{
		var str = randomArrayElement(catchphrases);	 
		 
		console.log('\tResponding with catchphrase: [' + str + ']');
		sendMessage(channelID, str, true);
	}


});

var mentioned = function(user, userID, channelID, message, evt) {
	//remove mention
	message = message.replace('<@!' + info.bot.userID + '>', '');
	message = message.replace('<@' + info.bot.userID + '>', '');
	message = message.trim();
	
	console.log('\t\tRemoved mention statement: [' + message + ']');

	if (checkCustomResponses(user, userID, channelID, message, evt)) return;
	
	//search for commands
	var splitMsg = message.split(/[\s\n]+/);
	var wasCmd = false;
	for (var i = 0; i < splitMsg.length; i++)
	{
		console.log('\t\tScanning message section: [' + splitMsg[i] + ']');
		if (isCommand(splitMsg[i]))
		{
			console.log('\t\tSection is a command');
			
			var afterCmd = splitMsg.slice(i + 1, splitMsg.length);
			
			commanded(user, userID, channelID, splitMsg[i], afterCmd, evt);
			
			wasCmd = true;
		}
	}
	if (wasCmd) return;
	
	
	console.log('\t\tMessage is just a regular mention');
	//not custom or command, regular reply
	if(randomChance(0.5))
	{
		var str = randomArrayElement(mentionResponses);
		
		console.log('\t\t\tSending mention response: [' + str + ']');
		
		sendMessage(channelID, str, true);
	}
	else
	{
		var str = randomArrayElement(catchphrases);
		
		console.log('\t\t\tSending a catchphrase: [' + str + ']');
		
		sendMessage(channelID, str, true);	
	}
	
}

var checkCustomResponses = function(user, userID, channelID, message, evt) {
	console.log("\t\tLooking for custom responses");
	
	message = message.toLowerCase();
	message = message.trim();
	
	for (var i = 0; i < customResponses.length; i++)
	{
		for (var i2 = 0; i2 < customResponses[i].triggers.length; i2++)
		{
			if (message === customResponses[i].triggers[i2])
			{
				var str = randomArrayElement(customResponses[i].responses);
				
				console.log("\t\t\tFound custom response: [" + str + "]");
				sendMessage(channelID, str, true);
				return true;
			}
		}
	}
			
	return false;
}

var commanded = function(user, userID, channelID, cmd, afterCmd, evt) {
	cmd = cmd.trim();
	cmd = cmd.slice(1, cmd.length); //remove ! at beginning
	cmd = commandStandardizer(cmd); //equivalent Commands
	
	console.log("\t\t\tFormated command: [" + cmd + "]");
	
	switch (cmd)
	{
		case "help":
		case "commands":
		case "cmds":
			help(userID);
			break;
		
		case "quote":
		case "archives":
			quote(channelID);
			break;
			
		case "say":
			say(channelID, afterCmd);
			break;
		
		case "reportpercentage":
		case "currentpercentage":
			reportPercentage(channelID);
			break;
			
		case "increasepercentage":
			changePercentage(channelID, parseToIntForPercentageChanging(afterCmd, '+'));
			break;
			
		case "decreasepercentage":
		case "reducepercentage":
			changePercentage(channelID, parseToIntForPercentageChanging(afterCmd, '-'));
			break;
			
		case "changepercentage":
		case "modifypercentage":
		case "shiftpercentage":
			changePercentage(channelID, parseToIntForPercentageChanging(afterCmd, '+-'));
			break;
			
		case "setpercentage":
		case "percentage=":
			setPercentage(channelID, parseToIntForPercentageChanging(afterCmd, '='));
			break;
		
		case "quietmode":
			setPercentage(channelID, 0);
			break;
			
		case "crazymode":
			setPercentage(channelID, 100);
			break;
			
		case "countering":
		case "counter":
			toggleCountering(channelID);
			break;
			
		case "blacklist":
		case "ignore":
			blacklist(channelID, afterCmd);
			break;
		
		case "unblacklist":
		case "unignore":
			unblacklist(channelID, afterCmd);
			break;
		
		case "printblacklist":
		case "currentblacklist":
		case "seeblacklist":
		case "showblacklist":
		case "reportblacklist":
			printBlacklist(channelID);
			break;
		
		default:
			if (!checkCustomCommands(user, userID, channelID, cmd, afterCmd, evt))
			{
				console.log("\t\t\tCommand is not recognized, sending error message");
				sendMessage(channelID, uniqueData.incorrectCommandResponse);
			}
			break;
	}
}

var checkCustomCommands = function(user, userID, channelID, cmd, afterCmd, evt) {	
	for (var i = 0; i < customCommands.length; i++)
	{
		for (var i2 = 0; i2 < customCommands[i].commands.length; i2++)
		{
			if (cmd === customCommands[i].commands[i2])
			{
				if (typeof uniqueFunc[customCommands[i].func] !== 'undefined')
				{
					console.log('\t\t\tCommand is a custom command');
					uniqueFunc[customCommands[i].func]({bot: bot, filePath: filePath, userID: userID, channelID: channelID, cmd: cmd, evt: evt});
					return true;
				}
				else 
				{
					console.log("Found bug in code: customCommand of " + customCommands[i].commands[i2] + " has the function " + customCommands[i].func + " which is not defined in uniqueFunctions.js");
				}
			}
		}
	}
	
	return false;
}

var help = function(userID) {
	var msg = "**Bolded commands are special equivalencies unique to this bot**\n\n";
	msg += "__Default Commands:__";
	for (var i = 0; i < commandDescriptions.length; i++)
	{
		var equivIndex = -1;
		
		for (var i2 = 0; i2 < commandDescriptions[i].triggers.length; i2++)
		{
			msg += "\n";
			msg += "\t!" + commandDescriptions[i].triggers[i2] + ":";
			
			for (var i3 = 0; i3 < equivalentCommands.length; i3++)
			{
				if (equivalentCommands[i3].convertTo === commandDescriptions[i].triggers[i2]) equivIndex = i3;
			}
		}
		
		if (equivIndex !== -1)
		{
			for (var i2 = 0; i2 < equivalentCommands[equivIndex].commands.length; i2++)
			{
				msg += "\n";
				msg += "\t**!" + equivalentCommands[equivIndex].commands[i2] + "**:";
			}
		}
		
		msg += "\n\t\t\t*" + commandDescriptions[i].description + "*";
	}
	
	msg += "\n\n__Custom Commands:__";
	for (var i = 0; i < customCommands.length; i++)
	{
		for (var i2 = 0; i2 < customCommands[i].commands.length; i2++)
		{
			msg += "\n";
			msg += "\t!" + customCommands[i].commands[i2] + ":";
		}
		
		msg += "\n\t\t\t" + customCommands[i].description;
	}
	
	sendMessage(userID, msg);
}

var quote = function(channelID) {
	console.log('\t\t\tSending quote');
	var str = randomArrayElement(quotes)
	sendMessage(channelID, str);
}

var say = function(channelID, afterCmd) {
	/*
	var unsplit = '';
	for (var i = 0; i < afterCmd.length; i++)
	{
		unsplit += afterCmd[i];
		if (i != afterCmd.length - 1) unsplit += ' ';
	}
	
	if (unsplit.charAt(0) !== '"')
	{
		console.log("\t\t\tCould not recognize string");
		sendMessage(channelID, ">The string you sent could not be parsed.");
		return;
	}
	
	var str = unsplit.split('"');
	for (var i = 0; i < str.length; i++)
	{
		if (str[i] === '')
		{
			str.splice(i, 1);
			i = 0;
		}
	}
	
	var toSay = str[0];
	
	//toSay = toSay.replace('\\n', '\n');
	//toSay = toSay.replace('\\t', '\t');
	//toSay = toSay.replace("\\'", 
	*/
	
	/*
	var toSay = afterCmd[0];
	toSay = toSay.replace(/\\s/gi, ' ');
	toSay = toSay.replace(/\\t/gi, '\t');
	toSay = toSay.replace(/\\n/gi, '\n');
	*/
	
	var unsplit = '';
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
		sendMessage(channelID, ">The string you sent could not be parsed.");
		return;
	}
	
	var toSay = unsplit.substring(start_pos, end_pos);
	toSay = toSay.replace(/\\t/gi, '\t');
	toSay = toSay.replace(/\\n/gi, '\n');
	toSay = toSay.replace(/%33/gi, '!');
	
	console.log(start_pos);
	console.log(end_pos);
	console.log(toSay);
	
	sendMessage(channelID, toSay);
}

var reportPercentage = function(channelID) {
	console.log('\t\t\tReporting percentage');
	sendMessage(channelID, '>Current ' + uniqueData.percentageName + ' is at ' + memory.percentage * 100 + '%');
}

var parseToIntForPercentageChanging = function(afterCmd, type) {
	
	//console.log('\t\t\t\tParsing: [' + afterCmd + ']');
	var num = parseInt(afterCmd[0]);
	console.log('\t\t\t\tParsed: [' + num + ']');
	if (isNaN(num))
	{
		if (type === '=') return undefined;	
		num = 1;
	}
	if (type === '-') num *= -1;
	//console.log('\t\t\t\tReturning: [' + num + ']');
	return num;
}

var changePercentage = function(channelID, num) {
	var before = memory.percentage;
	memory.percentage += num / 100;
	if (memory.percentage < 0) memory.percentage = 0;
	if (memory.percentage > 1) memory.percentage = 1;
	syncMemory();
	
	console.log('\t\t\tChanging percentage by: ' + num);
	sendMessage(channelID, '>' + captializeFirstLetter(uniqueData.percentageName) + ' has been changed by ' + num + ', from ' + before * 100 + '% to ' + memory.percentage * 100 + '%');
}

var setPercentage = function(channelID, set) {
	if (set === undefined)
	{
		console.log("\t\t\tParsing did not work");
		sendMessage(channelID, ">The number you sent could not be parsed");
		return;
	}
	
	if (set < 0) set = 0;
	if (set > 100) set = 100;
	
	var before = memory.percentage;
	memory.percentage = set / 100;
	syncMemory();
	
	console.log('\t\t\tSetting percentage to: ' + set);
	sendMessage(channelID, '>' + captializeFirstLetter(uniqueData.percentageName) + ' has been changed from ' + before * 100 + '% to ' + memory.percentage * 100 + '%');
}

var toggleCountering = function(channelID) {
	memory.countering = !memory.countering;
	syncMemory();
	
	var type = 'on';
	if (!memory.countering) type = 'off';
	
	console.log('\t\t\tToggling countering from: ' + !memory.countering + ' -> ' + memory.countering);
	sendMessage(channelID, '>Countering is now ' + type);
}

var extractMentionOfAUser = function(str) {
	str = str.trim();
	if (str.substring(0, 2) === '<@' && str.charAt(str.length - 1) === '>')
	{
		if (str.charAt(2) === '!')	str = str.substring(3, str.length - 1);
		else str = str.substring(2, str.length - 1);
		
		return str;
	}
	
	return undefined;
}

var extractMentionOfAChannel = function(str) {
	str = str.trim();
	if (str.substring(0, 2) === '<#' && str.charAt(str.length - 1) === '>')
	{
		return str.substring(2, str.length - 1);
	}
	
	return undefined;
}

var blacklist = function(channelID, afterCmd) {
	var user = extractMentionOfAUser(afterCmd[0]);
	var channel = extractMentionOfAChannel(afterCmd[0]);
	
	if (user !== undefined)
	{	
		for (var i = 0; i < memory.blacklistedUsers.length; i++)
		{
			if (memory.blacklistedUsers[i] === user)
			{
				console.log("\t\t\tUser [" + user + "] is already blacklisted.");
				sendMessage(channelID, "> <@!" + user + "> is already blacklisted");
				return;
			}
		}
		
		memory.blacklistedUsers.push(user);
		syncMemory();
		
		console.log("\t\t\tUser [" + user + "] has been blacklisted.");
		sendMessage(channelID, "> <@!" + user + "> has been blacklisted");
		
		return;
	}
	
	if (channel !== undefined)
	{
		for (var i = 0; i < memory.blacklistedChannels.length; i++)
		{
			if (memory.blacklistedChannels[i] === channel)
			{
				console.log("\t\t\tChannel [" + channel + "] is already blacklisted.");
				sendMessage(channelID, "> <#" + channel + "> is already blacklisted");
				return;
			}
		}
		
		memory.blacklistedChannels.push(channel);
		syncMemory();
		
		console.log("\t\t\tChannel [" + channel + "] has been blacklisted.");
		sendMessage(channelID, "> <#" + channel + "> has been blacklisted");
		
		return;		
	}
	
	//user and channel === undefined

	console.log("\t\t\tExtracting user/channel failed");
	sendMessage(channelID, ">Could not recognize the user/channel to blacklist");
}

var unblacklist = function(channelID, afterCmd) {
	var user = extractMentionOfAUser(afterCmd[0]);
	var channel = extractMentionOfAChannel(afterCmd[0]);
	
	if (user !== undefined)
	{	
		for (var i = 0; i < memory.blacklistedUsers.length; i++)
		{
			if (memory.blacklistedUsers[i] === user)
			{
				memory.blacklistedUsers.splice(i, 1);
				syncMemory();
				
				console.log("\t\t\tUser [" + user + "] has been unblacklisted.");
				sendMessage(channelID, "> <@!" + user + "> has been unblacklisted");
				return;
			}
		}
		
		console.log("\t\t\tUser [" + user + "] is already not blacklisted.");
		sendMessage(channelID, "> <@!" + user + "> is already not blacklisted");
		return;
	}
	
	if (channel !== undefined)
	{
		for (var i = 0; i < memory.blacklistedChannels.length; i++)
		{
			if (memory.blacklistedChannels[i] === channel)
			{
				memory.blacklistedChannels.splice(i, 1);
				syncMemory();
				
				console.log("\t\t\tChannel [" + channel + "] has been unblacklisted.");
				sendMessage(channelID, "> <#" + channel + "> has been unblacklisted");
				return;
			}
		}		
		
		console.log("\t\t\tChannel [" + channel + "] is already not blacklisted.");
		sendMessage(channelID, "> <#" + channel + "> is already not blacklisted");
		return;		
	}
	
	//user and channel === undefined

	console.log("\t\t\tExtracting user/channel failed");
	sendMessage(channelID, ">Could not recognize the user/channel to unblacklist");

}

var printBlacklist = function(channelID) {
	var str = "";
	str += "Blacklisted Users:\n";
	for (var i = 0; i < memory.blacklistedUsers.length; i++)
	{
		str += "\t<@!" + memory.blacklistedUsers[i] + ">\n";
	}
	str += "\nBlacklisted Channels:\n";
	for (var i = 0; i < memory.blacklistedChannels.length; i++)
	{
		str += "\t<#" + memory.blacklistedChannels[i] + ">";
		if (i !== memory.blacklistedChannels.length - 1) str += "\n";
	}

	console.log("\t\t\tSending blacklist");
	sendMessage(channelID, str);
}

var countering = function(user, userID, channelID, message, evt) {
	for (var i = 0; i < catchphrases.length; i++)
	{
		if (message.includes(catchphrases[i].toLowerCase()))
		{
			console.log('\t\tCountering with: [' + catchphrases[i] + ']');
			sendMessage(channelID, catchphrases[i]);
			return true;
		}
	}
	
	return false;
}

var sendMessage = function(channelID, toSend, simTyping) {
	if (simTyping === undefined) simTyping = false;
	
	console.log('Sending message: [' + toSend + ']');
	bot.sendMessage(
		{ to: channelID, message: toSend, typing: simTyping}, 
		sendingMessageError
	);
}

var grammarStandardizer = function (str) {
	str = str.toLowerCase();
	
	//split string
	var strs = str.split(' ');
	
	//edit string piece by piece
	for (var i = 0; i < strs.length; i++)
	{
		for (var i2 = 0; i2 < gramCor.length; i2++)
		{
			for (var i3 = 0; i3 < gramCor[i2].incorrect.length; i3++)
			{
				if (strs[i] === gramCor[i2].incorrect[i3])
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

var isMentioning = function (str) {
	return (str.includes('<@!' + info.bot.userID + '>') || str.includes('<@' + info.bot.userID + '>'));
}

var isCommand = function(str) {
	str = str.trim();
	
	return str.charAt(0) === '!';
}

var isOnBlacklistedChannel = function(channelID) {
	for (var i = 0; i < memory.blacklistedChannels.length; i++)
	{
		if (channelID === memory.blacklistedChannels[i]) return true;
	}
	
	return false;
}

var isFromBlacklistedUser = function(userID) {
	for (var i = 0; i < memory.blacklistedUsers.length; i++)
	{
		if (userID === memory.blacklistedUsers[i]) return true;
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
	fs.writeFileSync(filePath + 'memory.json', JSON.stringify(memory)); 
}

var addToUserIDLog = function(user, userID) {
	var log = JSON.parse(fs.readFileSync('userIDLog.json'));
	
	var alreadyHas = false;
	var save = false;
	for (var i = 0; i < log.log.length; i++)
	{
		if (log.log[i].userID === userID)
		{
			if (log.log[i].user !== user)
			{
				log.log[i].user = user;
				save = true;
			}
			alreadyHas = true;
		}
	}
	
	if (!alreadyHas)
	{
		log.log.push(
			{
				"user": user,
				"userID": userID
			}
		);
		
		save = true;
	}
	
	if (save)
	{
		console.log('Updating userIDLog');
		fs.writeFileSync('userIDLog.json', JSON.stringify(log)); 		
	}
}

var sendingMessageError = function(err, res) {
	if (err != null) logger.error('\tERROR: could not send message\n\terr = [' + err + '], res = [' + res + ']');
}