document.addEventListener('DOMContentLoaded', () => {
    const wordGrid = document.querySelector('.word-grid');
    const wordGridHolder = document.querySelector('.word-grid-holder');
    const submitButton = document.getElementById('submit-group');
    const shuffleButton = document.getElementById('shuffle');
    const completedGrid = document.querySelector('.completed-grid')
    const popup = document.getElementById('popuptext');
    const popover = document.getElementById('popover');
    const hint = document.querySelector('.hint');

    const stylesheet = document.styleSheets[0];
    const logoSpace = document.getElementById("logoSpace");
    const slider = document.getElementById("slider");
    const teamholder = document.getElementById("team-holder");
    const body = document.getElementById('body');

    // Connections Info Containers
    wordsData = []; 
    correctConnections = [];
    connectionNames = [];
    var colorCodes = [];
    var teamSVG = [];
    var darkmode = false;


    // Command to run a temp HTTP Server
    // py -m http.server 8000
    fetch('answerKey.json') // ../data/
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

                submitButton.disabled = true;
            }

            if (correctGroupsFound === 4) {
                ShowPopover(2500);
            }
        }
    });




    // === SLIDER + TEAM SWAP ====
    fetch('colorCodes.json') 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(jsonData => {
        // Now you can work with the jsonData object
        extractColor(jsonData);
    })
    .catch(error => {
        console.error('Error fetching or parsing JSON:', error);
    });

    function extractColor(data) {
        data.teams.forEach(n => {
            colorCodes.push(n);
        });
    }

    fetch('20242025_teamlist.json') 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(jsonData => {
        // Now you can work with the jsonData object
        extractTeams(jsonData);
    })
    .catch(error => {
        console.error('Error fetching or parsing JSON:', error);
    });
    // Read in all data for Team SVGs
    function extractTeams(data) {
        data.teams.forEach(n => {
            teamSVG.push(n);
        });
        updateRandomTeam("TOR", false); // "TOR"
    }

    slider.addEventListener("change", function() {
        var css = Array.from(stylesheet.cssRules);

        darkmode = !darkmode;

        if(darkmode) {
            css.find(n => n.selectorText === "body").style.backgroundColor = "#111111";
        } else {
            css.find(n => n.selectorText === "body").style.backgroundColor = "#f4f4f4";
        }
    });

    function updateRandomTeam(teamAbbrev, normal = true) { // team
        var logo = document.getElementById('logo');
        if(!logo) {
            logo = document.createElement('img');
            console.log(`${body}`);
            body.insertBefore(logo, body.children[0]);
        }

        var smallLogo = document.getElementById('small-logo');
        if(smallLogo)
            smallLogo.remove();

        var css = Array.from(stylesheet.cssRules);

        var random = Array.from(colorCodes).find(n => n.teamAbbrev === teamAbbrev);

        css.find(n => n.selectorText === ".mainSVG").style.fill = random.colors[0];
        css.find(n => n.selectorText === ".secondarySVG").style.fill = random.colors[1];

        switch(random.colors.length) {
            case 3:
                
                css.find(n => n.selectorText === ".mainSVG").style.stroke = random.colors[2];
                // list.find(n => n.selectorText === ".mainSVG").style = 5;
                break;
            case 4:
                css.find(n => n.selectorText === ".mainSVG").style.stroke = random.colors[2];
                css.find(n => n.selectorText === ".secondarySVG").style.stroke = random.colors[3];
                break;
            default:
                break;
        }
        // div = document.createElement('div');
        // img = document.createElement('img');
        smallimg = document.createElement('img');

        logo.id = 'logo';
        logo.src = Array.from(teamSVG).find(n => n.teamAbbrev === random.teamAbbrev).teamLogo;
        smallimg.src = Array.from(teamSVG).find(n => n.teamAbbrev === random.teamAbbrev).teamLogo;
        smallimg.id = 'small-logo';
        smallimg.addEventListener("click", function(e) {
            updateLook(logoSpace);
        });
        // div.appendChild(img);
        
        logoSpace.appendChild(smallimg)

        if(normal){
            resetClassList("slowblur");
            // closeAllLists();
            setBlur(false);

            // TODO: Clean up taking to long to parse
            //       Track down other setTimeouts
            //       clear additional timeouts.
            setTimeout(function() {
                resetClassList("slowbluroff");
            }, 2000);
        }


    }

    function resetClassList(blureffect) {
        logo.classList.remove('animate', `${blureffect}`);
        Array.from(document.getElementsByClassName("bgpieces")).forEach(n => n.classList.remove('animate', `${blureffect}`));
    }

    function setBlur(blur) {
        if(blur) {
            logo.classList.add('animate', 'slowblur');
            Array.from(document.getElementsByClassName("bgpieces")).forEach(n => n.classList.add('animate', 'slowblur'));
        } else {
            logo.classList.add('animate', 'slowbluroff');
            Array.from(document.getElementsByClassName("bgpieces")).forEach(n => n.classList.add('animate', 'slowbluroff'));
        }
    }
    
    function updateLook(inp) {
        var teamchoice = document.getElementById('team-choice');
        if(teamchoice)
            return;
        var a, b, i, val = this.value;

        a = document.createElement("DIV");
        a.setAttribute("class", "team-choice");
        a.id = 'team-choice';
        teamholder.appendChild(a);
        setBlur(true);
        for (i = 0; i < teamSVG.length; i++) {
            b = document.createElement("DIV");

            b.classList.add('logoHolder')
            b.innerHTML += "<input type='hidden' value='" + teamSVG[i].teamAbbrev + "'>";
            b.innerHTML += `<img id="clickable-logo" src=${teamSVG[i].teamLogo}>`;
            b.addEventListener("click", function(e) {
                
                // console.log(this.getElementsByTagName("input")[0].value);
                updateRandomTeam(this.getElementsByTagName("input")[0].value)

                closeAllLists();
            });

            a.appendChild(b);
        }

        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("team-choice");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
            if(elmnt) resetClassList("slowblur");
        }
        document.addEventListener("click", function (e) {
            switch(e.target.id) {
                case "small-logo":
                case "clickable-logo":
                    return;
                default:
                    closeAllLists(e.target);
            }
        });
    }

});