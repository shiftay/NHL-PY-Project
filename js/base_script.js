document.addEventListener('DOMContentLoaded', () => {
    const stylesheet = document.styleSheets[0];
    const logoSpace = document.getElementById("logoSpace");
    const slider = document.getElementById("slider");
    const teamholder = document.getElementById("team-holder");
    const body = document.getElementById('body');

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

    const darkmodeAlpha = [ '.container', '#dark-mode', '#team-holder' ]; 
    const darkmodeReg = [ 'body' ];
    const invertElements = [ '.slider::before', '#back' ];

    // === SLIDER + TEAM SWAP ====
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

    getCachedJSON('assets/colorCodes.json', 'colorCache')
    .then(data => {
        if (data) {
            extractColor(data);
        }
    });

    getCachedJSON('assets/20242025_teamlist.json', 'teamCache')
    .then(data => {
        if (data) {
            extractTeams(data);
            // main();
        }
    });

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
        main();
    }

    slider.addEventListener("change", function() {
        darkmode = !darkmode;
        updateDarkMode(darkmode);
        setCustomizationCookie('dark-mode', darkmode);
    });

    function updateDarkMode(toggle) {
        var css = Array.from(stylesheet.cssRules);
        if(toggle) {
            darkmodeAlpha.forEach(n => {
                css.find(x => x.selectorText === n).style.backgroundColor = blackAlpha;
            });
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = black);
            invertElements.forEach(n => {
                css.find(x => x.selectorText === n).style.filter = 'invert(100%)';
            });
        } else {
            darkmodeAlpha.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = whiteAlpha);
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = white);
            invertElements.forEach(n => {
                css.find(x => x.selectorText === n).style.filter = 'invert(0%)';
            });
        }
    }

    function main() {
        var cookies = readCustomization();
        if(!cookies[1])
            updateTeam("WPG", false);

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
        
        return returnVals;
    }


    function updateTeam(teamAbbrev, normal = true) { // team
       
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

    function setCustomizationCookie(name, val, days) {
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


});