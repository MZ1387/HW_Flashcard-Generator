var fs = require("fs");
var inquirer = require("inquirer");

var runThis = process.argv[2];
var cardCount;
var count = 0;
var cards = [];
var score = 0;


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
    console.log("If you want to review your study cards enter the following:");
    console.log("Basic: node cards.js basic");
    console.log("Cloze: node cards.js cloze");
    console.log("--------------------------------------------");
    console.log("If you want to create your study cards enter the following:");
    console.log("Basic: node cards.js basic [amount of cards]");
    console.log("Cloze: node cards.js cloze [amount of cards]");
    console.log("--------------------------------------------");
}

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

function writeCards(writeThis) {
    fs.writeFile(writeThis, '{ "cards":' + JSON.stringify(cards) + '}', function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

// BasicCard constructor function
function BasicCard(question, answer) {
    this.question = question.toLowerCase();
    this.answer = answer.toLowerCase();
}

// ClozeCard constructor function
function ClozeCard(question, answer) {
    this.question = question.toLowerCase();
    this.answer = answer.toLowerCase();

    if (this.question.indexOf(this.answer) != -1) {
        this.cloze = this.question.replace(answer, "...");
    } else {
        console.log("--------------------------------------------");
        console.log("Cloze deletion was not input correctly. \nYou must include a phrase found in the question.");
        console.log("--------------------------------------------");
        this.cloze = "Cloze deletion was not input correctly. \nCreate a new card for this question. Press ENTER.";
    }

}

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

            var newCard = new ClozeCard(answers.question, answers.answer);
            console.log("--------------------------------------------");
            cards.push(newCard);
            count++;
            clozeCard();
        });

    } else {
        count = 0;
        writeCards("cloze.json")
        studyCloze();
    }
};

function studyCloze() {

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
            } else if (result.userResponse === "") {
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
    }

}


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


function studyBasic() {

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
    }

}
