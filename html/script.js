document.addEventListener('DOMContentLoaded', () => {
    const wordGrid = document.querySelector('.word-grid');
    const wordGridHolder = document.querySelector('.word-grid-holder');
    const submitButton = document.getElementById('submit-group');
    const shuffleButton = document.getElementById('shuffle');
    const attemptsDisplay = document.getElementById('attempts');
    const gameStatus = document.getElementById('game-status');
    const completedGrid = document.querySelector('.completed-grid')
    const popup = document.getElementById('popuptext');
    const popover = document.getElementById('popover');

    const wordsData = ["1", "1", "1", "1", "2", "2", "2", "2", "3", "3", "3", "3", "4", "4", "4", "4"]; // Replace with your actual words
    const correctConnections = {
        1: ["1", "1", "1", "1"],      // Shades of Blue
        2: ["2", "2", "2", "2"],    // Shades of Green
        3: ["3", "3", "3", "3"],    // Shades of Red/Pink
        4: ["4", "4", "4", "4"]    // Other Colors
    };

    let selectedWords = [];
    let strikes = 0;
    let correctGroupsFound = 0;
    let curentGroupId = 0;

    // Function to create word elements
    function createWord(wordText) {
        const wordElement = document.createElement('div');
        wordElement.classList.add('word');
        wordElement.textContent = wordText;
        wordElement.addEventListener('click', () => handleWordClick(wordElement, wordText));
        return wordElement;
    }

    // Render the initial word grid
    wordsData.sort(() => Math.random() - 0.5); // Shuffle words
    wordsData.forEach(word => {
        wordGrid.appendChild(createWord(word));
    });

    function handleWordClick(wordElement, wordText) {
        if (wordElement.classList.contains('selected')) {
            wordElement.classList.remove('selected');
            selectedWords = selectedWords.filter(w => w !== wordText);
        } else if (selectedWords.length < 4) {
            wordElement.classList.add('selected');
            selectedWords.push(wordText);
        }

        submitButton.disabled = selectedWords.length !== 4;
    }

    shuffleButton.addEventListener('click', () => {
        var children = wordGrid.children;
        // Create a fragment to hold the children.
        var frag = document.createDocumentFragment();

        // Grab a random child and add to the fragment
        while(children.length) {
            frag.appendChild(children[Math.floor(Math.random() * children.length)]);
        }

        wordGrid.appendChild(frag);
    });


    function cleanUpElements() {
        var frag = document.createDocumentFragment();
        selectedWords.forEach(word => {
            const wordElement = Array.from(wordGridHolder.children).find(el => el.textContent === word);
            frag.appendChild(wordElement);
        });
        ShowGroup();
        selectedWords = [];
    }

    function ShowGroup() {
        document.getElementById("word-grid-holder").style.marginBottom = "0px";

        const wordElement = document.createElement('div');
        wordElement.classList.add('word-completed', 'animate', 'blur');

        const header = document.createElement('h3');
        header.textContent = `${curentGroupId}`;

        const div = document.createElement('div');
        div.textContent = `${correctConnections[curentGroupId]}`;

        wordElement.appendChild(header);
        wordElement.appendChild(div);
        completedGrid.appendChild(wordElement);
    }

    function AppendtoStart() {
        document.getElementById("word-grid-holder").style.marginBottom = "10px";
        selectedWords.forEach(word => {
            const wordElement = Array.from(wordGrid.children).find(el => el.textContent === word);
            wordGridHolder.insertBefore(wordElement, wordGridHolder.firstChild);
        });

        setTimeout(function() {
            cleanUpElements();
        }, 500);
    }

    submitButton.addEventListener('click', () => {
        if (selectedWords.length === 4) {
            let foundMatch = false;

            selectedWords.forEach(word => {
                const wordElement = Array.from(wordGrid.children).find(el => el.textContent === word);
                wordElement.classList.add('animate', 'test');
                // wordElement.classList.add();
            });

            var amountCorrect = 0;
            var highestAmount = 0;


            for (const groupId in correctConnections) {
                const connection = correctConnections[groupId].sort();
                const selected = selectedWords.sort();
                amountCorrect = 0;
                connection.forEach(n => {
                    if(selected.includes(n)) {
                        amountCorrect++;
                    }
                });

                if(amountCorrect > highestAmount)
                    highestAmount = amountCorrect;

                if (amountCorrect == 4) {
                    var children = wordGrid.children;
                    foundMatch = true;
                    correctGroupsFound++;
                    curentGroupId = groupId;

                    setTimeout(function() {
                        AppendtoStart();
                    }, 1000);

                    submitButton.disabled = true;
                    break;
                }
            }

            if (!foundMatch) {
                const collection = document.getElementsByClassName("dot");
                strikes++;
                // Wait for the Box animation on the words to finish.
                setTimeout(function() {
                    popup.textContent = (highestAmount == 3) ? `One away...` : `Incorrect!`;
                    popup.classList.toggle('show');
                    collection[strikes - 1].classList.add('animate', 'fill');
                    // Let the pop up sit for a bit.
                    setTimeout(function() {
                        popup.classList.toggle('show');
                        collection[strikes - 1].classList.add('filled');
                        // Clean up the Selected elements.
                        setTimeout(function() {
                            const selectedElements = document.querySelectorAll('.word.selected');
                            selectedElements.forEach(el => {
                                el.classList.remove('selected', 'animate', 'test');
                            });
                            selectedWords = []; 
                        }, 250);
                    }, 1000);
                }, 1000);

            }

            // Reset selected words visually
            submitButton.disabled = true;

            if (strikes == 3 && correctGroupsFound < 4) {
                gameStatus.textContent = "Game Over!";
                // Optionally reveal the correct answers
                for (const groupId in correctConnections) {
                    correctConnections[groupId].forEach(word => {
                        const wordElement = Array.from(wordGrid.children).find(el => el.textContent === word);
                        if (wordElement && !wordElement.classList.contains('correct')) {
                            wordElement.classList.add('revealed'); // Add a CSS class for revealed words
                        }
                    });
                }
                submitButton.disabled = true;
            }

            if (correctGroupsFound === 4) {
                setTimeout(function() {
                    popover.showPopover();
                }, 2500);
            }


        }
    });
});