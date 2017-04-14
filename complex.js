var fs = require("fs");
var inquirer = require("inquirer");

var runThis = process.argv[2];
var cardCount = 0;
var locked = false;
var count = 0;
var cards = [];
var score = 0;


switch (runThis) {
    case "basic":
        if (cardCount) {
          cardCount = parseInt(process.argv[3]);
            basicCard();
        } else {
            locked = true;
            readCards("basic.json");
            studyBasic();
        }
        break;
    case "cloze":
        if (cardCount) {
            clozeCard();
        } else {
            locked = true;
            readCards("cloze.json");
            studyCloze();
        }
        break;
    default:
        intro();
}

// function shows user how to use application
function intro() {
    console.log("--------------------------------------------");
    console.log("If you want to study cards enter the following:");
    console.log("Basic: node cards.js basic");
    console.log("Cloze: node cards.js cloze");
    console.log("--------------------------------------------");
    console.log("If you want to create cards enter the following:");
    console.log("Basic: node cards.js basic [amount of cards]");
    console.log("Cloze: node cards.js cloze [amount of cards]");
    console.log("--------------------------------------------");
}

function readCards(readThis) {
    fs.readFile(readThis, "utf8", function(error, data) {
        var cardsObj = JSON.parse(data);
        cards = cardsObj.cards;
        console.log(cards);
    });
}

// BasicCard constructor function
function BasicCard(question, answer) {
    this.question = question;
    this.answer = answer;
}

// ClozeCard constructor function
function ClozeCard(question, answer) {
    this.question = question;
    this.answer = answer;

    this.cloze = this.question.replace(answer, "...");
}

function clozeCard() {

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
        fs.writeFile("cloze.json", "{" + cards + "}", function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("cloze.json was updated!");
        });
        studyCloze();
    }
};

function studyCloze() {

    if (locked) {
        cardCount = cards.length;
    }

    if (count < cardCount) {

        inquirer.prompt([{
            type: "input",
            name: "userResponse",
            message: cards[count].cloze,
        }]).then(function(result) {

            if (result.userResponse === cards[count].answer) {
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
        console.log("Study time is over! \nYou got " + score + " out of " + cardCount + " correct.");
        console.log("--------------------------------------------");
    }

}


function basicCard() {

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

            if (result.userResponse.toLowerCase() === cards[count].answer.toLowerCase()) {
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
        console.log("Study time is over! \nYou got " + score + " out of " + cardCount + " correct.");
        console.log("--------------------------------------------");
    }

}
