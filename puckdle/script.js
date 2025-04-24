document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const guessGrid = document.querySelector('.guess-grid');
    const attemptsDisplay = document.getElementById('attempts');
    const gameStatus = document.getElementById('game-status');
    const popover = document.getElementById('popover');
    const body = document.getElementById('body');
    const stylesheet = document.styleSheets[0];
    const logoSpace = document.getElementById("logoSpace");
    const slider = document.getElementById("slider");
    const teamholder = document.getElementById("team-holder");

    const stats_cookie = 'scouting-report-stats';
    const game_cookie = 'scouting-report-current';

    const cookie_vals = [ 'attempts', 'guesses' ]

    // DARK MODE SETTINGS
    const whiteAlpha = 'rgba(255, 255, 255, 0.5)';
    const blackAlpha = 'rgba(53, 53, 53, 0.5)';

    const white = 'rgb(244, 244, 244)';
    const black = 'rgb(17, 17, 17)';

    const darkmodeAlpha = [  '.container', '#dark-mode', '#team-holder' ]; 
    const darkmodeReg = [ '.autocomplete-items div', '.autocomplete-items', 'input', 'body'];
    const fonts = [ 'input', '.autocomplete-items div', '#attempts'];
    const borders = [ '.guess-row', '.guess-row.header-row', '#attempts'];
    const invertElements = [ '.slider::before', '#back' ];

    let targetPlayer;
    let attempts = 0;
    let up = '\u2191';
    let down = '\u2193';
    const maxAttempts = 7;
    var playerNames = [];
    var playerInfo = [];
    var teamSVG = [];
    var answerKey;
    var answerId;
    var targetsBirthDate;
    var colorCodes = [];
    var bgelements = [];

    var darkmode = false;

//#region READING JSON
    // Command to run a temp HTTP Server
    // py -m http.server 8000
    function processJson(data) {
        var tempInfo;
        if(data.hasOwnProperty('players')) 
            tempInfo = data.players;

        tempInfo.forEach(n => {
            playerInfo.push(n);
        });

        playerInfo.forEach(n => {
            var names = n.name.split(" ");
            playerNames.push(names);
        });

        targetPlayer = getRandomPlayer();
        targetsBirthDate = targetPlayer['birthDate'].split("-");
    }

    function extractColor(data) {
        data.teams.forEach(n => {
            colorCodes.push(n);
        });
    }

    // Read in all data for Team SVGs
    function extractTeams(data) {
        data.teams.forEach(n => {
            teamSVG.push(n);
        });
     
    }

    async function getCachedJSON(url, cacheKey, expiryInSeconds = 3600) {
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_timestamp`);

        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < (expiryInSeconds * 1000)) {
            
            return JSON.parse(cachedData);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify(jsonData));
            localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
            return jsonData;
        } catch (error) {
            console.error('Error fetching and caching JSON:', error);
            return null;
        }
    }

    async function getSessionCachedJSON(url, cacheKey) {
        const cachedData = sessionStorage.getItem(cacheKey);
        const cachedTime = sessionStorage.getItem(`${cacheKey}_timestamp`);

        if (cachedData && cachedTime) {
            return JSON.parse(cachedData);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            sessionStorage.setItem(cacheKey, JSON.stringify(jsonData));
            sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now());
            return jsonData;
        } catch (error) {
            console.error('Error fetching and caching JSON:', error);
            return null;
        }
    }
    getCachedJSON('../assets/colorCodes.json', 'colorCache')
    .then(data => {
        if (data) {
            extractColor(data);
        }
    });

    getCachedJSON('../assets/20242025_teamlist.json', 'teamCache')
    .then(data => {
        if (data) {
            extractTeams(data);
        }
    });

    getSessionCachedJSON('20242025_players.json', 'playerCache')
    .then(data => {
        if (data) {
            processJson(data);
            main();
        }
    });
//#endregion READING JSON

//#region INITIALIZATION
    function main() {
        var cookies = readcookies();
        if(!cookies[1])
            updateTeam("WPG", false);

        if(getCookie(game_cookie)) {
 
        }
    }

    function readcookies() {
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
//#endregion

//#region CUSTOMIZATION
    slider.addEventListener("change", function() {
        darkmode = !darkmode;
        updateDarkMode(darkmode);
        setCustomizationCookie('dark-mode', darkmode);
    });


    function updateDarkMode(darkmodeToggle) {
        var css = Array.from(stylesheet.cssRules);
        if(darkmodeToggle) {
            darkmodeAlpha.forEach(n => {
                css.find(x => x.selectorText === n).style.backgroundColor = blackAlpha;
            });
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = black);
            borders.forEach(n => {
                if(n === '.guess-row.header-row') {
                    css.find(x => x.selectorText === n).style.backgroundColor = black;
                } else {
                    
                    css.find(x => x.selectorText === n).style.backgroundColor = `rgb(${lightenRgbPercentage(black, 20)})`;
                    console.log(`${n} | ${css.find(x => x.selectorText === n).style.backgroundColor}`);
                }    
            });

            invertElements.forEach(n => {
                css.find(x => x.selectorText === n).style.filter = 'invert(100%)';
            })
            // Opposite for fonts, selections, and borders
            fonts.forEach(n => css.find(x => x.selectorText === n).style.color = white);
            borders.forEach(n => css.find(x => x.selectorText === n).style.color = white)
            borders.forEach(n => css.find(x => x.selectorText === n).style.borderColor = white);
            // Lighten selections.
            css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor = `rgb(${lightenRgbPercentage(black, 10)})`;
            // console.log(`${ css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor}`);
        } else {

            darkmodeAlpha.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = whiteAlpha);
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = white);
            borders.forEach(n => {
                if(n === '.guess-row.header-row') {
                    css.find(x => x.selectorText === n).style.backgroundColor = white;
                } else {
                    
                    css.find(x => x.selectorText === n).style.backgroundColor = `rgb(${lightenRgbPercentage(white, -150)})`;
                    console.log(`${n} | ${css.find(x => x.selectorText === n).style.backgroundColor}`);
                }    
            });
            invertElements.forEach(n => {
                css.find(x => x.selectorText === n).style.filter = 'invert(0%)';
            })
            // Opposite for fonts & selections
            fonts.forEach(n => css.find(x => x.selectorText === n).style.color = black);
            borders.forEach(n => css.find(x => x.selectorText === n).style.color = black);
            borders.forEach(n => css.find(x => x.selectorText === n).style.borderColor = black);
            css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor = `rgb(${lightenRgbPercentage(white, -90)})`;
            // console.log(`${ css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor}`);
        }
    }

    function lightenRgbPercentage(rgb, percentage) {
        const [r, g, b] = rgb;
        const values = rgb.substring(4, rgb.length - 1).split(',');
        const newR = Math.min(255, Math.round(parseInt(values[0]) + (255 - parseInt(values[0])) * (percentage / 100)));
        const newG = Math.min(255, Math.round(parseInt(values[1]) + (255 - parseInt(values[1])) * (percentage / 100)));
        const newB = Math.min(255, Math.round(parseInt(values[2]) + (255 - parseInt(values[2])) * (percentage / 100)));
        return [newR, newG, newB];
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
            }, 1000);
        }


    }

    function resetClassList(blureffect) {
        logo.classList.remove('animate', `${blureffect}`);
        Array.from(document.getElementsByClassName("bgpieces")).forEach(n => n.classList.remove('animate', `${blureffect}`));
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
                var team = this.getElementsByTagName("input")[0].value;
                // console.log(this.getElementsByTagName("input")[0].value);
                updateTeam(team);
                setCustomizationCookie('team', team);
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

    function setBlur(blur) {
        if(blur) {
            logo.classList.add('animate', 'slowblur');
            Array.from(document.getElementsByClassName("bgpieces")).forEach(n => n.classList.add('animate', 'slowblur'));
        } else {
            logo.classList.add('animate', 'slowbluroff');
            Array.from(document.getElementsByClassName("bgpieces")).forEach(n => n.classList.add('animate', 'slowbluroff'));
        }
    }
//#endregion CUSTOMIZATION

//#region GAMEPLAY
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

    function getRandomPlayer() {
        return playerInfo[Math.floor(Math.random() * playerInfo.length)];
    }

    function playerExists(guess) {
        const guessedPlayer = playerInfo.find(player => player['name'].toLowerCase() === guess.toLowerCase());
        if(!guessedPlayer) {
            gameStatus.textContent = "Invalid guess. Player not found.";
            return false;
        }

        return true;
    }

    function  checkGuess() {
        const guess = guessInput.value.trim();
        if (!guess) return;


        if(!playerExists(guess)) return;

        const guessedPlayer = playerInfo.find(player => player['name'].toLowerCase() === guess.toLowerCase());

        gameStatus.textContent = "";

        attempts++;
        if(attempts == 1) {
            document.getElementsByClassName('guess-grid')[0].removeAttribute("hidden");
            document.getElementById('attempts').removeAttribute("hidden");
        }
        attemptsDisplay.textContent = `Attempts: ${attempts} / ${maxAttempts}`;

        const guessRow = document.createElement('div');
        guessRow.classList.add('guess-row', 'animate', 'blur');
                        //  str     str         int               str               int             str             str
        const attributes = ["name", "position", "sweaterNumber", "birthCountry", "heightInInches", "birthDate", "currentTeamAbbrev"];
        attributes.forEach(attr => {
            const cell = document.createElement('div');
            cell.classList.add('attribute' , `${attr}`);

            switch(attr) {
                case "heightInInches":
                    var feet = Math.floor(guessedPlayer[attr] / 12);
                    var inches = guessedPlayer[attr] % 12;
                    cell.textContent = `${feet}' ${inches}"`
                    break;
                case "birthDate":
                    var dateParts = guessedPlayer[attr].split("-");
                    cell.textContent = `${2025 - parseInt(dateParts[0])}`;
                    break;
                case "name":
                    // cell.classList.add('name');
                    cell.textContent = guessedPlayer[attr];
                    break;
                default:
                    cell.textContent = guessedPlayer[attr];
            }
            
            if(attr !== "name") {
                try {
                    if(attr === "birthDate") {
                        var diff = dateParts[0] - targetsBirthDate[0];
                        diff < 0 ? diff *= -1 : diff;
                        if (guessedPlayer[attr] === targetPlayer[attr]) {
                            cell.classList.add('match');
                        } else if (diff < 3) {
                            cell.classList.add('close');
                        } 

                        // Add arrow if they don't match.
                        if (guessedPlayer[attr] > targetPlayer[attr]) {
                            cell.textContent += " " + down;
                        } else if (guessedPlayer[attr] < targetPlayer[attr]) {
                            cell.textContent += " " + up;
                        }
                    } else {
                        if (guessedPlayer[attr].toLowerCase() === targetPlayer[attr].toLowerCase()) {
                            cell.classList.add('match');
                        }  
                    }
                } catch(error) {
                    var diff = guessedPlayer[attr] - targetPlayer[attr];
                    diff < 0 ? diff *= -1 : diff;

                    if (guessedPlayer[attr] === targetPlayer[attr]) {
                        cell.classList.add('match');
                    } else if (diff < 3) {
                        cell.classList.add('close');
                    } 

                    // Add arrow if they don't match.
                    if (guessedPlayer[attr] > targetPlayer[attr]) {
                        cell.textContent += " " + down;
                    } else if (guessedPlayer[attr] < targetPlayer[attr]) {
                        cell.textContent += " " + up;
                    }
                }
            }

            guessRow.appendChild(cell);
        });

        guessGrid.appendChild(guessRow);
        guessInput.value = "";

        if (guessedPlayer.name.toLowerCase() === targetPlayer.name.toLowerCase()) {
            gameStatus.textContent = `You guessed it in ${attempts} attempts! It was ${targetPlayer.name}.`;
            guessInput.disabled = true;
            guessButton.disabled = true;
            ShowPopover(500);
        } else if (attempts >= maxAttempts) {

            gameStatus.textContent = `You ran out of attempts! The player was ${targetPlayer.name}.`;
            guessInput.disabled = true;
            guessButton.disabled = true;
            ShowPopover(500);
        }
    }

    guessButton.addEventListener('click', checkGuess);
//#endregion

//#region COOKIES
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

    function setCookie(name, value, days) {
        let expires = "";

        let val = [];
        val.push(value);

        var exists = getCookie(name);
        if(exists)
            val.push(exists);

        console.log(`attempt to set cookie "${name}"`);
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + val + expires + "; path=***/***";

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
        document.cookie = name + "=" + val + expires + "; path=/";

        console.log(`cookie - ${document.cookie}`);
    }

    function deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }


    const back = document.getElementById("back");

    back.addEventListener('click', () => {
        window.location.href = "../";
    });
//#endregion COOKIES

//#region AUTO COMPLETE
    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);

            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                var combinedName = arr[i][0] + " " + arr[i][1];
                // First Name
                if (arr[i][0].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i][0].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i][0].substr(val.length) + " " + arr[i][1];
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + combinedName + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                } else if (arr[i][1].substr(0, val.length).toUpperCase() == val.toUpperCase()) { // Last Name
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = arr[i][0];
                    b.innerHTML += " <strong>" + arr[i][1].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i][1].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + combinedName + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                } else if(combinedName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML += " <strong>" + combinedName.substr(0, val.length) + "</strong>";
                    b.innerHTML += combinedName.substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + combinedName + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }

            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              
              e.preventDefault();
              const guess = guessInput.value.trim();
              
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();

              } else if(playerExists(guess)) {
                checkGuess();
              } 
              currentFocus = -1;
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
      }

      autocomplete(document.getElementById("guess-input"), playerNames);
//#endregion Auto Complete Section
});