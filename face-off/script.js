import { initializeAWS, gameStartedSub, queueforGame, uuid, gameStartedSubject, updateGuess, sendAction, actionSubject, actionSub, updatesSub, updateSubject } from '../dist/bundle.js';

document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const guessGrid = document.querySelector('.guess-grid');
    const attemptsDisplay = document.getElementById('attempts');
    const gameStatus = document.getElementById('popup');
    const bglayer = document.getElementById('bg-layer');
    const stylesheet = document.styleSheets[0];
    const logoSpace = document.getElementById("logoSpace");
    const slider = document.getElementById("slider");
    const teamholder = document.getElementById("team-holder");
    const queueButton = document.getElementById('queue');
    const connectionContent = document.getElementById('connection-content');

    const playerone_name = document.getElementById('player-one-name');
    const playerone_logo = document.getElementById('player-one-icon');
    const playerone_rank = document.getElementById('player-one-rank');
    const playerone_lifelines = document.getElementById('player-one-lifelines');

    const playertwo_name = document.getElementById('player-two-name');
    const playertwo_logo = document.getElementById('player-two-icon');
    const playertwo_rank = document.getElementById('player-two-rank');
    const playertwo_lifelines = document.getElementById('player-two-lifelines');

    const pregameplay = document.getElementById('pre-gameplay');
    const queueArea = document.getElementById('queue-area');
    const gameplay = document.getElementById('gameplay');
    const gameResolution = document.getElementById('game-resolution');

    /**
     * DEBUG BUTTONS
     */
    const debugQueue = document.getElementById('debug-queue');
    const debugGame = document.getElementById('debug-game-start');
    const debugShow = document.getElementById('debug-game-show');
    const debugFlip = document.getElementById('debug-flip-current');
    const debugresolution = document.getElementById('debug-game-resolution');

    const ACTION_CODES = {
        skip: {
            id: 101
        },
        pause: {
            id: 423
        },
        info: {
            id: 103
        }, 
        speedup: {
            id: 408
        },
        incorrect: {
            id: 406
        }
    };

    const stats_cookie = 'scouting-report-stats';
    const game_cookie = 'scouting-report-current';

    const cookie_vals = [ 'attempts', 'guesses' ];

    const PLAYER_AMOUNT = 6813;

    // Auto Complete
    var playerNames = [];
    var playerInfo = [];
    var teamSVG = [];
    var playerPieces = {};

    var colorCodes = [];

    var bgelements = [];

    var darkmode = false;
    // AWS
    let client;
    let playerID;
    let playerName = "DEFAULT_PLAYER";
    let onGameStarted_sub = null;
    let updates_sub = null;
    let actions_sub = null;
    let gameID;
    let game;

    // Lifelines
    var lifeLines = [];

    const LIFELINE_SKIP = 0;
    const LIFELINE_PAUSE = 1;
    const LIFELINE_INFO = 2;
    const LIFELINE_SPEED = 3;


    

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
                        // console.log(`${n.playerId}`);

                        playerPieces[`${n.playerId}`] = names;

                        playerNames.push(names);
                    });

                    main();
                }
            });
        }
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


    debugresolution.addEventListener('click', function() {
        Fade( gameResolution, pregameplay, '#game-resolution','#pre-gameplay');
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


        let logo = document.createElement('img');
        logo.src =  Array.from(teamSVG).find(n => n.teamAbbrev === current_team).teamLogo;
        logo.setAttribute('id', 'icon');
        playerone_name.textContent = `Guest-${playerID.substring(0,4)}`;
        playerone_logo.append(logo);
        playerone_rank.textContent = 1000;

        playerone_lifelines.append(createLifeLines('player-one'));
    });

    debugFlip.addEventListener('click', function() {
        var current = document.getElementsByClassName('current-card')[0];

        createCardBack(current);

        if(current) {
            current.style.transform = "rotateY(180deg)";
        }
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
        var currentCookie = getCookie('team');
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
        smallLogo = document.createElement('img');

        smallLogo.src = Array.from(teamSVG).find(n => n.teamAbbrev === random.teamAbbrev).teamLogo;
        smallLogo.id = 'small-logo';
        smallLogo.addEventListener("click", function(e) {
            updateLook(logoSpace);
        });        

        bglayer.style.backgroundImage = `url("${Array.from(teamSVG).find(n => n.teamAbbrev === random.teamAbbrev).teamLogo}")`;
        bglayer.style.backgroundRepeat = 'repeat';
        // logo size - 225 x 150 
        bglayer.style.backgroundSize = '230px 220px';
        bglayer.style.filter = 'grayscale(100%)';
        bglayer.style.backgroundPositionX = `${230 / 2}px`;
        bglayer.style.backgroundPositionY = `${220 / 2}px`;
        logoSpace.appendChild(smallLogo);
    }


    // window.addEventListener('resize', () => {
    /**
     * On Window Resize
     */
    // });

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
        var season = getPlayersBySeason(playerInfo, 20242025);
        var player = season[Math.floor(Math.random() * playerInfo.length)];

        while(usedPlayers.includes(player)) {
            player = season[Math.floor(Math.random() * playerInfo.length)];
        }

        return player;
    }

    /**
     * Helper function for looking at a specific season 
     * targetSeason formatting 20242025 YEARYEAR
     */
    function getPlayersBySeason(players, targetSeason) {
        if (!Array.isArray(players)) {
            console.error("Input 'players' must be an array.");
            return [];
        }

        const playersInSeason = players.filter(player => {
            // 1. Check if 'seasonsPlayed' array exists and is an array
            if (!player.seasonsPlayed || !Array.isArray(player.seasonsPlayed)) {
            return false; // Player has no valid seasonsPlayed data
            }

            // 2. Iterate through the player's seasons to find a match
            return player.seasonsPlayed.some(seasonEntry => {
            // Ensure 'season' property exists and is a number (or can be compared)
            // The season ID is a number, so direct comparison is best.
            return seasonEntry.season === targetSeason;
            });
        });

        return playersInSeason;
    }

    function playerExists(guess) {
        const guessedPlayer = playerInfo.find(player => player['name'].toLowerCase() === guess.toLowerCase());
        if(!guessedPlayer) {
            return false;
        }

        return true;
    }


//#endregion


//#region CARDS
    /**
     * Flip Card Front
     */
    function flipCard(player) {
        var current = document.getElementsByClassName('current-card');
        if(current[0]) {
            current[0].classList.remove('current-card');
        }

        var flipCard = document.createElement('div');
        flipCard.setAttribute('id', 'flip-card');


        var flipInner = document.createElement('div');
        flipInner.setAttribute('id', 'flip-card-inner');

        var flipFront = document.createElement('div');
        flipFront.setAttribute('id', 'flip-card-front'); 

        // IMAGE.
        var image = document.createElement('img');
        image.src = `https://assets.nhle.com/mugs/actionshots/1296x729/${player['playerId']}.jpg`; //player['headshot'];
        image.setAttribute('id', 'headshot');
        image.draggable = false;
        // NAMe / POS / NUmber
        var baseInfo = document.createElement('div');
        baseInfo.setAttribute('id', 'card-content');

        returnStyle(player).forEach( n => {
            baseInfo.append(n);
        });

        flipFront.append(image, baseInfo);

        flipInner.append(flipFront);
        flipInner.classList.add('current-card');
        flipCard.append(flipInner);

        connectionContent.insertBefore(flipCard, connectionContent.children[0]);
        currentPlayer = player;
    }

    function createCardBack(flipInner) {
        var flipBack = document.createElement('div');
        flipBack.setAttribute('id', 'flip-card-back');

        // EXTRA INFO
        var background = document.createElement('img');
        background.src = '../assets/card_back.png';
        background.setAttribute('id', 'headshot');
        background.draggable = false;
        // COUNTRY, dRAFT YEAR, ETC,....
        var hiddenContent = document.createElement('div');
        hiddenContent.setAttribute('id', 'card-hidden-content');

        returnBack(currentPlayer).forEach(n => {
            hiddenContent.append(n);
        });

        flipBack.append(background, hiddenContent);
        flipInner.appendChild(flipBack);
    }

    function returnBack(player) {
        var content = [];
        var name = document.createElement('div');

        name.textContent = player['name'];
        name.style.position = 'absolute';
        name.style.top = '5px';
        name.style.left = '5px';
        name.style.fontSize = 'small';

        content.push(name);

        var draft = document.createElement('div');

        draft.textContent = `Draft: ${isDraftDetailsMissingOrEmpty(player) ? "Undrafted" : `${player['draftDetails']['year']} \n Rd: ${player['draftDetails']['round']} #${player['draftDetails']['pick']}`}`;
        draft.style.fontSize = 'small';
        draft.style.position = 'absolute';
        draft.style.top = '5px';
        draft.style.right = '5px';

        content.push(draft);

        content.push(GrabNHLTeams(player));

        if(NotJustCup(player)) {
            var awards = document.createElement('div');
            
            for(var i = 0; i < player['awards'].length; i++) {
                if(player['awards'][i]['trophyName'] === "Stanley Cup") {
                    continue;
                }
                var holder = document.createElement('div');
                var award = document.createElement('img');
                award.src = returnAward(player['awards'][i]['trophyName']);
                award.setAttribute('id', 'award');
                award.draggable = false;
                award.alt = player['awards'][i]['trophyName'];

                holder.append(award)
                awards.append(holder);
            }

            awards.style.position = 'absolute';
            awards.style.display = 'flex';
            awards.style.bottom = '0px';
            awards.style.width = '100%';
            awards.style.justifyContent = 'center';
            content.push(awards);
        }

        return content;
    }

    function GrabNHLTeams(player) {
        var holder = document.createElement('div');
        var usedTeams = [];

        for(var i = 0; i < player['seasonsPlayed'].length; i++) {
            if(player['seasonsPlayed'][i]['league'] === 'NHL') {
                if(!usedTeams.includes(player['seasons'][i]['teamName'])) {
                    usedTeams.push(player['seasons'][i]['teamName']);

                    /**
                     * Add a image of the team if we can find it's logo in 
                     *  Array.from(teamSVG).find(n => n.teamAbbrev === current_team).teamLogo;
                     */


                }
            }
        }


        return holder;
    }

    function returnAward(award) {
        return `../assets/trophies/${award.split(" ").join("-")}.png`;
    }

    function isDraftDetailsMissingOrEmpty(player) {
        return (
            !player.draftDetails || // Check if draftDetails is null or undefined
            typeof player.draftDetails !== "object" ||
            Object.keys(player.draftDetails).length === 0
        );
    }

    function NotJustCup(player) {
        for(var i = 0; i < player['awards'].length; i++) {
            if(player['awards'][i]['trophyName'] !== "Stanley Cup") {
                return true;
            }
        }

        return false;
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
                name.style.left = '0px';
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
                positionElement.style.left = '0px';
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
    }


    function createSkipConnection() {
        var connection = document.createElement("div");
        connection.setAttribute("id", "connection");
        var connectionVal = document.createElement('div');

        connectionVal.setAttribute("id", "connection-value");
        connectionVal.textContent = "SKIPPED";
        connection.appendChild(connectionVal);
   
        connectionContent.insertBefore(connection, connectionContent.children[0]);
    }


    function createLine(id) {
        var line = document.createElement("div");
        line.setAttribute("id", id);
        connectionContent.insertBefore(line, connectionContent.children[0]);
    }
//#endregion

//#region GAME LOGIC
var currentPlayer;
var usedConnections = {};
var usedPlayers = [];

/**
 * Starting Game
 * Requires clearing and initializing all stats.
 */
    function startGame() {
        usedConnections = {};
        // Bobby Orr 8450070
        // JS Giguere 8462044
        currentPlayer = playerInfo.find(n=> n['playerId'] == 8450070) 
        usedPlayers.push(currentPlayer);
        flipCard(currentPlayer);
        console.log(currentPlayer['playerId']);
    }
    /**
     * Logic for showing Connecton or Pop Up
     */
    function ConnectionValidation(connections, guessPlayer) {
        var validConnect = false;

        var amount = countConnections(connections);

        validConnect = (connections.length == 0 ?  false : connections.length == amount);

        console.log(`${validConnect} | ${amount} | ${connections.length}`);

        if(validConnect) {
            
            createLine('line');
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
            }

            createLine('line');
            flipCard(guessPlayer);
            
        } else {
            // NO connection
            
        }
        ResetTimer();
    }


    function SkipConnection(idPlayer) {
        createLine('line');
        createSkipConnection();
        createLine('line');
        flipCard(idPlayer);
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

    function countConnections(connections) {
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

        return amount;
    }


    function checkGuess() {
        guessInput.value = "";
        const guessedPlayer = playerInfo.find(player => player['playerId'] == guessID);

        var connections = findConnection(guessedPlayer, currentPlayer);
        
        var amount = countConnections(connections);

        if(guessedPlayer == currentPlayer || usedPlayers.includes(guessedPlayer)) {
            amount = -1;
        }

        if(amount > 0 && amount == connections.length) {
            updateGuess(client, gameID, playerID, guessedPlayer['playerId']);
        } else {

            sendAction(client, gameID, playerID, ACTION_CODES.incorrect.id, guessedPlayer['playerId']);

        }
    }


    function findConnection(guess, current) {
        let connections = [];

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

        /**
         * Country currently DISABLED
         * To easy to fill up on specific countries (ie. CAN)
         */
        // if(guess['birthCountry'] == current['birthCountry']){
        //     connections.push(`b-${guess['birthCountry']}`);
        // } 

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
    let guessID;

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
            for(let key in playerPieces) {
                // console.log(key, playerPieces[key]);
                var combinedName = "";
                var firstName = "";
                var lastName = "";
                for(var x = 0; x < playerPieces[key].length; x++) {
                    combinedName += playerPieces[key][x];

                    if(x < playerPieces[key].length - 1) {
                        combinedName += " ";
                    }
   
                    if(x == 0) {
                        firstName = playerPieces[key][x];
                    } else {
                        lastName += playerPieces[key][x];
                        if(x + 1 < playerPieces[key].length) {
                            lastName += " ";
                        }
                    }
                }

                if (firstName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
 
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + firstName.substr(0, val.length) + "</strong>";
                    b.innerHTML += firstName.substr(val.length) + " " + lastName;
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += `<input type='hidden' value="${combinedName}">`;
                    b.innerHTML += `<input type='hidden' value="${key}">`;
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                            
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        guessID = this.getElementsByTagName("input")[1].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                } else if (lastName.substr(0, val.length).toUpperCase() == val.toUpperCase()) { // Last Name
                    /*create a DIV element for each matching element:*/
      
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = firstName;
                    b.innerHTML += " <strong>" + lastName.substr(0, val.length) + "</strong>";
                    b.innerHTML += lastName.substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += `<input type='hidden' value="${combinedName}">`;
                    b.innerHTML += `<input type='hidden' value="${key}">`;
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
          
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        guessID = this.getElementsByTagName("input")[1].value;
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
                    b.innerHTML += `<input type='hidden' value="${key}">`;
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
            
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        guessID = this.getElementsByTagName("input")[1].value;
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

      autocomplete(document.getElementById("guess-input"), playerPieces);
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
    const TIME_LIMIT_EXTENDED = 30;
    let currentLimit = TIME_LIMIT;
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
            timeLeft = currentLimit - timePassed;
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
        let seconds = time % 60;
        return `${seconds}`; 
    }

    function resetColor() {
        const { alert, warning, info } = COLOR_CODES;

        document
        .getElementById("base-timer-path-remaining")
        .classList.remove(checkLevel());
        document
        .getElementById("base-timer-path-remaining")
        .classList.add(info.color);
    }


    function checkLevel() {
        const { alert, warning, info } = COLOR_CODES;

        if(timeLeft <= alert.threshold) {
            return alert.color;
        } else if(timeLeft <= warning.threshold) {
            return warning.color;
        } else {
            return info.color;
        }
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

//#region SCROLL
    // Get the button
    let mybutton = document.getElementById("backToTopBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    mybutton.addEventListener("click", backToTop);

    function backToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
//#endregion

//#region UNLOAD
    window.onbeforeunload = function(event) {
        console.log("testing-onbeforeunload") // Attempt to run your function

        /**
         * Clean up the subscriptions on unload.
         */
        if(onGameStarted_sub) {
            onGameStarted_sub.unsubscribe();
        }

        if(actions_sub) {
            // TODO null game after we complete it, so that on unsubscribe if we dont' have a null game, we instead send a game over to the other user.
            actions_sub.unsubscribe();
        }

        if(updates_sub) {
            updates_sub.unsubscribe();
        }

        /**
         * if we're in queue, remove ourselves from queue table
         */


        /**
         * if we're in game, send a you lost to the other player.
         */
    
        // The return value here can trigger a confirmation dialog in some browsers
        // Returning an empty string or undefined generally avoids the prompt.
        return;
    };
//#endregion


//#region AWS
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
        onGameStarted_sub = null;
        game = actualGameData;
        /**
         * Subscribe to other AWS Subscriptions
         */
        updates_sub = updatesSub(client, gameID); 
        actions_sub = actionSub(client, gameID);

        let index = -1;
        for(var i = 0; i < actualGameData.players.length; i++) {
            if(actualGameData.players[i].id !== playerID) {
                index = i;
                break;
            }
        }

        console.log(game);

        let logo = document.createElement('img');
        logo.src =  Array.from(teamSVG).find(n => n.teamAbbrev === current_team).teamLogo;
        logo.setAttribute('id', 'icon');
        playerone_name.textContent = `Guest-${playerID.substring(0,4)}`;
        playerone_logo.append(logo);
        playerone_rank.textContent = 1000;
        playerone_lifelines.append(createLifeLines('player-one'));

        let logo_two = document.createElement('img');
        logo_two.setAttribute('id', 'icon');
        logo_two.src = Array.from(teamSVG).find(n => n.teamAbbrev === actualGameData.players[index].logo).teamLogo;
        playertwo_name.textContent = "Guest-" + actualGameData.players[index].id.substring(0,4);
        playertwo_logo.append(logo_two);
        playertwo_rank.textContent = actualGameData.players[index].rank;
        playertwo_lifelines.append(createLifeLines('player-two'));
        
        initGame();

        if(actualGameData.currentPlayerID !== playerID) {
            guessInput.disabled = true;
            guessButton.disabled = true;
        }
    });

    

    function createLifeLines(clickable) {
        var holder = document.createElement('div');

        holder.setAttribute('id', 'lifeline-holder');

        // SKIP | PAUSE | SHOW INFO | SPEED UP 
        var skip = document.createElement('img');
        skip.setAttribute('id', `${clickable}-skip`);
        skip.src = '../assets/lifeline_skip.png';
        skip.classList.add('player-one-life-lines-available');

        var pause = document.createElement('img');
        pause.setAttribute('id', `${clickable}-pause`);
        pause.classList.add('player-one-life-lines-available');
        pause.src = '../assets/lifeline_pause.png';


        var showInfo = document.createElement('img');
        showInfo.setAttribute('id', `${clickable}-show-info`);
        showInfo.src = '../assets/lifeline_info.png';
        showInfo.classList.add('player-one-life-lines-available');

        var speedUp = document.createElement('img');
        speedUp.setAttribute('id', `${clickable}-speed-up`);
        speedUp.src = '../assets/lifeline_speed.png';
        speedUp.classList.add('player-one-life-lines-available');

        if(clickable === 'player-one') {
            skip.addEventListener('click', skipEvent);
            speedUp.addEventListener('click', speedUpEvent);
            pause.addEventListener('click', pauseEvent);
            showInfo.addEventListener('click', showInfoEvent);
        }
        
        holder.append(skip, pause, showInfo, speedUp);

        return holder;
    }

    function skipEvent() {
        if(game.currentPlayerID !== playerID) return;

        sendAction(client, gameID, playerID, ACTION_CODES.skip.id, getRandomPlayer()['playerId']);
    }

    function showInfoEvent() {
        if(game.currentPlayerID !== playerID) return;

        sendAction(client, gameID, playerID, ACTION_CODES.info.id, -1);
    }

    function speedUpEvent() {
        if(game.currentPlayerID == playerID) return; // Played on other player's turn

        if(timePassed < 10) return;

        sendAction(client, gameID, playerID, ACTION_CODES.speedup.id, -1);
    }

    function pauseEvent() {
        if(game.currentPlayerID !== playerID) return;

        sendAction(client, gameID, playerID, ACTION_CODES.pause.id, -1);
    }

    updateSubject.subscribe((gameData) => {
        // This is your "other script" (in a different file)
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

        const guessedPlayer = playerInfo.find(player => player['playerId'] == newGameData.guesses[currentGuess].guessID);

        var connections = findConnection(guessedPlayer, currentPlayer);
        ConnectionValidation(connections, guessedPlayer);

        usedPlayers.push(guessedPlayer);
        
        game = newGameData;
        console.log("usedConnection", usedConnections);
        ResetTimer();
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
    
    actionSubject.subscribe((gameData) => {
        console.log(`action: ${gameData}`);

        const info = gameData.data.onActionTaken;
        /**
         * Switch on Action ID
         * To send to the different possible functions.
         */
        switch(parseInt(info.actionID)) {
            case ACTION_CODES.incorrect.id: // Incorrect Guess
                showPopUp(info.guessID);
                break;
            // LIFELINES
            case ACTION_CODES.speedup.id: // SPEED UP
                speedupAction();
                break;
            case ACTION_CODES.info.id: // SHOW INFO
                infoAction(info.playerID);
                break;
            case ACTION_CODES.skip.id: // SKIP
                skipAction(info.guessID, info.playerID);
                break;
            case ACTION_CODES.pause.id: // PAUSE
                pauseAction();
                break;
        }
    });


//#endregion


//#region ACTIONS
    function pauseAction() {
        currentLimit = TIME_LIMIT_EXTENDED;
    }

    function speedupAction() {
        timePassed = 10;
    }

    function infoAction(_playerID) {
        if(_playerID == playerID){

            var current = document.getElementsByClassName('current-card')[0];

            createCardBack(current);

            if(current) {
                current.style.transform = "rotateY(180deg)";
            }
        }
    }

    function skipAction(guess, _playerID) {
        SkipConnection(playerInfo.find(n=> n['playerId'] == guess));

        console.log(`${game.currentPlayerID} | ${_playerID}`);

        if(_playerID == playerID) {
            console.warn("WE TURNED OFF YOUR STUFF");
            for(var i = 0; i < game.players.Length; i++) {
                if(game.players[i].id == _playerID) continue;

                game.currentPlayerID = game.players[i].id;
            }
            guessInput.disabled = true;
            guessButton.disabled = true;
        } else {
            game.currentPlayerID = playerID;
            guessInput.disabled = false;
            guessButton.disabled = false;
        }
        ResetTimer();
    }

    function showPopUp(guessId) {
        const guessedPlayer = playerInfo.find(player => player['playerId'] == guessId);
        var connections = findConnection(guessedPlayer, currentPlayer);

        let reasons = giveReason(connections);
        var text = "";

        if(usedPlayers.includes(guessedPlayer)) {
            text = `${guessedPlayer['name']} has already been played.`;
        } else if(reasons.length < 1) {
            text = `No Valid Connections Found For ${guessedPlayer['name']}`;
        } else if(reasons.length > 0) {
            
            for(var i = 0; i < reasons.length; i++) {
                text += `${reasons[i]} connections are used up.`

                if(i < reasons.length-1) {
                    text += `\n`;
                }
            }
        } 

        popup.textContent = text;
        popup.classList.toggle('show');
        setTimeout(function() {
            popup.classList.toggle('show');
        }, 1500);
    }
//#endregion
});