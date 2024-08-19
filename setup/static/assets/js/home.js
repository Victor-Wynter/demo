var HOME = false;

var HOME_PRESENTATION_TIMER = -1;
var HOME_PRESENTATION_STATE = 0;

var HOME_TRAILER_TIMER = -1;
var HOME_TRAILER_STATE = 0;

var PACMAN_TRAILER_CANVAS_CONTEXT = null;
var PACMAN_TRAILER_DIRECTION = 3;
var PACMAN_TRAILER_POSITION_X = 600;
var PACMAN_TRAILER_POSITION_Y = 25;
var PACMAN_TRAILER_POSITION_STEP = 3;
var PACMAN_TRAILER_MOUNTH_STATE = 3;
var PACMAN_TRAILER_MOUNTH_STATE_MAX = 6;
var PACMAN_TRAILER_SIZE = 16;

var GHOST_TRAILER_CANVAS_CONTEXT = null;
var GHOST_TRAILER_BODY_STATE_MAX = 6;
var GHOST_TRAILER_POSITION_STEP = 3;

var GHOST_BLINKY_TRAILER_POSITION_X = 1000;
var GHOST_BLINKY_TRAILER_POSITION_Y = 25;
var GHOST_BLINKY_TRAILER_DIRECTION = 3;
var GHOST_BLINKY_TRAILER_COLOR = "#ed1b24";
var GHOST_BLINKY_TRAILER_BODY_STATE = 0;
var GHOST_BLINKY_TRAILER_STATE = 0;

var GHOST_PINKY_TRAILER_POSITION_X = 1035;
var GHOST_PINKY_TRAILER_POSITION_Y = 25;
var GHOST_PINKY_TRAILER_DIRECTION = 3;
var GHOST_PINKY_TRAILER_COLOR = "#feaec9";
var GHOST_PINKY_TRAILER_BODY_STATE = 1;
var GHOST_PINKY_TRAILER_STATE = 0;

var GHOST_INKY_TRAILER_POSITION_X = 1070;
var GHOST_INKY_TRAILER_POSITION_Y = 25;
var GHOST_INKY_TRAILER_DIRECTION = 3;
var GHOST_INKY_TRAILER_COLOR = "#4adecb";
var GHOST_INKY_TRAILER_BODY_STATE = 2;
var GHOST_INKY_TRAILER_STATE = 0;

var GHOST_CLYDE_TRAILER_POSITION_X = 1105;
var GHOST_CLYDE_TRAILER_POSITION_Y = 25;
var GHOST_CLYDE_TRAILER_DIRECTION = 3;
var GHOST_CLYDE_TRAILER_COLOR = "#f99c00";
var GHOST_CLYDE_TRAILER_BODY_STATE = 3;
var GHOST_CLYDE_TRAILER_STATE = 0;

function initHome() { 
	HOME = true;
	
	GAMEOVER = false;
	LOCK = false;
	PACMAN_DEAD = false;
	

	$("#panel").hide();
	$("#home").show();
	$("#home h3 em").append( " - " + new Date().getFullYear() );
	
	$('#help').fadeOut("slow");
	
	var ctx = null;
	var canvas = document.getElementById('canvas-home-title-pacman');
	canvas.setAttribute('width', '115');
	canvas.setAttribute('height', '100');
	if (canvas.getContext) { 
		ctx = canvas.getContext('2d');
	}
	
	var x = 50;
	var y = 50;

	// Cabeça
	ctx.fillStyle = "#D2B48C"; // Cor de pelagem bege
	ctx.beginPath();
	ctx.arc(x, y, 33.75, 0, 2 * Math.PI); // Cabeça redonda
	ctx.fill();
	ctx.closePath();

	// Orelhas
	ctx.fillStyle = "#8B4513"; // Cor das orelhas (marrom)
	ctx.beginPath();
	ctx.ellipse(x - 22.5, y - 22.5, 15, 26.25, Math.PI / 4, 0, 2 * Math.PI); // Orelha esquerda
	ctx.ellipse(x + 22.5, y - 22.5, 15, 26.25, -Math.PI / 4, 0, 2 * Math.PI); // Orelha direita
	ctx.fill();
	ctx.closePath();

	// Olhos
	ctx.fillStyle = "#000"; // Cor dos olhos (preto)
	ctx.beginPath();
	ctx.arc(x - 11.25, y - 7.5, 6, 0, 2 * Math.PI); // Olho esquerdo
	ctx.arc(x + 11.25, y - 7.5, 6, 0, 2 * Math.PI); // Olho direito
	ctx.fill();
	ctx.closePath();

	// Focinho
	ctx.fillStyle = "#FFF"; // Cor do focinho (branco)
	ctx.beginPath();
	ctx.ellipse(x, y + 15, 15, 11.25, 0, 0, 2 * Math.PI); // Focinho ovalado
	ctx.fill();
	ctx.closePath();

	// Nariz
	ctx.fillStyle = "#000"; // Cor do nariz (preto)
	ctx.beginPath();
	ctx.arc(x, y + 11.25, 5.25, 0, 2 * Math.PI); // Nariz redondo
	ctx.fill();
	ctx.closePath();

	// Boca
	ctx.beginPath();
	ctx.moveTo(x - 7.5, y + 18.75);
	ctx.quadraticCurveTo(x, y + 26.25, x + 7.5, y + 18.75); // Curva da boca
	ctx.stroke();
	ctx.closePath();
	
	canvas = document.getElementById('canvas-presentation-blinky');
	canvas.setAttribute('width', '50');
	canvas.setAttribute('height', '50');
	if (canvas.getContext) { 
		ctx = canvas.getContext('2d');
	}
	ctx.fillStyle = GHOST_BLINKY_COLOR;
	drawHelperGhost(ctx, 25, 25, 1, 0, 0, 0);
	
	canvas = document.getElementById('canvas-presentation-pinky');
	canvas.setAttribute('width', '50');
	canvas.setAttribute('height', '50');
	if (canvas.getContext) { 
		ctx = canvas.getContext('2d');
	}
	ctx.fillStyle = GHOST_PINKY_COLOR;
	drawHelperGhost(ctx, 25, 25, 1, 0, 0, 0);
	
	canvas = document.getElementById('canvas-presentation-inky');
	canvas.setAttribute('width', '50');
	canvas.setAttribute('height', '50');
	if (canvas.getContext) { 
		ctx = canvas.getContext('2d');
	}
	ctx.fillStyle = GHOST_INKY_COLOR;
	drawHelperGhost(ctx, 25, 25, 1, 0, 0, 0);
	
	canvas = document.getElementById('canvas-presentation-clyde');
	canvas.setAttribute('width', '50');
	canvas.setAttribute('height', '50');
	if (canvas.getContext) { 
		ctx = canvas.getContext('2d');
	}
	ctx.fillStyle = GHOST_CLYDE_COLOR;
	drawHelperGhost(ctx, 25, 25, 1, 0, 0, 0);
	
	startPresentation();
}

function startPresentation() { 
	$("#presentation *").hide();
	
	if (HOME_PRESENTATION_TIMER === -1) { 
		HOME_PRESENTATION_STATE = 0;
		HOME_PRESENTATION_TIMER = setInterval("nextSequencePresentation()", 500);
	}
}
function stopPresentation() { 

	if (HOME_PRESENTATION_TIMER != -1) { 
		$("#presentation *").hide();
		HOME_PRESENTATION_STATE = 0;
		clearInterval(HOME_PRESENTATION_TIMER);
		HOME_PRESENTATION_TIMER = -1;
	}
}
function nextSequencePresentation() { 
	if (HOME_PRESENTATION_STATE === 0) { 
		$("#presentation-titles").show();
	} else if (HOME_PRESENTATION_STATE === 2) { 
		$("#canvas-presentation-blinky").show();
	} else if (HOME_PRESENTATION_STATE === 4) { 
		$("#presentation-character-blinky").show();
	} else if (HOME_PRESENTATION_STATE === 5) { 
		$("#presentation-name-blinky").show();
	} else if (HOME_PRESENTATION_STATE === 6) { 
		$("#canvas-presentation-pinky").show();
	} else if (HOME_PRESENTATION_STATE === 8) { 
		$("#presentation-character-pinky").show();
	} else if (HOME_PRESENTATION_STATE === 9) { 
		$("#presentation-name-pinky").show();
	} else if (HOME_PRESENTATION_STATE === 10) { 
		$("#canvas-presentation-inky").show();
	} else if (HOME_PRESENTATION_STATE === 12) { 
		$("#presentation-character-inky").show();
	} else if (HOME_PRESENTATION_STATE === 13) { 
		$("#presentation-name-inky").show();
	} else if (HOME_PRESENTATION_STATE === 14) { 
		$("#canvas-presentation-clyde").show();
	} else if (HOME_PRESENTATION_STATE === 16) { 
		$("#presentation-character-clyde").show();
	} else if (HOME_PRESENTATION_STATE === 17) { 
		$("#presentation-name-clyde").show();
	}
	
	if (HOME_PRESENTATION_STATE === 17) { 
		clearInterval(HOME_PRESENTATION_TIMER);
		HOME_PRESENTATION_TIMER = -1;
		
		startTrailer();
	} else { 
		HOME_PRESENTATION_STATE ++;
	}
}

function startTrailer() { 

	var canvas = document.getElementById('trailer');
	canvas.setAttribute('width', '500');
	canvas.setAttribute('height', '50');
	if (canvas.getContext) { 
		PACMAN_TRAILER_CANVAS_CONTEXT = canvas.getContext('2d');
	}
	
	if (HOME_TRAILER_TIMER === -1) { 
		HOME_TRAILER_STATE = 0;
		HOME_TRAILER_TIMER = setInterval("nextSequenceTrailer()", 20);
	}
}
function stopTrailer() { 

	if (HOME_TRAILER_TIMER != -1) { 
		$("#presentation *").hide();
		HOME_TRAILER_STATE = 0;
		clearInterval(HOME_TRAILER_TIMER);
		HOME_TRAILER_TIMER = -1;
	}
}
function nextSequenceTrailer() { 

	erasePacmanTrailer();
	eraseGhostsTrailer();
	
	if (PACMAN_TRAILER_MOUNTH_STATE < PACMAN_TRAILER_MOUNTH_STATE_MAX) { 
		PACMAN_TRAILER_MOUNTH_STATE ++; 
	} else { 
		PACMAN_TRAILER_MOUNTH_STATE = 0; 
	}
	if ( PACMAN_TRAILER_DIRECTION === 1 ) { 
		PACMAN_TRAILER_POSITION_X += PACMAN_TRAILER_POSITION_STEP;
	} else if ( PACMAN_TRAILER_DIRECTION === 3 ) { 
		PACMAN_TRAILER_POSITION_X -= PACMAN_TRAILER_POSITION_STEP;
	}
	if ( PACMAN_TRAILER_POSITION_X < -650) { 
		PACMAN_TRAILER_DIRECTION = 1;
		PACMAN_TRAILER_POSITION_STEP ++;
	}
	
	if (GHOST_BLINKY_TRAILER_BODY_STATE < GHOST_TRAILER_BODY_STATE_MAX) { 
		GHOST_BLINKY_TRAILER_BODY_STATE ++;
	} else { 
		GHOST_BLINKY_TRAILER_BODY_STATE = 0;
	}
	if (GHOST_PINKY_TRAILER_BODY_STATE < GHOST_TRAILER_BODY_STATE_MAX) { 
		GHOST_PINKY_TRAILER_BODY_STATE ++;
	} else { 
		GHOST_PINKY_TRAILER_BODY_STATE = 0;
	}
	if (GHOST_INKY_TRAILER_BODY_STATE < GHOST_TRAILER_BODY_STATE_MAX) { 
		GHOST_INKY_TRAILER_BODY_STATE ++;
	} else { 
		GHOST_INKY_TRAILER_BODY_STATE = 0;
	}
	if (GHOST_CLYDE_TRAILER_BODY_STATE < GHOST_TRAILER_BODY_STATE_MAX) { 
		GHOST_CLYDE_TRAILER_BODY_STATE ++;
	} else { 
		GHOST_CLYDE_TRAILER_BODY_STATE = 0;
	}				
	if ( GHOST_BLINKY_TRAILER_DIRECTION === 1 ) { 
		GHOST_BLINKY_TRAILER_POSITION_X += GHOST_TRAILER_POSITION_STEP;
	} else if ( GHOST_BLINKY_TRAILER_DIRECTION === 3 ) { 
		GHOST_BLINKY_TRAILER_POSITION_X -= GHOST_TRAILER_POSITION_STEP;
	}
	if ( GHOST_PINKY_TRAILER_DIRECTION === 1 ) { 
		GHOST_PINKY_TRAILER_POSITION_X += GHOST_TRAILER_POSITION_STEP;
	} else if ( GHOST_PINKY_TRAILER_DIRECTION === 3 ) { 
		GHOST_PINKY_TRAILER_POSITION_X -= GHOST_TRAILER_POSITION_STEP;
	}
	if ( GHOST_INKY_TRAILER_DIRECTION === 1 ) { 
		GHOST_INKY_TRAILER_POSITION_X += GHOST_TRAILER_POSITION_STEP;
	} else if ( GHOST_INKY_TRAILER_DIRECTION === 3 ) { 
		GHOST_INKY_TRAILER_POSITION_X -= GHOST_TRAILER_POSITION_STEP;
	}
	if ( GHOST_CLYDE_TRAILER_DIRECTION === 1 ) { 
		GHOST_CLYDE_TRAILER_POSITION_X += GHOST_TRAILER_POSITION_STEP;
	} else if ( GHOST_CLYDE_TRAILER_DIRECTION === 3 ) { 
		GHOST_CLYDE_TRAILER_POSITION_X -= GHOST_TRAILER_POSITION_STEP;
	}
	if ( GHOST_BLINKY_TRAILER_POSITION_X < -255) { 
		GHOST_BLINKY_TRAILER_DIRECTION = 1;
		GHOST_BLINKY_TRAILER_STATE = 1;
	}
	if ( GHOST_PINKY_TRAILER_POSITION_X < -220) { 
		GHOST_PINKY_TRAILER_DIRECTION = 1;
		GHOST_PINKY_TRAILER_STATE = 1;
	}
	if ( GHOST_INKY_TRAILER_POSITION_X < -185) { 
		GHOST_INKY_TRAILER_DIRECTION = 1;
		GHOST_INKY_TRAILER_STATE = 1;
	}
	if ( GHOST_CLYDE_TRAILER_POSITION_X < -150) { 
		GHOST_CLYDE_TRAILER_DIRECTION = 1;
		GHOST_CLYDE_TRAILER_STATE = 1;
	}
	
	drawPacmanTrailer();
	drawGhostsTrailer();
	
	if (HOME_TRAILER_STATE === 750) { 
		clearInterval(HOME_TRAILER_TIMER);
		HOME_TRAILER_TIMER = -1;
	} else { 
		HOME_TRAILER_STATE ++;
	}
}

function getGhostsTrailerCanevasContext() { 
	return PACMAN_TRAILER_CANVAS_CONTEXT;
}
function drawGhostsTrailer() { 
	var ctx = getGhostsTrailerCanevasContext();
	
	if (GHOST_BLINKY_TRAILER_STATE === 1) { 
		ctx.fillStyle = GHOST_AFFRAID_COLOR;
	} else { 
		ctx.fillStyle = GHOST_BLINKY_COLOR;
	}
	drawHelperGhost(ctx, GHOST_BLINKY_TRAILER_POSITION_X, GHOST_BLINKY_TRAILER_POSITION_Y, GHOST_BLINKY_TRAILER_DIRECTION, GHOST_BLINKY_TRAILER_BODY_STATE, GHOST_BLINKY_TRAILER_STATE, 0);
	
	if (GHOST_PINKY_TRAILER_STATE === 1) { 
		ctx.fillStyle = GHOST_AFFRAID_COLOR;
	} else { 
		ctx.fillStyle = GHOST_PINKY_COLOR;
	}
	drawHelperGhost(ctx, GHOST_PINKY_TRAILER_POSITION_X, GHOST_PINKY_TRAILER_POSITION_Y, GHOST_PINKY_TRAILER_DIRECTION, GHOST_PINKY_TRAILER_BODY_STATE, GHOST_PINKY_TRAILER_STATE, 0);
	
	if (GHOST_INKY_TRAILER_STATE === 1) { 
		ctx.fillStyle = GHOST_AFFRAID_COLOR;
	} else { 
		ctx.fillStyle = GHOST_INKY_COLOR;
	}
	drawHelperGhost(ctx, GHOST_INKY_TRAILER_POSITION_X, GHOST_INKY_TRAILER_POSITION_Y, GHOST_INKY_TRAILER_DIRECTION, GHOST_INKY_TRAILER_BODY_STATE, GHOST_INKY_TRAILER_STATE, 0);
	
	if (GHOST_CLYDE_TRAILER_STATE === 1) { 
		ctx.fillStyle = GHOST_AFFRAID_COLOR;
	} else { 
		ctx.fillStyle = GHOST_CLYDE_COLOR;
	}
	drawHelperGhost(ctx, GHOST_CLYDE_TRAILER_POSITION_X, GHOST_CLYDE_TRAILER_POSITION_Y, GHOST_CLYDE_TRAILER_DIRECTION, GHOST_CLYDE_TRAILER_BODY_STATE, GHOST_CLYDE_TRAILER_STATE, 0);
}
function eraseGhostsTrailer(ghost) { 

	var ctx = getGhostsTrailerCanevasContext();
	
	ctx.clearRect(GHOST_BLINKY_TRAILER_POSITION_X - 17, GHOST_BLINKY_TRAILER_POSITION_Y - 17, 34, 34);
	ctx.clearRect(GHOST_PINKY_TRAILER_POSITION_X - 17, GHOST_BLINKY_TRAILER_POSITION_Y - 17, 34, 34);
	ctx.clearRect(GHOST_INKY_TRAILER_POSITION_X - 17, GHOST_BLINKY_TRAILER_POSITION_Y - 17, 34, 34);
	ctx.clearRect(GHOST_CLYDE_TRAILER_POSITION_X - 17, GHOST_BLINKY_TRAILER_POSITION_Y - 17, 34, 34);
}

function getPacmanTrailerCanevasContext() { 
	return PACMAN_TRAILER_CANVAS_CONTEXT;
}
// Carrega as duas imagens do cachorro (boca aberta e boca fechada) fora da função de animação
var imgOpenMouth = new Image();
var imgClosedMouth = new Image();
imgOpenMouth.src = "{% static 'assets/img/latido.png' %}"; // Caminho da imagem do cachorro com boca aberta
imgClosedMouth.src = "{% static 'assets/img/latido1.png' %}"; // Caminho da imagem do cachorro com boca fechada

function drawPacmanTrailer() {
    var ctx = getPacmanTrailerCanevasContext();

    // Limpa todo o canvas antes de desenhar
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var posX = PACMAN_TRAILER_POSITION_X;
    var posY = PACMAN_TRAILER_POSITION_Y;

    ctx.save(); // Salva o estado atual do contexto

    // Espelha a imagem quando o cachorro está indo para a direita
    if (PACMAN_TRAILER_DIRECTION === 3) { // Movendo para a direita
        ctx.scale(-1, 1); // Espelha horizontalmente
        posX = -posX; // Ajusta a posição no sistema de coordenadas invertido
    }

    // Variável de controle para alternar entre as imagens
    var useOpenMouth = (Date.now() / 100 % 2) < 1; // Alterna a cada 300ms entre as imagens

    // Desenha a imagem correta com base na variável de controle
    if (useOpenMouth) {
        ctx.drawImage(imgOpenMouth, posX - PACMAN_TRAILER_SIZE, posY - PACMAN_TRAILER_SIZE, PACMAN_TRAILER_SIZE * 2, PACMAN_TRAILER_SIZE * 2);
    } else {
        ctx.drawImage(imgClosedMouth, posX - PACMAN_TRAILER_SIZE, posY - PACMAN_TRAILER_SIZE, PACMAN_TRAILER_SIZE * 2, PACMAN_TRAILER_SIZE * 2);
    }

    ctx.restore(); // Restaura o estado original do contexto
}




function erasePacmanTrailer() { 

	var ctx = getPacmanTrailerCanevasContext();
	ctx.clearRect(PACMAN_TRAILER_POSITION_X - PACMAN_TRAILER_SIZE, PACMAN_TRAILER_POSITION_Y - PACMAN_TRAILER_SIZE, PACMAN_TRAILER_SIZE * 2, PACMAN_TRAILER_SIZE * 2);
}