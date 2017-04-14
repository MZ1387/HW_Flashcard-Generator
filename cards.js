// required packages
var fs = require("fs");
var inquirer = require("inquirer");
// variables used to hold data and count
var runThis = process.argv[2];
var cardCount;
var count = 0;
var cards = [];
var score = 0;

//switch statement used to run the desired function set by user
switch (runThis) {
    case "basic":
        if (process.argv[3]) {
            cardCount = process.argv[3];
            basicCard();
        } else {
            readCards("basic.json");
        }
        break;
    case "cloze":
        if (process.argv[3]) {
            cardCount = process.argv[3];
            clozeCard();
        } else {
            readCards("cloze.json");
        }
        break;
    default:
        intro();
}

// function shows user how to use application
function intro() {
    console.log("--------------------------------------------");
    console.log("If you want to review cards enter the following:");
    console.log("Basic: node cards.js basic");
    console.log("Cloze: node cards.js cloze");
    console.log("--------------------------------------------");
    console.log("If you want to create cards enter the following:");
    console.log("Basic: node cards.js basic [amount of cards]");
    console.log("Cloze: node cards.js cloze [amount of cards]");
    console.log("--------------------------------------------");
}

// function reads cards from the respective .JSON file and pushes data to cards array and runs the study function
function readCards(readThis) {
    fs.readFile(readThis, "utf8", function(error, data) {
        var cardsObj = JSON.parse(data);
        for (var i = 0; i < cardsObj.cards.length; i++) {
            cards.push(cardsObj.cards[i])
        }
        cardCount = cards.length;
        switch (runThis) {
            case "basic":
                studyBasic();
                break;
            case "cloze":
                studyCloze();
        }
    });
}

// function writes data to a .JSON file once user has finished creating all cards
function writeCards(writeThis) {
    fs.writeFile(writeThis, '{ "cards":' + JSON.stringify(cards) + '}', function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

// runs inquirer confirm to repeat or end card review
function repeatCards() {
    inquirer.prompt([{
        type: "confirm",
        name: "repeat",
        message: "Would you like to review your cards again?",
    }]).then(function(result) {
        if (result.repeat) {
            // reset variables and review cards again
            count = 0;
            score = 0;
            switch (runThis) {
                case "basic":
                    studyBasic();
                    break;
                case "cloze":
                    studyCloze();
            }
        } else {
            console.log("--------------------------------------------");
            console.log("See you soon.");
            console.log("--------------------------------------------");
        }
    });
}

// ClozeCard constructor function
function ClozeCard(question, answer) {
    this.question = question.toLowerCase();
    this.answer = answer.toLowerCase();
    this.cloze = this.question.replace(answer, "...");
}

// function creates new cloze cards with inquirer.prompt using recurssion
function clozeCard() {

    if (count === 0) {
        console.log("--------------------------------------------");
        console.log("Let's create some cards!");
        console.log("--------------------------------------------");
    }

    if (count < cardCount) {
        inquirer.prompt([{
            name: "question",
            message: "Question: "
        }, {
            name: "answer",
            message: "Omit: "
        }]).then(function(answers) {
            // create a new card instance which is pushed to cards array is cloze is proper
            if (answers.question.indexOf(answers.answer) != -1) {
                var newCard = new ClozeCard(answers.question, answers.answer);
                cards.push(newCard);
                console.log("--------------------------------------------");
                count++;
                clozeCard();
            } else {
                console.log("--------------------------------------------");
                console.log("Cloze deletion was not input correctly. \nYou must include a phrase found in the question.");
                console.log("--------------------------------------------");
                count++;
                clozeCard();
            }
        });
    } else {
        count = 0;
        writeCards("cloze.json")
        studyCloze();
    }
};

// function reads back cards set in cloze.JSON
function studyCloze() {
    // if cards have been input correctly then we can study cards
    if (count === 0 && cards.length != 0) {
        console.log("--------------------------------------------");
        console.log("Let's review!");
        console.log("--------------------------------------------");
        // set in case the cloze was not input correctly. This avoids 'index out of range'
        cardCount = cards.length
    } else if (count === 0 && cards.length === 0) {
        console.log("--------------------------------------------");
        console.log("Cloze cards were not created properly. \nCreate some new cards to study.");
        console.log("--------------------------------------------");
    }

    if (count < cardCount) {
        inquirer.prompt([{
            type: "input",
            name: "userResponse",
            message: cards[count].cloze,
        }]).then(function(result) {
            if (result.userResponse.toLowerCase() === cards[count].answer) {
                score++;
                console.log("--------------------------------------------");
                console.log("Correct! " + "'" + cards[count].question + "'");
                console.log("--------------------------------------------");
            } else {
                console.log("--------------------------------------------");
                console.log("Sorry. The correct answer is \n" + "'" + cards[count].question + "'");
                console.log("--------------------------------------------");
            }
            count++;
            studyCloze();
        });
    } else {
        console.log("--------------------------------------------");
        console.log("No cards left! \nYou got " + score + " out of " + cardCount + " correct.");
        console.log("--------------------------------------------");
        repeatCards();
    }
}

// BasicCard constructor function
function BasicCard(question, answer) {
    this.question = question.toLowerCase();
    this.answer = answer.toLowerCase();
}

// function creates new basic cards with inquirer.prompt using recurssion
function basicCard() {

    if (count === 0) {
        console.log("--------------------------------------------");
        console.log("Let's create some cards!");
        console.log("--------------------------------------------");
    }

    if (count < cardCount) {
        inquirer.prompt([{
            name: "question",
            message: "Question: "
        }, {
            name: "answer",
            message: "Answer: "
        }]).then(function(answers) {
            // create a new card instance which is pushed to cards array
            var newCard = new BasicCard(answers.question, answers.answer);
            console.log("--------------------------------------------");
            cards.push(newCard);
            count++;
            basicCard();
        });
    } else {
        count = 0;
        writeCards("basic.json")
        studyBasic();
    }
};

// function reads back cards set in basic.JSON
function studyBasic() {

    if (count === 0) {
        console.log("--------------------------------------------");
        console.log("Let's review!");
        console.log("--------------------------------------------");
    }

    if (count < cardCount) {
        inquirer.prompt([{
            type: "input",
            name: "userResponse",
            message: cards[count].question,
        }]).then(function(result) {
            if (result.userResponse.toLowerCase() === cards[count].answer) {
                score++;
                console.log("--------------------------------------------");
                console.log("Correct!");
                console.log("--------------------------------------------");
            } else {
                console.log("--------------------------------------------");
                console.log("Sorry. The correct answer is " + "'" + cards[count].answer + "'");
                console.log("--------------------------------------------");
            }
            count++;
            studyBasic();
        });
    } else {
        console.log("--------------------------------------------");
        console.log("No cards left! \nYou got " + score + " out of " + cardCount + " correct.");
        console.log("--------------------------------------------");
        repeatCards();
    }
}
