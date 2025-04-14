document.addEventListener('DOMContentLoaded', () => {
    const wordGrid = document.querySelector('.word-grid');
    const wordGridHolder = document.querySelector('.word-grid-holder');
    const submitButton = document.getElementById('submit-group');
    const shuffleButton = document.getElementById('shuffle');
    const completedGrid = document.querySelector('.completed-grid')
    const popup = document.getElementById('popuptext');
    const popover = document.getElementById('popover');
    const hint = document.querySelector('.hint');


    // Connections Info Containers
    wordsData = []; 
    correctConnections = [];
    connectionNames = [];
    
    // Command to run a temp HTTP Server
    // py -m http.server 8000
    fetch('data/answerKey.json') 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(jsonData => {
        // Now you can work with the jsonData object
        processJson(jsonData);
    })
    .catch(error => {
        console.error('Error fetching or parsing JSON:', error);
    });

    function processJson(data) {
        var tempInfo;
        if(data.hasOwnProperty('answers')) 
            tempInfo = data.answers;

        tempInfo.forEach(n => {
            correctConnections.push(n["value"]);
            connectionNames.push(n["key"]);
        });

        correctConnections.forEach(n => {
            n.forEach(x => {
                wordsData.push(x);
            });
        });

        if(data.hasOwnProperty('hint'))
            hint.textContent = `Today's hint: ${data.hint}`;

        // Render the initial word grid
        wordsData.sort(() => Math.random() - 0.5); // Shuffle words
        wordsData.forEach(word => {
            wordGrid.appendChild(createWord(word));
        });
    }

    let selectedWords = [];
    let strikes = 0;
    let correctGroupsFound = 0;
    let currentGroupId = 0;

    // Function to create word elements
    function createWord(wordText) {
        const wordElement = document.createElement('div');
        wordElement.classList.add('word');
        wordElement.textContent = wordText;
        wordElement.addEventListener('click', () => handleWordClick(wordElement, wordText));
        return wordElement;
    }



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


    function cleanUpElements(groupId) {
        var frag = document.createDocumentFragment();
        selectedWords.forEach(word => {
            const wordElement = Array.from(wordGridHolder.children).find(el => el.textContent === word);
            console.log(`${wordElement}`);
            frag.appendChild(wordElement);
        });
        ShowGroup(groupId);
        selectedWords = [];
    }

    function ShowBoard(groupId) {
        var frag = document.createDocumentFragment();
        selectedWords.forEach(word => {
            const wordElement = Array.from(wordGrid.children).find(el => el.textContent === word);
            frag.appendChild(wordElement);
        });
        ShowGroup(groupId);
    }

    function ShowGroup(groupId) {
        document.getElementById("word-grid-holder").style.marginBottom = "0px";

        var value;
        console.log(groupId);
        switch(groupId.toString()) {
            case "0":
                value = "one";
                break;
            case "1":
                value = "two";
                break;
            case "2":
                value = "three";
                break;
            case "3":
                value = "four";
                break;
            default:
                console.log("It broked");
        }

        console.log(value);

        const wordElement = document.createElement('div');
        wordElement.classList.add('word-completed', 'animate', 'blur', `${value}`);

        const header = document.createElement('h3');
        header.classList.add('answerkey');
        header.textContent = `${connectionNames[groupId]}`;

        const div = document.createElement('div');
        div.classList.add('answerval');
        div.textContent = `${correctConnections[groupId]}`;

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
            cleanUpElements(currentGroupId);
        }, 500);
    }

    function ShowPopover(time) {
        // create popover content
        const holder = document.createElement('div');

        const header = document.createElement('h2');
        header.textContent = `Congratulations!`;

        const hr = document.createElement('hr');

        const div = document.createElement('div');
        div.textContent = `Test Text / GIF LINK AREA`;

        holder.appendChild(header);
        holder.appendChild(hr);
        holder.appendChild(div);

        popover.insertBefore(holder, popover.children[1]);

        // Open popover on delay
        setTimeout(function() {
            popover.showPopover();
        }, time);
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
                    currentGroupId = groupId;

                    setTimeout(function() {
                        AppendtoStart();
                    }, 1000);

                    submitButton.disabled = true;
                    break;
                }
            }

            if (!foundMatch) {
                strikes++;
                // Wait for the Box animation on the words to finish.
                if(strikes < 3) {
                    const collection = document.getElementsByClassName("dot");
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
            }

            // Reset selected words visually
            submitButton.disabled = true;

            if (strikes >= 3 && correctGroupsFound < 4) {
                console.log('We lost???');
                // Optionally reveal the correct answers
                // ShowPopover(1000);
    
                const completedWords = document.querySelectorAll('.word-completed');

                var completed = [];

                completedWords.forEach(completedWord => {
                    for(var i = 0; i < completedWord.children.length; i++) {
                        if(completedWord.children[i].classList.contains('answerkey'))
                            completed.push(completedWord.children[i].textContent);
                    }
                });

                selectedWords = [];

                for(var i = 0; i < connectionNames.length; i++) {
                    if(completed.includes(connectionNames[i]))
                        continue;

                    for(var j = 0; j < correctConnections[i].length; j++) {
                        selectedWords.push(correctConnections[i][j]);
                    }

                    console.log(`Selected Words: ${selectedWords}`);

                    
                    ShowBoard(i);
                    selectedWords = [];
                }

                ShowPopover(500);


                // for (const groupId in correctConnections) {
                //     correctConnections[groupId].forEach(word => {
                //         const wordElement = Array.from(wordGrid.children).find(el => el.textContent === word);
                //         if (wordElement && !wordElement.classList.contains('correct')) {
                //             wordElement.classList.add('revealed'); // Add a CSS class for revealed words
                //         }
                //     });
                // }
                submitButton.disabled = true;
            }

            if (correctGroupsFound === 4) {
                ShowPopover(2500);
            }


        }
    });


});