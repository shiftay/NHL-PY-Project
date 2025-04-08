document.addEventListener('DOMContentLoaded', () => {
    const wordGrid = document.querySelector('.word-grid');
    const selectedWordsContainer = document.querySelector('.selected-words');
    const submitButton = document.getElementById('submit-group');
    const shuffleButton = document.getElementById('shuffle');
    const attemptsDisplay = document.getElementById('attempts');
    const gameStatus = document.getElementById('game-status');
    const completedGrid = document.querySelector('.completed-grid')
    const groupNameElements = {
        1: document.getElementById('group-1-name'),
        2: document.getElementById('group-2-name'),
        3: document.getElementById('group-3-name'),
        4: document.getElementById('group-4-name')
    };

    const wordsData = ["BLUE", "GREEN", "YELLOW", "RED", "NAVY", "TEAL", "LIME", "PURPLE", "SCARLET", "OLIVE", "CYAN", "MAGENTA", "FUCHSIA", "AQUA", "VIOLET", "MAROON"]; // Replace with your actual words
    const correctConnections = {
        1: ["BLUE", "NAVY", "TEAL", "CYAN"],      // Shades of Blue
        2: ["GREEN", "LIME", "OLIVE", "AQUA"],    // Shades of Green
        3: ["YELLOW", "SCARLET", "MAGENTA", "FUCHSIA"], // Shades of Red/Pink
        4: ["RED", "PURPLE", "VIOLET", "MAROON"]    // Other Colors
    };

    let selectedWords = [];
    let attempts = 0;
    let correctGroupsFound = 0;

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



    submitButton.addEventListener('click', () => {
        if (selectedWords.length === 4) {
            attempts++;
            attemptsDisplay.textContent = `${attempts} of 4 Attempts`;
            let foundMatch = false;

            for (const groupId in correctConnections) {
                const connection = correctConnections[groupId].sort();
                const selected = selectedWords.sort();
                if (connection.join(',') === selected.join(',')) {
                    var children = wordGrid.children;
                    foundMatch = true;
                    correctGroupsFound++;
                    gameStatus.textContent = `Correct! Group ${groupId} found.`;
                    var frag = document.createDocumentFragment();


                    // Visually mark the correct group

                    selectedWords.forEach(word => {
                        const wordElement = Array.from(wordGrid.children).find(el => el.textContent === word);
                        frag.appendChild(wordElement);
                        if (wordElement) {
                            wordElement.classList.add('correct'); // Add a CSS class for correct words
                            wordElement.onclick = null; // Disable further clicks
                        }
                    });

                    const wordElement = document.createElement('div');
                    wordElement.classList.add('word-completed');
                    wordElement.textContent = `Group ${groupId} found.`;
                    completedGrid.appendChild(wordElement);
                    // wordElement.addEventListener('click', () => handleWordClick(wordElement, wordText));
                    // groupNameElements[groupId].textContent = Object.keys(correctConnections).find(key => correctConnections[key].sort().join(',') === connection.join(','));
                    selectedWords = [];
                    selectedWordsContainer.innerHTML = '';
                    submitButton.disabled = true;
                    break;
                }
            }

            if (!foundMatch) {
                gameStatus.textContent = "Not a match. Try again.";
            }

            // Reset selected words visually
            const selectedElements = document.querySelectorAll('.word.selected');
            selectedElements.forEach(el => el.classList.remove('selected'));
            selectedWords = [];
            submitButton.disabled = true;

            if (attempts >= 4 && correctGroupsFound < 4) {
                gameStatus.textContent = "Game Over!";
                // Optionally reveal the correct answers
                for (const groupId in correctConnections) {
                    // groupNameElements[groupId].textContent = Object.keys(correctConnections).find(key => correctConnections[key].sort().join(',') === correctConnections[groupId].sort().join(','));
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
                gameStatus.textContent = "You solved all the connections!";
                submitButton.disabled = true;
            }
        }
    });
});