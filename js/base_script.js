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
    var whiteAlpha = 'rgba(255, 255, 255, 0.5)';
    var blackAlpha = 'rgba(53, 53, 53, 0.5)';

    var white = 'rgb(244, 244, 244)';
    var black = 'rgb(17, 17, 17)';

    var cnctn_dark = 'rgb(0, 123, 255)';
    var cnctn_dark_brdr ='rgb(0, 86, 179)';
    var cnctn_dark_font = 'rgb(255,255,255)';
    var cnctn_light = 'rgb(224, 242, 247)';
    var cnctn_light_brdr = 'rgb(179, 229, 252)';
    var cnctn_light_font = 'rgb(0, 59, 122)';

    var darkmodeAlpha = [ '.container', '#dark-mode', '#team-holder' ]; 
    var darkmodeReg = [ 'body' ];
    var fonts = [ '.hint' ];
    var borders = [  '.dot' ];

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
    })
    .catch(error => {
        console.error('Error fetching or parsing JSON:', error);
    });
    // Read in all data for Team SVGs
    function extractTeams(data) {
        data.teams.forEach(n => {
            teamSVG.push(n);
        });
        updateRandomTeam("WPG", false); // "TOR"
    }

    slider.addEventListener("change", function() {
        var css = Array.from(stylesheet.cssRules);

        darkmode = !darkmode;

        if(darkmode) {
            darkmodeAlpha.forEach(n => {
                css.find(x => x.selectorText === n).style.backgroundColor = blackAlpha;
            });
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = black);


            // css.find(n=> n.selectorText === ".word").style.backgroundColor = cnctn_dark;
            // css.find(n=> n.selectorText === ".word").style.color = cnctn_dark_font;
            // css.find(n=> n.selectorText === ".word").style.borderColor = cnctn_dark_brdr;


            
            // css.find(n=> n.selectorText === ".word.selected").style.backgroundColor = cnctn_light;
            // css.find(n=> n.selectorText === ".word.selected").style.color = cnctn_light_font;
            // css.find(n=> n.selectorText === ".word.selected").style.borderColor = cnctn_light_brdr;
            // borders.forEach(n => {
            //     if(n === '.guess-row.header-row') {
            //         css.find(x => x.selectorText === n).style.backgroundColor = black;
            //     } else {
                    
            //         css.find(x => x.selectorText === n).style.backgroundColor = `rgb(${lightenRgbPercentage(black, 20)})`;
            //         console.log(`${n} | ${css.find(x => x.selectorText === n).style.backgroundColor}`);
            //     }    
            // });


            // Opposite for fonts, selections, and borders
            // fonts.forEach(n => css.find(x => x.selectorText === n).style.color = white);
            // borders.forEach(n => css.find(x => x.selectorText === n).style.color = white)
            // borders.forEach(n => css.find(x => x.selectorText === n).style.borderColor = white);
            // // Lighten selections.
            // css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor = `rgb(${lightenRgbPercentage(black, 10)})`;
            // console.log(`${ css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor}`);
        } else {

            darkmodeAlpha.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = whiteAlpha);
            darkmodeReg.forEach(n => css.find(x => x.selectorText === n).style.backgroundColor = white);




            // css.find(n=> n.selectorText === ".word").style.backgroundColor = cnctn_light;
            // css.find(n=> n.selectorText === ".word").style.color = cnctn_light_font;
            // css.find(n=> n.selectorText === ".word").style.borderColor = cnctn_light_brdr;

            // css.find(n=> n.selectorText === ".word.selected").style.backgroundColor = cnctn_dark;
            // css.find(n=> n.selectorText === ".word.selected").style.color = cnctn_dark_font;
            // css.find(n=> n.selectorText === ".word.selected").style.borderColor = cnctn_dark_brdr;
            // borders.forEach(n => {
            //     if(n === '.guess-row.header-row') {
            //         css.find(x => x.selectorText === n).style.backgroundColor = white;
            //     } else {
                    
            //         css.find(x => x.selectorText === n).style.backgroundColor = `rgb(${lightenRgbPercentage(white, -150)})`;
            //         console.log(`${n} | ${css.find(x => x.selectorText === n).style.backgroundColor}`);
            //     }    
            // });

            // Opposite for fonts & selections
            // fonts.forEach(n => css.find(x => x.selectorText === n).style.color = black);
            // borders.forEach(n => css.find(x => x.selectorText === n).style.color = black);
            // borders.forEach(n => css.find(x => x.selectorText === n).style.borderColor = black);
            // css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor = `rgb(${lightenRgbPercentage(white, -90)})`;
            // console.log(`${ css.find(n => n.selectorText === '.autocomplete-items div:hover').style.backgroundColor}`);
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