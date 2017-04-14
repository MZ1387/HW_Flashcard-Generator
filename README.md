# HW_Flashcard-Generator

In this week's assignment, I created the backend for a basic flashcard application.

The backend will essentially constitute an API that allows users to create two types of flashcards.

1. **Basic** flashcards, which have a front (_"Who was the first president of the United States?"_), and a back (_"George Washington"_).

2. **Cloze-Deleted** flashcards, which present _partial_ text (_"... was the first president of the United States."_), and the full text when the user requests it (_"George Washington was the first president of the United States."_)


## Requirements

* Create a `BasicCard` constructor. It should accept `front` and `back` arguments.

* Create a `ClozeCard` constructor. It should accept `text` and `cloze` arguments.

  * `ClozeCard` should have a property or method that contains or returns _only_ the cloze-deleted portion of the text.

  * `ClozeCard` should have a property or method that contains or returns _only_ the partial text.

  * `ClozeCard` should have a property or method that contains or returns _only_ the full text.

  * `ClozeCard` should throw or log an error when the cloze deletion does _not_ appear in the input text.

  * Use prototypes to attach these methods, wherever possible.


## What Each Command Should Do

1. `node cards.js basic`

   * This will ask you questions from previously created basic cards.

2. `node cards.js basic [amount of cards]`

      * This will allow you to create a new set of basic cards and then run the newly created cards.

3. `node cards.js cloze`

   * This will ask you questions from previously created cloze cards.

4. `node cards.js cloze [amount of cards]`

   * This will allow you to create a new set of cloze cards and then run the newly created cards.


## Concepts Implemented

- Working with Node packages
- Reading and writing data set by a user to new files
- Making API request from JSON files created with the application


## Code Explanation

- A user is given the option to create new flash cards or read previously created flash cards.
- If a user selects to create new flash cards they will be prompted to set the data for each.
- If user selects to read previously created cards they will be prompted to answer each card's question. 
