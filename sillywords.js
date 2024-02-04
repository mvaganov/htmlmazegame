const SILLY_NAMES = ["bitty","bore","bug","bum", "dinq", "fuzz", "goo", "gum", "hick", "pea", "shoo", "slug", "sniff", "stink", "trash", "worm", "zoo", "fig", "chew", "beanie", "mad", "egg", "wee", "lick", "fart", "buzz", "fluff", "poop", "barf", "rat", "bobo", "booger", "fudge", "doozy", "hippy", "jiggy", "dink", "oink", "roach", "snot", "sock", "toot", "pie", "wiggle", "spotty", "hobo", "woof", "noodle", "droopy", "pants", "moo", "buns", "kins", "face", "ball", "rider", "worth", "ton"];
function getRandomInt(max) { return Math.floor(Math.random() * max); }
function getRandomChoice(choices) { return choices[getRandomInt(choices.length)]; }
function randomNameBit() {
	return SILLY_NAMES[getRandomInt(SILLY_NAMES.length)];
}
function generateSillyName() {
	return randomNameBit()+" "+randomNameBit()+randomNameBit();
}
var agentDictionary = {};
function generateUniqueSillyName(){
	let sillyName = generateSillyName();
	let guard = 0;
	do {
		if (++guard > 100) { throw "too many silly names? "+Object.keys(agentDictionary).length;}
		sillyName = generateSillyName();
	} while (agentDictionary[sillyName] !== undefined);
	agentDictionary[sillyName] = 1;
	return sillyName;
}

function createSillyWordArray(segmentCount) {
	let array = [];
	for (let i = 0; i < segmentCount; i++) {
		array[i] = getRandomInt(SILLY_NAMES.length);
	}
	let index = 0;
	while(index < array.length) {
		let segmentCountForWord = 1 + getRandomInt(2);
		index += segmentCountForWord;
		if (index < array.length) {
			array.splice(index, 0, -1);
			++index;
		}
	}
	return array;
}

function compileSillyWordArrayToText(sillyWordArray) {
	let text = "";
	let needForPause = 0;
	let minIdeasPerPause = 3;
	let maxIdeasPerPause = 5;
	let ideaCountDelta = maxIdeasPerPause - minIdeasPerPause;
	for(let i=0; i < sillyWordArray.length; i++) {
		let wordIndex = sillyWordArray[i];
		if (wordIndex >= 0) {
			let wordSegment = SILLY_NAMES[wordIndex];
			text += wordSegment;
			if (i+1 >= sillyWordArray.length) {
				text += getRandomChoice(['!','.','?']);
			}
		} else {
			let ideaWeight = 1 / (minIdeasPerPause + getRandomInt(ideaCountDelta));
			needForPause += ideaWeight;
			if (needForPause >= 1) {
				//console.log(needForPause-1 + " vs " + (1/maxIdeasPerPause));
				if (needForPause-1 > (1/maxIdeasPerPause)) {
					text += "!";
				} else {
					text += getRandomChoice([',','.','?']);
				}
				text += "\n";
				needForPause = 0;
			} else {
				text += " ";
			}
		}
	}
	return text;
}
