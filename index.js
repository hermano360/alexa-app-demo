var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',         			// Alexa is prompting the user to start or restart the interaction in this state
    ASKLANGUAGE: '_ASKLANGUAGE',        		// Alexa is asking user the questions in this state
    ASK_FRENCH_WORDS: '_ASK_FRENCH_WORDS',    	// Alexa is asking the words to be translated in French in this state
    ASK_SPANISH_WORDS: '_ASK_SPANISH_WORDS',	// Alexa is asking the words to be translated in Spanish this state
    ASK_GERMAN_WORDS: '_ASK_GERMAN_WORDS',		// Alexa is asking the words to be translated in German this state
    TRANSLATION_GIVEN: '_TRANSLATION_GIVEN'		// Alexa is giving translating, waiting to restart
};

// These are messages that Alexa says to the user during conversation

// This is the initial welcome message
var welcomeMessage = "Welcome to Translate This. Would you like to continue?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Would you like to translate some words?";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Please say yes to continue or no to quit. ";

// This is the prompt during the app when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "Please repeat your yes or no answer";

// This is the prompt for language
var promptForLanguage = "Please indicate which language you would like, Spanish, French, or German?";

// This is the reprompt for language
var repromptForLanguage = "Please say Spanish, French, or German";

// This is the prompt in case of incorrect language
var incorrectLanguage = "That language is not yet supported. Please say Spanish, French, or German.";

// Prompt for word
var promptForWord = "Please choose one of the following phrases. Hello. Goodbye. How are you.";

// reprompt for word
var repromptForWord = "Please say Hello, Goodbye, or How are you";

// responding to unsupported word said
var incorrectWord = "That word or phrase is not supported. Please say Hello, Goodbye, or How are you";


// this is the help message during the setup at the beginning of the game
var helpMessage = `Translation This App will help you to say a couple key phrases in Spanish, French, and German. 
				The app will prompt you for a language and then you can choose a phrase to translate. 
				Would you like to continue?`;

// this is the repate help message during the setup at the beginning of the game
var helpMessageRepeat = "Would you like to continue?";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Until next time!";

// This is the simulated translation object. To be replaced with Translation API
var translations = {
	fr:{
		hello: 'bone jur',
		goodbye: 'oar eh vooah',
		'how are you': 'como taleh vu'
	},
	sp:{
		hello: 'oh la',
		'goodbye': 'ah di owes',
		'how are you': 'como estas'
	},
	de:{
		hello: 'hallo',
		goodbye: 'off veeder sen',
		'how are you': 'vee get es dear'
	}
};

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startTranslationHandlers, askLanguageHandlers, frenchHandlers, spanishHandlers, germanHandlers,translateHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
    'NewSession': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    }
};

// Once the user has agreed to continue, this is how the program will ask for language.
var startTranslationHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {
        // set state to asking for Language
        this.handler.state = states.ASKLANGUAGE;
        // ask the first question
        this.emit(':ask', promptForLanguage, repromptForLanguage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessageRepeat);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});

var askLanguageHandlers = Alexa.CreateStateHandler(states.ASKLANGUAGE, {
	'LanguageIntent': function () {
    // making sure language is supported
    var language = this.event.request.intent.slots.Language.value;
    if(language === undefined){
    	language = "";
    }
    switch(language.toLowerCase()){
    	case 'spanish':
    		this.handler.state = states.ASK_SPANISH_WORDS;
    		this.emit(':ask', promptForWord, repromptForWord);
    		break;
    	case 'german':
    		this.handler.state = states.ASK_GERMAN_WORDS;
    		this.emit(':ask', promptForWord, repromptForWord);
    		break;
    	case 'french':
    		this.handler.state = states.ASK_FRENCH_WORDS;
    		this.emit(':ask', promptForWord, repromptForWord);
    		break;
    	default:
    		this.emit(':ask', incorrectLanguage, repromptForLanguage);
    }
},
    'AMAZON.HelpIntent': function () {
    	this.emit(':ask', promptForLanguage, repromptForLanguage);
    },
    'AMAZON.StopIntent': function () {
    	this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
    	this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
    	this.emit(':ask', promptForLanguage, repromptForLanguage);
    }
});

var frenchHandlers = Alexa.CreateStateHandler(states.ASK_FRENCH_WORDS, {
    'TranslationIntent': function () {
    // making sure word is supported
	    var word = this.event.request.intent.slots.TranslationWord.value;
	    if(word === undefined){
    		word = "";
    	}

	    switch(word.toLowerCase()){
	        case 'hello':
	    	case 'goodbye':
	    	case 'how are you':
	    		var message = helper.giveTranslation('fr',word);
				var repromptMessage= 'Would you like to restart?'
				this.handler.state = states.TRANSLATION_GIVEN;
        		this.emit(':ask', message, repromptMessage);
			break;
		default:
	    	this.emit(':ask', incorrectWord, repromptForWord);
	    	break;
	    }
	},

    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptForWord, repromptForWord);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },

    'Unhandled': function () {
        this.emit(':ask', promptForWord, repromptForWord);
    }
});

var spanishHandlers = Alexa.CreateStateHandler(states.ASK_SPANISH_WORDS, {
    'TranslationIntent': function () {
    // making sure word is supported
	    var word = this.event.request.intent.slots.TranslationWord.value;
	    console.log(word);
	    switch(word.toLowerCase()){
	        case 'hello':
	    	case 'goodbye':
	    	case 'how are you':
	    		var message = helper.giveTranslation('sp',word);
				var repromptMessage= 'Would you like to restart?'
				this.handler.state = states.TRANSLATION_GIVEN;
        		this.emit(':ask', message, repromptMessage);
			break;
		default:
	    	this.emit(':ask', incorrectWord, repromptForWord);
	    	break;
	    }
	},

    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptForWord, repromptForWord);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },

    'Unhandled': function () {
        this.emit(':ask', promptForWord, repromptForWord);
    }
});

var germanHandlers = Alexa.CreateStateHandler(states.ASK_GERMAN_WORDS, {
    'TranslationIntent': function () {
    // making sure word is supported
	    var word = this.event.request.intent.slots.TranslationWord.value;
	    switch(word.toLowerCase()){
	        case 'hello':
	    	case 'goodbye':
	    	case 'how are you':
	    		var message = helper.giveTranslation('de',word);
				var repromptMessage= 'Would you like to restart?'
				this.handler.state = states.TRANSLATION_GIVEN;
        		this.emit(':ask', message, repromptMessage);
			break;
		default:
	    	this.emit(':ask', incorrectWord, repromptForWord);
	    	break;
	    }
	},

    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptForWord, repromptForWord);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },

    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },

    'Unhandled': function () {
        this.emit(':ask', promptForWord, repromptForWord);
    }
});

var translateHandlers = Alexa.CreateStateHandler(states.TRANSLATION_GIVEN, {
    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessageRepeat);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});



var helper = {
    giveTranslation: function (language, word) {
    	console.log(language,word)
		var translatedWord = translations[language][word];
		var message = `The translation for ${word} is ${translatedWord}, would you like to restart?`;
		return message

    }
}








