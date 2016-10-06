/**
 * This skill is based on the decision tree skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

 /*
  TODO
  o Add a real file header
  o Do some reasearch into fuel primer
  o Do some research into parking brake
  o Figure out where elev pitch needs to be set to.
  o Confirm radio is not visible
  */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};

/*
 * These should become a colleciton of objects, where each object has a .location and a .howto attribute.
*/
var fuel_valve_location = "It's the small red knob on the left, below the window.";
var fuel_valve_howto    = "Push it in, or click with mouse."
var mixture_location = "It's the small red knob on the right, below the window.";
var mixture_howto    = "Push it in, or hit control shift F3";
var carb_heat_location  = "It's the small black knob on the right, below the window";
var carb_heat_off_howto = "Click the knob with your mouse, or hit the H key";
var carb_heat_on_howto  = "Click the knob with your mouse, or hit the H key";
var throttle_location = "It's the small knob on the left window sill";
var throttle_howto    = "use the throttle on your joystick, or ease it forward with the mouse, or hit F3 and F2 to adjust";
var fuel_primer_location = "It's kind of fake, just move on.";
var fuel_primer_howto    = "Nothing to click here, move along";
var brakes_location = "It's kind of fake, just hit the period key";
var brakes_howto    = "hit the period key";
var magnetos_location = "It's the big red lever above your left shoulder";
var magnetos_howto    = "Use the mouse to turn it to both, or hold down M, and hit the plus key until the prop \
starts spinning.";
var magnetos_toggle_howto = "Use the mouse to turn it between position one and two, or hold down M and hit plus and \
minus keys to move between the positions."

var oil_pressure_location    = "It's the bottom half of the rightmost gage"; // alexa can't pronounce "guage"
var oil_pressure_howto_10psi = "It should be at least halftway between the first two tick marks.";
var oil_pressure_howto_30psi = "It should be within half a tick of the 40.";

var stick_and_rudder_location = "The stick is between your knees; the rudder pedals are at your feet"; // alexa can't pronounce "guage"

var stick_and_rudder_howto    = "Move the joystick left and right; forward and back;  \
Watch for correct aileron and elevator movement by looking out windows, or toggling between outside and \
cockpit view using shift-S or joystick button 2;\
If you have rudder pedals, use them; otherwise, twist the joystick left and right; \
Verify by watching rudder pedals in virtual cockpit or actual rudder from external view. ";

var altimiter_location = "Second gage from right. It has a small black calibration knob to the lower left."; // alexa can't pronounce "guage"
var altimiter_howto    = "hit the B key to reset.  Or click the small black calibration knob, then use the \
mouse scroll wheeel.";

var elevator_trim_location = "It's the crank on the left sidewall, near the front seat."; // alexa can't pronounce "guage"

var elevator_trim_howto    = "Click the crank with your mouse,  then use its scroll wheel, or \
go to your number pad and use 7 for nose down and 1 for nose up.";

var radio_location = "the radio is not visible in the cockpit, but it can be summoned with \
shift 2 or menu path Views, Instrument Panel, Radio Stack."; // alexa can't pronounce "guage"

var radio_howto    = "Verify the radio is on, click the power switch if necessary. The radio can be tuned \
by hovering the mouse over digits and using the scroll wheel, or bring up the ATC Menu with Scroll Lock, \
the apostrophe key, or menu path Views, Air Traffic Control; Once the ATC window is up, select the channel \
for local A-TIS to listen for weather and altimiter settings; adjust the altimiter again if necessary.";

var device_location = "where"; // alexa can't pronounce "guage"
var device_howto    = "how";

var LAST_HAPPY_PATH_NODE = 8;

var nodes = [
  // ENGINE START - Happy Path
  { "node": 1, "message": "Turn on the fuel valve",                       "yes": 2, "no": 1001, "how": 2001 }, // fuel valve
  { "node": 2, "message": "Set the fuel mixture to Rich",                 "yes": 3, "no": 1002, "how": 2002 }, // mixture
  { "node": 3, "message": "Turn the carb heat off",                       "yes": 4, "no": 1003, "how": 2003 }, // carb heat
  { "node": 4, "message": "Open the Throttle just a little bit",          "yes": 5, "no": 1004, "how": 2004 }, // throttle  { "node": 5, "message": "Prime the fuel system",                        "yes": 6, "no": 1005, "how": 2005 }, // prime
  { "node": 5, "message": "Prime the fuel system",                        "yes": 6, "no": 1005, "how": 2005 }, // prime
  { "node": 6, "message": "Release the brakes",                           "yes": 7, "no": 1006, "how": 2006 }, // brakes
  { "node": 7, "message": "Set the Magneto Switch to On",                 "yes": 8, "no": 1007, "how": 2007 }, // magneto
  { "node": 8, "message": "Verify Oil Presure is reading at least 10psi", "yes": 9, "no": 1008, "how": 2008 }, // oil pressue

  // ENGINE START - Where's that? Questions
  { "node": 1001, "message": fuel_valve_location,   "yes": 2, "how": 2001 }, // fuel valve
  { "node": 1002, "message": mixture_location,      "yes": 3, "how": 2002 }, // mixture
  { "node": 1003, "message": carb_heat_location,    "yes": 4, "how": 2003 }, // carb heat
  { "node": 1004, "message": throttle_location,     "yes": 5, "how": 2004 }, // throttle
  { "node": 1005, "message": fuel_primer_location,  "yes": 6, "how": 2005 }, // prime
  { "node": 1006, "message": brakes_location,       "yes": 7, "how": 2006 }, // brakes
  { "node": 1007, "message": magnetos_location,     "yes": 8, "how": 2007 }, // magneto
  { "node": 1008, "message": oil_pressure_location, "yes": 9, "how": 2008 }, // oil pressue

  // ENGINE START - How do I do that? Questions
  { "node": 2001, "message": fuel_valve_howto,    "yes": 2, "no": 1001 }, // fuel valve
  { "node": 2002, "message": mixture_howto,       "yes": 3, "no": 1002 }, // mixture
  { "node": 2003, "message": carb_heat_off_howto, "yes": 4, "no": 1003 }, // carb heat
  { "node": 2004, "message": throttle_howto,      "yes": 5, "no": 1004 }, // throttle
  { "node": 2005, "message": fuel_primer_howto,   "yes": 6, "no": 1005 }, // prime
  { "node": 2006, "message": brakes_howto,        "yes": 7, "no": 1006 }, // brakes
  { "node": 2007, "message": magnetos_howto,      "yes": 8, "no": 1007 }, // magneto
  { "node": 2008, "message": oil_pressure_howto_10psi,  "yes": 9, "no": 1008 }, // oil pressue


  // TAXI & RUN-UP - Happy Path
  { "node": 9,  "message": "Ensure stick and rudder, are free and correct",  "yes": 10, "no": 1009, "how": 2009 }, // controls
  { "node": 10, "message": "Calibrate the Altimeter",                        "yes": 11, "no": 1010, "how": 2010 }, // Altimeter
  { "node": 11, "message": "Set Elevator Trim for takeoff",                  "yes": 12, "no": 1011, "how": 2011 }, // trim
  { "node": 12, "message": "Set Brakes on",                                  "yes": 13, "no": 1012, "how": 2006 }, // brakes
  { "node": 13, "message": "Throttle up to 1500 RPM",                        "yes": 14, "no": 1013, "how": 2013 }, // throttle to 1500rpm
  { "node": 14, "message": "Switch Magneto to Right, then Left, then Both. \
  Watch for 75rpm drop",                                                     "yes": 15, "no": 1014, "how": 2014 }, // magnetos
  { "node": 15, "message": "Turn Carb Heat On, check for rpm drop, then put \
  it back",                                                                  "yes": 16, "no": 1015, "how": 2015 }, // carb heat
  { "node": 16, "message": "Check Oil Pressure for 30 to 45 PSI",            "yes": 17, "no": 1016, "how": 2016 }, // oil pressure
  { "node": 17, "message": "Throttle back to 1000 RPM",                      "yes": 18, "no": 1017, "how": 2017 }, // throttle to 1000 rpm
  { "node": 18, "message": "Check radio operation",                          "yes": 19, "no": 1018, "how": 2018 }, // radio

  // TAXI & RUN-UP - Where's that? Questions
  { "node": 1009, "message": stick_and_rudder_location, "yes": 10, "how": 2009 }, // controls
  { "node": 1010, "message": altimiter_location,     "yes": 11, "how": 2010 }, // Altimeter
  { "node": 1011, "message": elevator_trim_location, "yes": 12, "how": 2011 }, // trim
  { "node": 1012, "message": brakes_location,        "yes": 13, "how": 2012 }, // brakes
  { "node": 1013, "message": throttle_location,      "yes": 14, "how": 2013 }, // throttle
  { "node": 1014, "message": magnetos_location,      "yes": 15, "how": 2014 }, // magnetos
  { "node": 1015, "message": carb_heat_location,     "yes": 16, "how": 2015 }, // carb heat
  { "node": 1016, "message": oil_pressure_location,  "yes": 17, "how": 2016 }, // oil pressue
  { "node": 1017, "message": throttle_location,      "yes": 18, "how": 2017 }, // throttle
  { "node": 1018, "message": radio_location,         "yes": 19, "how": 2018 }, // tbd

  // TAXI & RUN-UP - How do I do that? Questions
  { "node": 2009, "message": stick_and_rudder_howto,   "yes": 10, "no": 1009 }, // controls
  { "node": 2010, "message": altimiter_howto,          "yes": 11, "no": 1010 }, // Altimeter
  { "node": 2011, "message": elevator_trim_howto,      "yes": 12, "no": 1011 }, // trim
  { "node": 2012, "message": brakes_howto,             "yes": 13, "no": 1012 }, // brakes
  { "node": 2013, "message": throttle_howto,           "yes": 14, "no": 1013 }, // throttle
  { "node": 2014, "message": magnetos_toggle_howto,    "yes": 15, "no": 1014 }, // magnetos
  { "node": 2015, "message": carb_heat_on_howto,       "yes": 16, "no": 1015 }, // carb heat
  { "node": 2016, "message": oil_pressure_howto_30psi, "yes": 17, "no": 1016 }, // oil pressue
  { "node": 2017, "message": throttle_howto,           "yes": 18, "no": 1017 }, // throttle
  { "node": 2018, "message": radio_howto,              "yes": 19, "no": 1018 }, // tbd

// TAKEOFF & CLIMB - Happy Path
//  { "node": 19, "message": "**TBD** next step",    "yes": 20, "no": 1020, "how": 2020 }, // tbd
//  { "node": 99, "message": "**TBD** next step",  "yes": 9999, "no": 1021, "how": 2021 }, // tbd


  // TAKEOFF & CLIMB - Where's that? Questions
//  { "node": 1019, "message": "where is it",        "yes": 20, "how": 2019 }, // tbd
//  { "node": 1099, "message": "where is it",      "yes": 9999, "how": 2021 }, // tbd

  // TAKEOFF & CLIMB - How do I do that? Questions
//  { "node": 2019, "message": "how do it",         "yes": 20, "no": 1019 }, // tbd
//  { "node": 2099, "message": "how do itt",      "yes": 9999, "no": 9999 }, // tbd

  // Checklist complete
//  { "node": 9999, "message": "Happy Flying", "yes": 0, "no": 0 },

  { "node": 19, "message": "Happy Flying!", "yes": 0, "no": 0 },

];

// this is used for keep track of visted nodes when we test for loops in the tree
var visited;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Welcome aboard your Piper Cub.  Ready to fly?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say yes to start the checklist or no to quit.";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say yes to continue, or no to end the checklist.";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "Say got it,  wheres that, how to answer the question.";

// This is the response to the user after the final question when Alex decides on what group choice the user should be given
var decisionMessage = "It's";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "Say 'how do I do that' to hear a short description for this profession, or do you want to play again?";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will guide you through the engine start checklsit. Want to start now?";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Ok, see you next time!";

var speechNotFoundMessage = "Could not find speech for node";

var nodeNotFoundMessage = "In nodes array could not find node";

var descriptionNotFoundMessage = "Could not find description for node";

var loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

var utteranceTellMeMore = "tell me more";

var utterancePlayAgain = "play again";

// the first node that we will use
var START_NODE = 1;

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', promptToStartMessage, promptToStartMessage);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];
        var loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
            // comment out this line if you know that there are no loops in your decision tree
    //         this.emit(':tell', loopsDetectedMessage);
        }
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.emit(':ask', message, message);
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
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.yesOrNo(this,'yes');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
    },
    'HowIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'how');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
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
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        this.handler.state = states.ASKMODE;
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.handler.state = states.ASKMODE;
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
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
    'DescriptionIntent': function () {
        //var reply = this.event.request.intent.slots.Description.value;
        //console.log('HEARD: ' + reply);
        helper.giveDescription(this);
    },
    'HowIntent': function () {
        this.handler.state = states.ASKMODE;
    },

    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// --------------- Helper Functions  -----------------------

var helper = {

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        var description = helper.getDescriptionForNode(context.attributes.currentNode);
        var message = description + ', ' + repeatWelcomeMessage;

        context.emit(':ask', message, message);
    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        var nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = decisionMessage + ' ' + message + ' ,' + playAgainMessage;
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.emit(':ask', message, message);
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    getHowToForNode: function (nodeId) {
        // about the same as yesOrNo, but it's How instead of No
        // set the current node to next node we want to go to
        // this is a question node so we need to see if the user picked yes or no
        var nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = helper.getSpeechForNode(nextNodeId);
        context.attributes.currentNode = nextNodeId;

        context.emit(':ask', message, message);
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {
      return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }
                if (yesNo == "how") {
                    return nodes[i].how;
                }
                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        var yesNode = helper.getNextNode(nodeId, "yes");
        var duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        var noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};
