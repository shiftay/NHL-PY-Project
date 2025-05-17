import { initializeAWS, gameStartedSub, queueforGame, uuid, gameStartedSubject, updateGuess, actionSubject, actionSub, updatesSub, updateSubject } from '../dist/bundle.js';

document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const guessGrid = document.querySelector('.guess-grid');
    const attemptsDisplay = document.getElementById('attempts');
    const gameStatus = document.getElementById('game-status');
    const body = document.getElementById('body');
    const stylesheet = document.styleSheets[0];
    const logoSpace = document.getElementById("logoSpace");
    const slider = document.getElementById("slider");
    const teamholder = document.getElementById("team-holder");
    const queueButton = document.getElementById('queue');
    const connectionContent = document.getElementById('connection-content');

    const playerone_name = document.getElementById('player-one-name');
    const playerone_logo = document.getElementById('player-one-icon');
    const playerone_rank = document.getElementById('player-one-rank');

    const playertwo_name = document.getElementById('player-two-name');
    const playertwo_logo = document.getElementById('player-two-icon');
    const playertwo_rank = document.getElementById('player-two-rank');

    const pregameplay = document.getElementById('pre-gameplay');
    const queueArea = document.getElementById('queue-area');
    const gameplay = document.getElementById('gameplay');

    /**
     * DEBUG BUTTONS
     */
    const debugQueue = document.getElementById('debug-queue');
    const debugGame = document.getElementById('debug-game-start');
    const debugShow = document.getElementById('debug-game-show');


    const stats_cookie = 'scouting-report-stats';
    const game_cookie = 'scouting-report-current';

    const cookie_vals = [ 'attempts', 'guesses' ]

    const PLAYER_AMOUNT = 6813;

    // DARK MODE SETTINGS
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
// AWS
    let client;
    let playerID;
    let playerName = "DEFAULT_PLAYER";
    let onGameStarted_sub;
    let updates_sub;
    let gameID;
    

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


    async function fetchJsonFromS3(bucketUrl) {
        try {
          const response = await fetch(bucketUrl);
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const jsonData = await response.json();
          return jsonData;
        } catch (error) {
          console.error('Error fetching JSON from S3:', error);
          return null; // Or throw the error again, depending on your error handling strategy
        }
    }

    // ./playerInfo/fullListOfplayers.json
    async function loadGameData() {
        for(var i = 0; i < years.length; i++) {
            fetchJsonFromS3(years[i])
            .then(data => {
                processJson(data);
            })
            .then(() => {
                if(playerInfo.length === PLAYER_AMOUNT) {
                    playerInfo.forEach(n => {
                        var names = n.name.split(" ");
                        playerNames.push(names);
                    });

                    main();
                }
            });
        }

        // const gameConfig = await fetchJsonFromS3('./playerInfo/fullListOfplayers.json');
    }
      
    // loadGameData()
    // .then(data => {
    //     console.log(`IT attempted something?`);
    //     if(data) console.log("IF");
    //     else console.log("ELESE???E");
    // });
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

    getCachedJSON('../assets/colorCodes.json', 'colorCache')
    .then(data => {
        if (data) {
            extractColor(data);
        }
        
        getCachedJSON('../assets/20242025_teamlist.json', 'teamCache')
        .then(data => {
            if (data) {
                extractTeams(data);
            }
            loadGameData();
        });
    });




    const years = [
        './playerInfo/19751976_players.json',
        './playerInfo/19761977_players.json',
        './playerInfo/19771978_players.json',
        './playerInfo/19781979_players.json',
        './playerInfo/19791980_players.json',
        './playerInfo/19801981_players.json',
        './playerInfo/19811982_players.json',
        './playerInfo/19821983_players.json',
        './playerInfo/19831984_players.json',
        './playerInfo/19841985_players.json',
        './playerInfo/19851986_players.json',
        './playerInfo/19861987_players.json',
        './playerInfo/19871988_players.json',
        './playerInfo/19881989_players.json',
        './playerInfo/19891990_players.json',
        './playerInfo/19901991_players.json',
        './playerInfo/19911992_players.json',
        './playerInfo/19921993_players.json',
        './playerInfo/19931994_players.json',
        './playerInfo/19941995_players.json',
        './playerInfo/19951996_players.json',
        './playerInfo/19961997_players.json',
        './playerInfo/19971998_players.json',
        './playerInfo/19981999_players.json',
        './playerInfo/19992000_players.json',
        './playerInfo/20002001_players.json',
        './playerInfo/20012002_players.json',
        './playerInfo/20022003_players.json',
        './playerInfo/20032004_players.json',
        './playerInfo/20052006_players.json',
        './playerInfo/20062007_players.json',
        './playerInfo/20072008_players.json',
        './playerInfo/20082009_players.json',
        './playerInfo/20092010_players.json',
        './playerInfo/20102011_players.json',
        './playerInfo/20112012_players.json',
        './playerInfo/20122013_players.json',
        './playerInfo/20132014_players.json',
        './playerInfo/20142015_players.json',
        './playerInfo/20152016_players.json',
        './playerInfo/20162017_players.json',
        './playerInfo/20172018_players.json',
        './playerInfo/20182019_players.json',
        './playerInfo/20192020_players.json',
        './playerInfo/20202021_players.json',
        './playerInfo/20212022_players.json',
        './playerInfo/20222023_players.json',
        './playerInfo/20232024_players.json',
        './playerInfo/20242025_players.json'
      ];

//#endregion READING JSON

//#region INITIALIZATION

    function main() {
        initplayer();

        var cookies = readcookies();
        if(!cookies[1])
            updateTeam("WPG", false);

        if(getCookie(game_cookie)) {
 
        }

        queueButton.addEventListener('click', function() {
            onGameStarted_sub = gameStartedSub(client, playerID);
            queue();
            queueForGame();
        });

        startGame();
    }

    /**
     * Initializae the client, and subscribe to onGameStarted
     */
    function initplayer() {
        client = initializeAWS();
        playerID = uuid();

        console.log(`id - ${playerID}`);
    }

    debugQueue.addEventListener('click', function() {
        queueForGame();
    });

    function queueForGame() {
        pregameplay.classList.add('animate', 'fadeout');

        setTimeout(() => {
            Fade(queueArea, pregameplay, '#queue-area', '#pre-gameplay');
        }, 1000);
    }

    debugGame.addEventListener('click', function() {
        initGame();
    });

    function initGame() {
        queueArea.classList.add('animate', 'fadeout');

        setTimeout(() => {
            Fade(gameplay, queueArea, '#gameplay', '#queue-area');
            startTimer();
        }, 1000);
        
    }

    function Fade(fadeIn, fadeOut, fadeInName, fadeOutName) {
        fadeIn.classList.add('animate', 'fadein');
        // console.log(Array.from(stylesheet.cssRules));
        Array.from(stylesheet.cssRules).find(n => n.selectorText === fadeOutName).style.display = 'none';
        Array.from(stylesheet.cssRules).find(n => n.selectorText === fadeInName).style.display = 'flex';
        fadeOut.classList.remove('animate', 'fadeout');

        setTimeout(() => {
            fadeIn.classList.remove('animate', 'fadein')
        }, 1000);
    }

    debugShow.addEventListener('click', function() {
        Array.from(stylesheet.cssRules).find(n => n.selectorText === '#queue-area').style.display = 'none';
        Array.from(stylesheet.cssRules).find(n => n.selectorText === '#pre-gameplay').style.display = 'none';
        Array.from(stylesheet.cssRules).find(n => n.selectorText === '#gameplay').style.display = 'flex';
    });


    /**
     * Queue for a game.
     */
    function queue() {
        queueforGame(client, playerID, playerName, 1000, current_team ? current_team : "WPG");
    }

    var current_team;

    function readcookies() {
        var returnVals = [false, false];
        // customization_cookie
        var currentCookie = getCookie('dark-mode');
        if(currentCookie) {
            var isTrueSet = (currentCookie === 'true');
            document.getElementById('checkbox').checked = darkmode = isTrueSet;
            updateDarkMode(isTrueSet);
            returnVals[0] = true;
        }
        
        currentCookie = getCookie('team');
        if(currentCookie) {
            current_team = currentCookie;
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

    function updateTeam(teamAbbrev, normal = true) { // team
        var smallLogo = document.getElementById('small-logo');
        if(smallLogo)
            smallLogo.remove();

        current_team = teamAbbrev;

        var random = Array.from(colorCodes).find(n => n.teamAbbrev === teamAbbrev);

        // div = document.createElement('div');
        // img = document.createElement('img');
        smallLogo = document.createElement('img');

        smallLogo.src = Array.from(teamSVG).find(n => n.teamAbbrev === random.teamAbbrev).teamLogo;
        smallLogo.id = 'small-logo';
        smallLogo.addEventListener("click", function(e) {
            updateLook(logoSpace);
        });
        // div.appendChild(img);
        
        logoSpace.appendChild(smallLogo)
    }

    function updateLook(inp) {
        var teamchoice = document.getElementById('team-choice');
        if(teamchoice)
            return;

        var a, b, i;

        a = document.createElement("DIV");
        a.setAttribute("class", "team-choice");
        a.id = 'team-choice';
        teamholder.appendChild(a);
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
//#endregion CUSTOMIZATION

//#region GAMEPLAY


    function getRandomPlayer() {
        return playerInfo[Math.floor(Math.random() * playerInfo.length)];
    }

    function playerExists(guess) {
        const guessedPlayer = playerInfo.find(player => player['name'].toLowerCase() === guess.toLowerCase());
        if(!guessedPlayer) {
            // gameStatus.textContent = "Invalid guess. Player not found.";
            return false;
        }

        return true;
    }

    function  CreateActionElement() {
        const guess = guessInput.value.trim();
        const guessedPlayer = playerInfo.find(player => player['name'].toLowerCase() === guess.toLowerCase());

        gameStatus.textContent = "";


        const guessRow = document.createElement('div');
        guessRow.classList.add('guess-row');
                        //  str     str         int              Hidden Values
        const attributes = ["name", "position", "sweaterNumber", "birthCountry", "teams", "draftDetails"];
        attributes.forEach(attr => {
            const cell = document.createElement('div');
            cell.classList.add('attribute' , `${attr}`);
            cell.textContent = guessedPlayer[attr];
            guessRow.appendChild(cell);
        });

        guessGrid.appendChild(guessRow);
        guessInput.value = "";
    }





//#endregion

//#region GAME LOGIC
    var currentPlayer;
    var usedConnections = {};

    /**
     * Make sure clear the search bar
     * 
     * 
     * 
     */

    /* TODO
 
    when joining queue, have each player assign a 'starting lineup' player with them

    when game starts
        > whoever is player one plays off of their randomly assigned starting lineup
        > Players are subscribed to the GameStatusUpdated subscription

        > Based on turn, disable / enable the search bar
            > Hide submit button

    Gameplay stuff:
        When a person plays a player
            > Logic decides if it is a correct player
            > sends the action to the takeAction mutator
            > IF:
                > INCORRECT  flash the no connection found (pop up)
                > CORRECT    play the connection, and swap to other player

        // Might redefine take Action, to send Connections, for easier grabbing of information for player.
        takeAction(Action, bool)
            > Action : PlayerID, Player, GuessID
            > bool : was it correct
                > IF:
                    CORRECT : Change currentplayer
                    INCORRECT : no update

        Basic look of HTML:

        <div id=hockey-card></div>
        <div id=seperator></div>
        <div id=connector></div> [ Connector will show: TEAM / Country / Award ] [ Can have multiple Connectors ] [ Include Strikes amount ]
        <div id=seperator></div>
        <div id=hockey-card></div>


        On correct action:
            Add to List of [ Connectors ]

    Make sure to unsubscribe after losing / leaving site.

    */

    /**
     * Starting Game
     * Requires clearing and initializing all stats.
     */
    function startGame() {
        usedConnections = {};
        
        currentPlayer = playerInfo.find(n=> n['playerId'] == 8462044)
        createCard(currentPlayer);
        console.log(currentPlayer['playerId']);

        
    }


    function createCard(player) {
        var card = document.createElement('div');
        card.setAttribute('id', 'card');



        var image = document.createElement('img');
        image.src = `https://assets.nhle.com/mugs/actionshots/1296x729/${player['playerId']}.jpg`; //player['headshot'];
        image.setAttribute('id', 'headshot');
        image.draggable = false;

        /**
         * Create intial text content
         */
        var baseInfo = document.createElement('div');
        baseInfo.setAttribute('id', 'card-content');

        var name = document.createElement('span');
        name.setAttribute('id', 'card-content');
        name.classList.add('name')
        name.textContent = `${player['position']} | ${player['name']}`;



        // var number = document.createElement('span');
        // number.setAttribute('id', 'card-content');
        // number.classList.add('number')
        // number.textContent = `#${player['sweaterNumber']}`;
        returnStyle(player).forEach( n => {
            baseInfo.append(n);
        });
        // baseInfo.append(); //  position,


        /**
         * Create back of card content.
         */
        var hiddenContent = document.createElement('div');
        hiddenContent.setAttribute('id', 'card-hidden-content');

        hiddenContent.textContent = ` Draft Year: ${player['draftDetails']['year']} \n
                                Country: ${player['birthCountry']}`;
        hiddenContent.hidden = true;



        card.append(image, baseInfo, hiddenContent);
        connectionContent.insertBefore(card, connectionContent.children[0]);
        currentPlayer = player;
    }

    function returnStyle(player) {
        /**
         *  Pick a style at random. 
         */
        const styleNumber = getRandomInt(4); //getRandomInt(4);

        console.log(`Style: ${styleNumber}`);

        var border = document.createElement('img');
        border.src = `../assets/border_${styleNumber}.png`;
        border.setAttribute('id', 'card-content');
        border.classList.add('border')
        border.draggable = false;
        
        
        // name.setAttribute('id', 'card-content');
        // name.classList.add('name')
        var name = setName(styleNumber, player);
        var position = setPosition(styleNumber, player);

        if(position) {
            return [ border, name, position ];
        } else {
            return [ border, name ];
        }
    }

    function setName(styleNumber, player) {
        var name = document.createElement('span');
        
        switch(styleNumber) {
            case 0:
                name.style.bottom = '0px';
                name.style.width = '100%';
                name.style.textAlign = 'center';
                name.style.position = 'absolute';
                name.style.fontSize = 'medium';
                name.textContent = player['name'];
                // bottom 25, left 95, absolute  font-small
                break;
            case 1:
                name.style.bottom = '12px';
                name.style.left = '10px';
                name.style.position = 'absolute';
                name.style.fontSize = '0.75em';
                name.textContent = `${player['position']} | ${player['name']}`;
                break;
            case 2: // Left Diagonal
                name.style.bottom = '30px';
                name.style.left = '-75px';
                name.style.width = '100%';
                name.style.textAlign = 'center';
                name.style.position = 'absolute';
                name.style.fontSize = '0.75em';
                name.style.transform = `rotate(${30}deg)`;
                name.textContent = player['name'];
                break;
            case 3:
                name.style.top = '80%';
                name.style.left = '50%';
                name.style.position = 'absolute';
                name.style.fontSize = '0.75em';
                name.style.transform = 'translate(-50%, -50%)';
                name.style.width = 'fit-content';
                name.textContent = `${player['name']}`;
                break;
        }

        return name;
    }

    function setPosition(styleNumber, player) {
        var positionElement = document.createElement('span');

        switch(player['position']) {
            case "D":
                positionElement.textContent = `Defenseman | ${player['sweaterNumber']}`;
                break;
            case "L":
                positionElement.textContent = `Left Wing | ${player['sweaterNumber']}`;
                break;
            case "R":
                positionElement.textContent = `Right Wing | ${player['sweaterNumber']}`;
                break;
            case "C":
                positionElement.textContent = `Center | ${player['sweaterNumber']}`;
                break;
            case "G":
                positionElement.textContent = `Goalie | ${player['sweaterNumber']}`;
                break;
        }

        switch(styleNumber) {
            case 0:
                positionElement.style.bottom = '20px';
                positionElement.style.width = '100%';
                positionElement.style.textAlign = 'center';
                positionElement.style.position = 'absolute';
                positionElement.style.fontSize = '0.6em';
                break;
            case 1:
                return null;
            case 2:
                positionElement.style.bottom = '8px';
                positionElement.style.left = '7px';
                positionElement.style.position = 'absolute';
                positionElement.style.fontSize = '0.95em';
                positionElement.style.transform = `rotate(${30}deg)`;
                positionElement.textContent= `${player['position']} | ${player['sweaterNumber']}`;
                break;
            case 3:
                positionElement.style.top = '90%';
                positionElement.style.left = '50%';
                positionElement.style.position = 'absolute';
                positionElement.style.fontSize = '0.5em';
                positionElement.style.transform = 'translate(-50%, -50%)';
                positionElement.style.width = 'fit-content';
                break;
        }

        return positionElement;
    }

    function getRandomInt(max) {
    return Math.floor(Math.random() * max);
    }

    function createConnection(value) {
        var connection = document.createElement("div");
        connection.setAttribute("id", "connection");
        var connectionVal = document.createElement('div');
        var connectionStrikes = document.createElement('div');

        connectionVal.setAttribute("id", "connection-value");
        connectionStrikes.setAttribute("id", "connection-strikes");

        connectionVal.textContent = value;
        for(var i = 0; i < usedConnections[value]; i++) {
            connectionStrikes.textContent += 'X '; 
        }
        
        connection.appendChild(connectionVal);
        connection.appendChild(connectionStrikes);


        connectionContent.insertBefore(connection, connectionContent.children[0]);
        // a.setAttribute("class", "autocomplete-items");
    }


    function createLine(id) {
        var line = document.createElement("div");
        line.setAttribute("id", id);
        // body.insertBefore(logo, body.children[0]);
        connectionContent.insertBefore(line, connectionContent.children[0]);
    }

    /**
     * Logic for showing Connecton or Pop Up
     */
    function ConnectionValidation(connections, guessPlayer) {
        var validConnect = false;
        var amount = 0;
        for(var i = 0; i < connections.length; i++) {
            var value = connections[i].slice(2);

            if(usedConnections[value]) {
                if(usedConnections[value] < 5)  {
                    amount += 1;
                }   
            } else {
                amount += 1;
            }
        }
        
        /**
         * This needs testing to make sure this works.
         * Idea is that all connections need to be valid for it to be allowed to be a connection
         * Even a single failed connection is a fail.
         */
        validConnect = (connections.length == 0 ?  false : connections.length == amount);

        console.log(`${validConnect} | ${amount} | ${connections.length}`);

        if(validConnect) {
            
            

            createLine('line');

            var multiConnect = connections.length > 1;

            for(var i = 0; i < connections.length; i++) {

                // var type = connections[i].slice(0,2);
                var value = connections[i].slice(2);
                if(usedConnections[value]) {
                    usedConnections[value] += 1;
                } else {
                    usedConnections[value] = 1;
                }
                
                createConnection(value);

                if(i != connections.length-1) {
                    createLine('small-line');
                }
                // For when we want to add more of a delimiter or show off something specific for each one
                // ie. Flag for Country, Calendar for Draft Year, Little trophy for Award, etc...
                // switch(type) {
                //     case "t-":
                //         console.log(`Team ${value}`);
                        
                //         break;
                //     case "a-":
                //         console.log(`Award ${value}`);
                //         break;
                //     case "d-":
                //         console.log(`Draft Year ${value}`);
                //         break;
                //     case "b-":
                //         console.log(`Country ${value}`);
                //         break;
                // }
            }

            createLine('line');
            createCard(guessPlayer);
            
        } else {
            // NO connection
            
        }
        ResetTimer();
    }

    function giveReason(connections) {
        var reasons = [];

        for(var i = 0; i < connections.length; i++) {
            var value = connections[i].slice(2);

            if(usedConnections[value]) {
                if(usedConnections[value] >= 5)  {
                    reasons.push(value);
                }   
            }
        }

        return reasons;
    }


    function checkGuess() {
        const guess = guessInput.value.trim();
        guessInput.value = "";
        const guessedPlayer = playerInfo.find(player => player['name'].toLowerCase() === guess.toLowerCase());

        var connections = findConnection(guessedPlayer, currentPlayer);
        
        if(guessedPlayer == currentPlayer) {
            connections.length = 0;
        }

        if(connections.length > 0) {
            updateGuess(client, gameID, playerID, guessedPlayer['playerId']);
        } else {
            let reasons = giveReason(connections);
            if(reasons.length < 1) {
                gameStatus.textContent = "No Valid Connections Found";
            } else {
                var text = "";
                for(var i = 0; i < reasons.length; i++) {
                    text += `${reasons[i]} connections are used up.`

                    if(i < reasons.length-1) {
                        text += `\n`;
                    }
                }
                gameStatus.textContent = text;
            }
            
            setTimeout(function() {
                gameStatus.textContent = "";
            }, 2000);
        }

        

    }


    function findConnection(guess, current) {
        let connections = [];

        console.log("current:", current);
        console.log("guess:", guess);


        // Connections: Draft Year, Team, Country, Awards (not stanley cup)
        for(var i = 0; i < current['seasonsPlayed'].length; i++) { // team
            for(var x = 0; x < guess['seasonsPlayed'].length; x++) {
                if(current['seasonsPlayed'][i]['teamName'] == guess['seasonsPlayed'][x]['teamName']) {
                    if(connections.includes(`t-${guess['seasonsPlayed'][x]['teamName']}`)) {
                        continue;
                    }
                    connections.push(`t-${guess['seasonsPlayed'][x]['teamName']}`);
                }
            }
        }

        if(guess['draftDetails']['year'] == current['draftDetails']['year']) {// draft year
            connections.push(`d-${guess['draftDetails']['year']}`);
        }
                 

        if(current['awards'].length > 0 && guess['awards'].length > 0) {// compare awards
            for(var i = 0; i < current['awards'].length; i++) { // team
                if(current['awards'][i]['trophyName'] == 'Stanley Cup') continue;
                for(var x = 0; x < guess['awards'].length; x++) {
                    if(guess['awards'][x]['trophyName'] == 'Stanley Cup') continue;

                    if(guess['awards'][x]['trophyName'] == current['awards'][i]['trophyName']) {
                        connections.push(`a-${guess['awards'][x]['trophyName']}`);
                    }
                }
            }
        } 


        if(guess['birthCountry'] == current['birthCountry']){// country
            connections.push(`b-${guess['birthCountry']}`);
        } 

        return connections;
    }

    guessButton.addEventListener('click', checkGuess);

//#endregion


//#region COOKIES
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');

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

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + val + expires + "; path=***/***";

 
    }

    function setCustomizationCookie(name, val, days, temp) {
        let expires = "";

   
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + val + expires + "; path=/";

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
                    b.innerHTML += `<input type='hidden' value="${combinedName}">`;
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
                    b.innerHTML += `<input type='hidden' value="${combinedName}">`;
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
                    b.innerHTML += `<input type='hidden' value="${combinedName}">`;
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

//#region TIMER
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;

    const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
    };

    const TIME_LIMIT = 20;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    document.getElementById("timer-circle").innerHTML = `
        <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
            ></path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(
            timeLeft
        )}</span>
        </div>
    `;

    

    function onTimesUp() {
        clearInterval(timerInterval);

    }

    function ResetTimer() {
        onTimesUp();
        resetColor();
        timePassed = 0;
        timeLeft = TIME_LIMIT;
        startTimer();
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
            );
            setCircleDasharray();
            setRemainingPathColor(timeLeft);

            if (timeLeft === 0) {
                onTimesUp();
            }
        }, 1000);
    }

    function formatTime(time) {
        // const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        // if (seconds < 10) {
        //     seconds = `0${seconds}`;
        // }

        return `${seconds}`; //${minutes}:
    }

    function resetColor() {
        const { alert, warning, info } = COLOR_CODES;
        document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
        document
        .getElementById("base-timer-path-remaining")
        .classList.add(info.color);
    }

    function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
            document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
            document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }
//#endregion


//#region AWS
    let game;

    gameStartedSubject.subscribe((gameData) => {
        // This is your "other script" (in a different file)
        console.log('Received game data in game_logic.js:', gameData);
        const actualGameData = gameData.data.onGameStarted;

        if(!containsID(actualGameData.players)) {
            return;
        }
        // Assume our id is in the game, unsubscribe to the subscription, and move on to other subscriptions.
        gameID = actualGameData.id;

        // Unsubscribe to onGameStarted.
        onGameStarted_sub.unsubscribe();
        game = actualGameData;
        /**
         * Subscribe to other AWS Subscriptions
         */
        updates_sub = updatesSub(client, gameID); 
        /**
         * Layout of the information pulled in:
         *      actualGameData
         *          > currentPlayerID
         *          > gameStatus
         *          > guesses []
         *          > id (GAME ID)
         *          > players []
         */
        let index = -1;
        for(var i = 0; i < actualGameData.players.length; i++) {
            if(actualGameData.players[i].id !== playerID) {
                index = i;
                break;
            }
        }



        console.log("current_team", current_team);
        let logo = document.createElement('img');
        logo.src =  Array.from(teamSVG).find(n => n.teamAbbrev === current_team).teamLogo;
        playerone_name.textContent = "Guest-" + playerID.substring(0,4);
        playerone_logo.append(logo);
        playerone_rank.textContent = 1000;


        let logo_two = document.createElement('img');
        logo_two.src = Array.from(teamSVG).find(n => n.teamAbbrev === actualGameData.players[index].logo).teamLogo;
        playertwo_name.textContent = "Guest-" + actualGameData.players[index].id.substring(0,4);
        playertwo_logo.append(logo_two);
        playertwo_rank.textContent = actualGameData.players[index].rank;
        


        console.log(`result: ${actualGameData.currentPlayerID} | player: ${playerID}`);
        initGame();

        if(actualGameData.currentPlayerID !== playerID) {
            guessInput.disabled = true;
            guessButton.disabled = true;
        }

    });

    updateSubject.subscribe((gameData) => {
        // This is your "other script" (in a different file)
        console.log('Received game data in game_logic.js:', gameData);
        const newGameData = gameData.data.onGameStateUpdated;
        /**
         * Layout of the information pulled in:
         *      actualGameData
         *          > currentPlayerID
         *          > gameStatus
         *          > guesses []
         *          > id (GAME ID)
         *          > players []
         */

        let currentGuess = game.guesses.length;

        console.log(`pId: ${playerInfo[0]['playerId']}`);
        const guessedPlayer = playerInfo.find(player => player['playerId'] == newGameData.guesses[currentGuess].guessID);

        console.log(`cG: ${currentGuess} | guessP: ${guessedPlayer} | guessID: ${newGameData.guesses[currentGuess].guessID}`)

        var connections = findConnection(guessedPlayer, currentPlayer);
        ConnectionValidation(connections, guessedPlayer);
        
        game = newGameData;
        console.log("usedConnection", usedConnections);
        ResetTimer();

        console.log(`result: ${newGameData.currentPlayerID} | player: ${playerID}`);
        // initGame();

        if(newGameData.currentPlayerID !== playerID) {
            guessInput.disabled = true;
            guessButton.disabled = true;
        } else {
            guessInput.disabled = false;
            guessButton.disabled = false;
        }

    });

    function containsID(players) {
        for(var i = 0; i < players.length; i++) {
            if(players[i].id == playerID) {
                return true;
            }
        }

        return false;
    }

//#endregion


});