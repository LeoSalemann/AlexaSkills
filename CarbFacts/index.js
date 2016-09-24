'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Carb Facts';

/**
 * Array containing carbohydrate facts.
 */
var FACTS = [
    "Bread Beer and Pasta are some of the most carb-dense foods around.  Sad isnt it?",
    "Meat and Cheese have practically no carbs.  So you have that going for you which is nice.",
    "Foldgers instant coffee has zero carbs.  Hurray for that!",
    "149 grams of raw tomatoes has 5.8 grams of carbs. Go for it.",
    "One cup (149 grams) of apples has 17.3 grams of carbs.  A large apple a day blows half your carb budget",
    "One fluid ounce (a shotglass, basically), of whole milk has 1.4 grams of carbs. Drink up",
    "14 grams of Hershey Milk Chocolate Chips has 9 grams of carbs.  Not too bad, really",
    "100 grams of Kiwi, about one fruit, has 14.7 grams of carbs. One of the more carb-friendly fruit choices",
    "A bottle of Square mile hard cider has 12 grams of carbs. One of the lowest-carb hard ciders you can find.",
    "100 grams of those cute little clementines, about one fruit, has 9 grams of carbs.  Not too shabby at all.",
    "A tall PSL, 250 ml, has 15 grams of carbs. So stay away from the Grandes, buddy.",
    "One 250ml cub of White Mountain Bulgarioun yogurt has 5 grams of carbs. Party on with carb-friendly yogurt.",
    "One tablespoon of Walls berry Farm Marionberry Jam has 14 grams of carbs. Be careful of that."
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random carbohydrate fact from the carbohydrate facts list
        var factIndex = Math.floor(Math.random() * FACTS.length);
        var randomFact = FACTS[factIndex];

        // Create speech output
        var speechOutput = "Here's your fact: " + randomFact;

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a carb fact, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};

