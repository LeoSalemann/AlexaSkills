'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SKILL_NAME = 'FSX and Prepared Keyboard Bindings';
var recipes = require('./recipes');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    //Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.emit('RecipeIntent');
    },

    'NewSession': function () {
//        this.emit('RecipeIntent');
/*
      var itemSlot = this.event.request.intent.slots.Item;
      var itemName;
      if (itemSlot && itemSlot.value) {
          var recipe = recipes[itemName];

          itemName = itemSlot.value.toLowerCase();

          this.attributes['speechOutput'] = "I have item " + itemName + " and recipe " + recipe;

      } else {
*/
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like,' +
            ' how do I lower my flaps? And I\'ll answer with something like F7. ' +
            'Now, what can I help you with?';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
/*      } */
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'RecipeIntent': function () {
        var itemSlot = this.event.request.intent.slots.Item;
        var itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = SKILL_NAME;
        var recipe = recipes[itemName];

        if (recipe) {
            this.attributes['speechOutput'] = recipe + " will " + itemName + " ... What else can I help with?";
            this.attributes['repromptSpeech'] = 'Try saying repeat.';
            this.emit(':askWithCard', this.attributes['speechOutput'] , this.attributes['repromptSpeech'], cardTitle, recipe);
        } else {
            var speechOutput = 'I\'m sorry, I currently do not know ';
            var repromptSpeech = 'What else can I help with?';
            if (itemName) {
                speechOutput = speechOutput + 'the key binding for ' + itemName + '. ';
            } else {
                speechOutput += 'that key binding. ';
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask questions such as, what\'s the key binding for lowering flaps, ' +
        ' And I\'ll respond with somethlink like F7. or, you can say exit... Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, what\'s the key binding for lowering flaps, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Goodbye!');
    }
};
