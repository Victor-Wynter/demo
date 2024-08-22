var KEYDOWN = false;
var PAUSE = false;
var LOCK = false;

var HIGHSCORE = 0;
var SCORE = 0;
var SCORE_BUBBLE = 10;
var SCORE_SUPER_BUBBLE = 50;
var SCORE_GHOST_COMBO = 200;

var LIFES = 2;
var GAMEOVER = false;

var LEVEL = 1;
var LEVEL_NEXT_TIMER = -1;
var LEVEL_NEXT_STATE = 0;

var TIME_GENERAL_TIMER = -1;
var TIME_GAME = 0;
var TIME_LEVEL = 0;
var TIME_LIFE = 0;
var TIME_FRUITS = 0;

var HELP_DELAY = 1500;
var HELP_TIMER = -1;
			
function blinkHelp() { 
	if ( $('.help-button').attr("class").indexOf("yo") > -1 ) { 
		$('.help-button').removeClass("yo");
	} else { 
		$('.help-button').addClass("yo");
	}
}

function initGame(newgame) { 

	if (newgame) { 
		stopPresentation();
		stopTrailer();
	
		HOME = false;
		GAMEOVER = false;

		$('#help').fadeOut("slow");
		
		score(0);
		clearMessage();
		$("#home").hide();
		$("#panel").show();
		
		var ctx = null;
		var canvas = document.getElementById('canvas-panel-title-pacman');
		canvas.setAttribute('width', '38');
		canvas.setAttribute('height', '32');
		if (canvas.getContext) { 
			ctx = canvas.getContext('2d');
		}
		
		var x = 20;
		var y = 20;

		// Cabeça
		ctx.fillStyle = "#D2B48C"; // Cor de pelagem bege
		ctx.beginPath();
		ctx.arc(x, y, 11.25, 0, 2 * Math.PI); // Cabeça redonda
		ctx.fill();
		ctx.closePath();

		// Orelhas
		ctx.fillStyle = "#8B4513"; // Cor das orelhas (marrom)
		ctx.beginPath();
		ctx.ellipse(x - 7.5, y - 7.5, 5, 8.75, Math.PI / 4, 0, 2 * Math.PI); // Orelha esquerda
		ctx.ellipse(x + 7.5, y - 7.5, 5, 8.75, -Math.PI / 4, 0, 2 * Math.PI); // Orelha direita
		ctx.fill();
		ctx.closePath();

		// Olhos
		ctx.fillStyle = "#000"; // Cor dos olhos (preto)
		ctx.beginPath();
		ctx.arc(x - 3.75, y - 3.75, 2, 0, 2 * Math.PI); // Olho esquerdo
		ctx.arc(x + 3.75, y - 3.75, 2, 0, 2 * Math.PI); // Olho direito
		ctx.fill();
		ctx.closePath();

		// Focinho
		ctx.fillStyle = "#FFF"; // Cor do focinho (branco)
		ctx.beginPath();
		ctx.ellipse(x, y + 5, 5, 3.75, 0, 0, 2 * Math.PI); // Focinho ovalado
		ctx.fill();
		ctx.closePath();

		// Nariz
		ctx.fillStyle = "#000"; // Cor do nariz (preto)
		ctx.beginPath();
		ctx.arc(x, y + 3.75, 1.75, 0, 2 * Math.PI); // Nariz redondo
		ctx.fill();
		ctx.closePath();

		// Boca
		ctx.beginPath();
		ctx.moveTo(x - 2.5, y + 7.5);
		ctx.quadraticCurveTo(x, y + 9.75, x + 2.5, y + 7.5); // Curva da boca
		ctx.stroke();
		ctx.closePath();

	}

	initBoard();
	drawBoard();
	drawBoardDoor();
	
	initPaths();
	drawPaths();
	
	initBubbles();
	drawBubbles();
	
	initFruits();
	
	initPacman();
	drawPacman();
	
	initGhosts();
	drawGhosts();
	
	lifes();
	
	ready();
}

function win() { 
	stopAllSound();

	LOCK = true;
	stopPacman();
	stopGhosts();
	stopBlinkSuperBubbles();
	stopTimes();
	
	eraseGhosts();

	setTimeout("prepareNextLevel()", 1000);

}
function prepareNextLevel(i) { 
	if ( LEVEL_NEXT_TIMER === -1 ) { 
		eraseBoardDoor();
		LEVEL_NEXT_TIMER = setInterval("prepareNextLevel()", 250);
	} else { 
		LEVEL_NEXT_STATE ++;
		drawBoard( ((LEVEL_NEXT_STATE % 2) === 0) );
		
		if ( LEVEL_NEXT_STATE > 6) { 
			LEVEL_NEXT_STATE = 0;
			clearInterval(LEVEL_NEXT_TIMER);
			LEVEL_NEXT_TIMER = -1;
			nextLevel();
		}
	}
}
function nextLevel() { 
	LOCK = false;
	
	LEVEL ++;
	
	erasePacman();
	eraseGhosts();
	
	resetPacman();
	resetGhosts();

	initGame();
	
	TIME_LEVEL = 0;
	TIME_LIFE = 0;
	TIME_FRUITS = 0;
}


function retry() { 
	stopTimes();

	erasePacman();
	eraseGhosts();
	
	resetPacman();
	resetGhosts();
	
	drawPacman();
	drawGhosts();
	
	TIME_LIFE = 0;
	TIME_FRUITS = 0;
	
	ready();
}

function ready() { 
	LOCK = true;
	message("pronto!");
	
	playReadySound();
	setTimeout("go()", "4100");
}
function go() { 
	playSirenSound();

	LOCK = false;
	
	startTimes();
	
	clearMessage();
	blinkSuperBubbles();

	movePacman();

	moveGhosts();
}
function startTimes() { 
	if (TIME_GENERAL_TIMER === -1) { 
		TIME_GENERAL_TIMER = setInterval("times()", 1000);
	}
}
function times() { 
	TIME_GAME ++;
	TIME_LEVEL ++;
	TIME_LIFE ++;
	TIME_FRUITS ++;
	
	fruit();
}
function pauseTimes() { 
	if (TIME_GENERAL_TIMER != -1) { 
		clearInterval(TIME_GENERAL_TIMER);
		TIME_GENERAL_TIMER = -1;
	}
	if (FRUIT_CANCEL_TIMER != null) FRUIT_CANCEL_TIMER.pause();
}
function resumeTimes() { 
	startTimes();
	if (FRUIT_CANCEL_TIMER != null) FRUIT_CANCEL_TIMER.resume();
}
function stopTimes() { 
	if (TIME_GENERAL_TIMER != -1) { 
		clearInterval(TIME_GENERAL_TIMER);
		TIME_GENERAL_TIMER = -1;
	}
	if (FRUIT_CANCEL_TIMER != null) { 
		FRUIT_CANCEL_TIMER.cancel();
		FRUIT_CANCEL_TIMER = null;
		eraseFruit();
	}
}

function pauseGame() { 

	if (!PAUSE) { 
		stopAllSound();
		PAUSE = true;
		
		message("pause");
		
		pauseTimes();
		pausePacman();
		pauseGhosts();
		stopBlinkSuperBubbles();
	}
}
function resumeGame() { 
	if (PAUSE) { 
		testStateGhosts();

		PAUSE = false;
		
		clearMessage();
		
		resumeTimes();
		resumePacman();
		resumeGhosts();
		blinkSuperBubbles();
	}
}

function lifes(l) { 
	if (l) { 
		if (l > 0) { 
			playExtraLifeSound();
		}
		LIFES += l;
	}
	
	var canvas = document.getElementById('canvas-lifes');
	canvas.setAttribute('width', '120');
	canvas.setAttribute('height', '30');
	if (canvas.getContext) { 
		var ctx = canvas.getContext('2d');
		var img = new Image();
		img.src =  'static/assets/img/latido.png'; // Substitua pelo caminho da sua imagem
		
		img.onload = function() {
			ctx.clearRect(0, 0, 120, 30);
			for (var i = 0, imax = LIFES; (i < imax && i < 4); i++) { 
				ctx.drawImage(img, i * 30, 0, 26, 26); // Ajuste as dimensões conforme necessário
			}
		};
	}
}


function gameover() { 
    GAMEOVER = true;
    message("game over");
    stopTimes();

    erasePacman();
    eraseGhosts();
    
    resetPacman();
    resetGhosts();
    
    TIME_GAME = 0;
    TIME_LEVEL = 0;
    TIME_LIFE = 0;
    TIME_FRUITS = 0;

    LIFES = 2;
    LEVEL = 1;
    
    // Solicitar o nome do jogador
    var playerName = prompt("Enter your name:"); // Pede o nome do jogador
    if (playerName !== null && playerName.trim() !== "") {
        // Recuperar a pontuação mais alta do localStorage
        var highscore = parseInt(localStorage.getItem('highscore')) || 0;
        console.log("Current Score:", SCORE);
        console.log("Highscore Before Update:", highscore);
        if (SCORE > highscore) {
            // Atualizar a pontuação mais alta e o nome do jogador no localStorage
            localStorage.setItem('highscore', SCORE);
            localStorage.setItem('playerName', playerName);
            console.log("New Highscore:", SCORE);
            console.log("New Player Name:", playerName);
        }
    }

    // Redirecionar para a página de ranking após um breve atraso
    setTimeout(function() {
        window.location.href = "ranking.html";
    }, 2000); // O atraso é de 2 segundos, ajuste conforme necessário
}

console.log("Stored Player Name:", localStorage.getItem('playerName'));
console.log("Stored Highscore:", localStorage.getItem('highscore'));


function message(m) { 
	$("#message").html(m);
	if (m === "game over") $("#message").addClass("red");
}
function clearMessage() { 
	$("#message").html("");
	$("#message").removeClass("red");
}

function score(s, type) { 

	var scoreBefore = (SCORE / 10000) | 0;
	
	SCORE += s;
	if (SCORE === 0) { 
		$('#score span').html("00");
	} else { 
		$('#score span').html(SCORE);
	}
	
	var scoreAfter = (SCORE / 10000) | 0;
	if (scoreAfter > scoreBefore) { 
		lifes( +1 );
	}

	
	if (SCORE > HIGHSCORE) { 
		HIGHSCORE = SCORE;
		if (HIGHSCORE === 0) { 
			$('#highscore span').html("00");
		} else { 
			$('#highscore span').html(HIGHSCORE);
		}
	}
	
	if (type && (type === "clyde" || type === "pinky" || type === "inky" || type === "blinky") ) { 
		erasePacman(); 
		eraseGhost(type); 
		$("#board").append('<span class="combo">' + SCORE_GHOST_COMBO + '</span>');
		$("#board span.combo").css('top', eval('GHOST_' + type.toUpperCase() + '_POSITION_Y - 10') + 'px');
		$("#board span.combo").css('left', eval('GHOST_' + type.toUpperCase() + '_POSITION_X - 10') + 'px');
		SCORE_GHOST_COMBO = SCORE_GHOST_COMBO * 2;
	} else if (type && type === "fruit") { 
		$("#board").append('<span class="fruits">' + s + '</span>');
		$("#board span.fruits").css('top', (FRUITS_POSITION_Y - 14) + 'px');
		$("#board span.fruits").css('left', (FRUITS_POSITION_X - 14) + 'px');
	}
}