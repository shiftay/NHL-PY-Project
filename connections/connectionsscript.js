document.addEventListener('DOMContentLoaded', () => {
    const wordGrid = document.querySelector('.word-grid');
    const wordGridHolder = document.querySelector('.word-grid-holder');
    const submitButton = document.getElementById('submit-group');
    const shuffleButton = document.getElementById('shuffle');
    const completedGrid = document.querySelector('.completed-grid')
    const popup = document.getElementById('popuptext');
    const popover = document.getElementById('popover');
    const popoverContent = document.getElementById('popover-content');
    const hint = document.querySelector('.hint');
    const close = document.getElementById('close');

    const buttonarea = document.getElementById('button-area');
    const attempts = document.getElementById('attempts');


    const customization_cookie = [ 'dark-mode', 'team' ]
    const stats_cookie = 'connection-stats'; // Win Loss Streak


    // Gameplay constants for cookie, need to be read on 
    const game_cookie = 'connection-current';
    const cookie_vals = [ 'attempts', 'completed-groups' ]

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

    // DARK MODE SETTINGS
    const whiteAlpha = 'rgba(255, 255, 255, 0.5)';
    const blackAlpha = 'rgba(53, 53, 53, 0.5)';

    const white = 'rgb(244, 244, 244)';
    const black = 'rgb(17, 17, 17)';

    const cnctn_dark = 'rgb(0, 123, 255)';
    const cnctn_dark_brdr ='rgb(0, 86, 179)';
    const cnctn_dark_font = 'rgb(255,255,255)';
    const cnctn_light = 'rgb(224, 242, 247)';
    const cnctn_light_brdr = 'rgb(179, 229, 252)';
    const cnctn_light_font = 'rgb(0, 59, 122)';

    const darkmodeAlpha = [ '.container', '#dark-mode', '#team-holder',  ]; 
    const darkmodeReg = [ 'body', '.hint', '#popover' ];
    const fonts = [ '.hint', '#popover' ];
    const borders = [  '.dot', '#popover' ];
    const invertElements = [ '.slider::before', '#back' ];

    var sliderStyle = '.slider::before';


    var stats = [];



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

        popover.showPopover();
        // var children = wordGrid.children;
        // // Create a fragment to hold the children.
        // var frag = document.createDocumentFragment();

        // // Grab a random child and add to the fragment
        // while(children.length) {
        //     frag.appendChild(children[Math.floor(Math.random() * children.length)]);
        // }

        // wordGrid.appendChild(frag);
    });

    close.addEventListener('click', () => {
        popover.hidePopover();
    });


    function cleanUpElements(groupId) {
        var frag = document.createDocumentFragment();
        selectedWords.forEach(word => {
            const wordElement = Array.from(wordGridHolder.children).find(el => el.textContent === word);
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

    function ShowGroup(groupId, midgame = true) {
        document.getElementById("word-grid-holder").style.marginBottom = "0px";

        var value;
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

        const wordElement = document.createElement('div');
        wordElement.classList.add('word-completed', `${value}`);
        if(midgame)
            wordElement.classList.add('animate', 'blur');

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

                    setCookie(game_cookie, 0, true);
                    setArrayCookie('completed-groups', groupId);

                    var cookieTest = getCookie('completed-groups');
                    console.log(`${cookieTest} + + ${cookieTest.length}`);

                    break;
                }

                
            }

            if (!foundMatch) {
                strikes++;
                // Wait for the Box animation on the words to finish.
                if(strikes < 4) {
                    strikeGiven(strikes);
                }
                setCookie(game_cookie, 0, true);
                setArrayCookie('attempts', strikes);
            }

            // Reset selected words visually
            submitButton.disabled = true;

            if (strikes >= 4 && correctGroupsFound < 4) {
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

                    ShowBoard(i);
                    selectedWords = [];
                }

                Lose();
                // ShowPopover(500);

                submitButton.disabled = true;
                
            }

            if (correctGroupsFound === 4) {
                Win();
            }
        }
    });

    function strikeGiven(strike, start = false, highestAmount = 0) {
        const collection = document.getElementsByClassName("dot");

        if(start) {
            collection[strike].classList.add('filled');
        } else {
            setTimeout(function() {
                popup.textContent = (highestAmount == 3) ? `One away...` : `Incorrect!`;
                popup.classList.toggle('show');
                collection[strike - 1].classList.add('animate', 'fill');
                // Let the pop up sit for a bit.
                setTimeout(function() {
                    popup.classList.toggle('show');
                    collection[strike - 1].classList.add('filled');
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

    // === SLIDER + TEAM SWAP ====
    fetch('assets/colorCodes.json') 
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
        console.log("extractColor");
        data.teams.forEach(n => {
            colorCodes.push(n);
        });
    }

    fetch('assets/20242025_teamlist.json') 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(jsonData => {
        // Now you can work with the jsonData object
        extractTeams(jsonData);
        main();
    })
    .catch(error => {
        console.error('Error fetching or parsing JSON:', error);
    });

    // Read in all data for Team SVGs
    function extractTeams(data) {
        data.teams.forEach(n => {
            teamSVG.push(n);
        });
    }

    function main() {
        var cookies = readCustomization();
        if(!cookies[1])
            updateTeam("WPG", false);

        var init = true;

        if(getCookie(game_cookie) == 0) {
            var completed_groups = getCookie(cookie_vals[1]);
            if(completed_groups) {
                var arr = completed_groups.split(",");
                if(arr.length === 4) {
                    for(var i = 0; i < arr.length; i++) {
                        ShowGroup(arr[i], false);
                    }
                    init = false; // We've already won the puzzle
                } else {
                    for(var i = 0; i < arr.length; i++) {
                        wordsData = wordsData.filter(word => !correctConnections[arr[i]].includes(word));
                        ShowGroup(arr[i], false);
                    }
                }
            }
    
            var attempt = getCookie(cookie_vals[0]);
            if(attempt)
            {
                var high = findHighestNumber(attempt);
                for(var i = 0; i < high; i++) strikeGiven(i, true);
                strikes = attempt;
            }
        }
        
        if(init) {
            // Render the initial word grid
            wordsData.sort(() => Math.random() - 0.5); // Shuffle words
            wordsData.forEach(word => {
                wordGrid.appendChild(createWord(word));
            });
        } else {
            // we won the puzzle so hide buttons & attempts
            hideBottomSection();
        }

    }

    function hideBottomSection() {
        buttonarea.hidden = attempts.hidden = true;
    }    

    function readCustomization() {
        var returnVals = [false, false];
        // customization_cookie
        var currentCookie = getCookie('dark-mode');
        if(currentCookie) {
            console.log(`cookie: ${currentCookie}`);

            var isTrueSet = (currentCookie === 'true');
            document.getElementById('checkbox').checked = darkmode = isTrueSet;
            updateDarkMode(isTrueSet);
            returnVals[0] = true;
        }
        
        currentCookie = getCookie('team');
        if(currentCookie) {
            updateTeam(currentCookie, false);
            returnVals[1] = true;
        }   
        
        // stats_cookie
        currentCookie = getCookie(stats_cookie);
        if(currentCookie) {
            stats = currentCookie;
        }


        return returnVals;
    }

    

    slider.addEventListener("change", function() {
        darkmode = !darkmode;
        updateDarkMode(darkmode);
        setCustomizationCookie('dark-mode', darkmode);
    });

    function updateDarkMode(darkmodetoggle) {
        var css = Array.from(stylesheet.cssRules);

        console.log(`toggle: ${darkmodetoggle}`);

        if(darkmodetoggle) {

            console.log(`inside if`);
            darkmodeAlpha.forEach(n => {
                css.find(x => x.selectorText === n).style.backgroundColor = blackAlpha;
            });
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = black);


            css.find(n=> n.selectorText === ".word").style.backgroundColor = cnctn_dark;
            css.find(n=> n.selectorText === ".word").style.color = cnctn_dark_font;
            css.find(n=> n.selectorText === ".word").style.borderColor = cnctn_dark_brdr;


            
            css.find(n=> n.selectorText === ".word.selected").style.backgroundColor = cnctn_light;
            css.find(n=> n.selectorText === ".word.selected").style.color = cnctn_light_font;
            css.find(n=> n.selectorText === ".word.selected").style.borderColor = cnctn_light_brdr;

            invertElements.forEach(n => {
                css.find(x => x.selectorText === n).style.filter = 'invert(100%)';
            })
                // css.find(n => n.selectorText === sliderStyle).style.filter = 'invert(100%)';
            
            // Opposite for fonts, selections, and borders
            fonts.forEach(n => css.find(x => x.selectorText === n).style.color = white);
            borders.forEach(n => css.find(x => x.selectorText === n).style.borderColor = white);

        } else {

            darkmodeAlpha.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = whiteAlpha);
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = white);




            css.find(n=> n.selectorText === ".word").style.backgroundColor = cnctn_light;
            css.find(n=> n.selectorText === ".word").style.color = cnctn_light_font;
            css.find(n=> n.selectorText === ".word").style.borderColor = cnctn_light_brdr;

            css.find(n=> n.selectorText === ".word.selected").style.backgroundColor = cnctn_dark;
            css.find(n=> n.selectorText === ".word.selected").style.color = cnctn_dark_font;
            css.find(n=> n.selectorText === ".word.selected").style.borderColor = cnctn_dark_brdr;

            invertElements.forEach(n => {
                css.find(x => x.selectorText === n).style.filter = 'invert(0%)';
            })
            css.find(n => n.selectorText === sliderStyle).style.filter = 'invert(0%)';

            // Opposite for fonts & selections
            fonts.forEach(n => css.find(x => x.selectorText === n).style.color = black);
            borders.forEach(n => css.find(x => x.selectorText === n).style.borderColor = black);
        }
    }

    function updateTeam(teamAbbrev, normal = true) { // team
        var logo = document.getElementById('logo');
        if(!logo) {
            logo = document.createElement('img');
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
                updateTeam(this.getElementsByTagName("input")[0].value)

                setCustomizationCookie('team', this.getElementsByTagName("input")[0].value);

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


    const back = document.getElementById("back");

    back.addEventListener('click', () => {
        window.location.href = "../";
    });


    const winningToasts = ['Do you believe in miracles!?', 'CAN YOU! BELIEVE! WHAT WE! JUST SAW?!', 'Off the floor, On the board!']

    function Win() {
        console.log("WINNNN");


        if(stats.length === 3) {
            stats[0]++;
            if(stats[2] > 0)
                stats[2]++;
        } else {
            stats = [1, 0, 1]; // Initialize Stats
        }
        
        console.log(stats);

        h2 = document.createElement('h2');
        h2.textContent = winningToasts[Math.floor(Math.random() * winningToasts.length)];

        p = document.createElement('p');
        p.innerHTML = `<strong>W</strong> ${stats[0]} | <strong>L</strong> ${stats[1]}
                        <hr>
                        <strong>Streak: ${stats[2]}`;
        popoverContent.appendChild(h2);
        popoverContent.append(p);

        setArrayCookie(stats_cookie, stats);
        hideBottomSection();



        setTimeout(function() {
            popover.showPopover();
        }, 2500);
    }

    function Lose() {

    }



/* ======================================================================= */
/* =====                            COOKIES                          ===== */
/* ======================================================================= */
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');

        console.log(`attempt to get cookie "${name}" - ${ca}`);
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function setArrayCookie(name, value, days) {
        let expires = "";

        let val = [];
        val.push(value);

        var exists = getCookie(name);
        if(exists)
            val.push(exists);

        // console.log(`attempt to set cookie "${name}"`);
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + val + expires + "; path=/";

        // console.log(`cookie - ${document.cookie}`);
    }

    function setCookie(name, value, days) {
        let expires = "";

        console.log(`attempt to set cookie "${name}"`);
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";

        console.log(`cookie - ${document.cookie}`);
    }

    function setCustomizationCookie(name, val, days, temp) {
        let expires = "";

        console.log(`attempt to set cookie "${name}"`);
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + val + expires + "; path=***/***";

        console.log(`cookie - ${document.cookie}`);
    }

    function deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }



    // HELPER FUNCTION
    function findHighestNumber(arr) {
        if (!arr || arr.length === 0) {
          return undefined; // Handle empty or invalid array
        }
        let highest = arr[0];
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] > highest) {
            highest = arr[i];
          }
        }
        return highest;
    }



});