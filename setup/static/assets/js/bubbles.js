var BUBBLES_ARRAY = new Array();
var BUBBLES_CANVAS_CONTEXT = null;
var BUBBLES_X_START = 30;
var BUBBLES_X_END = 518;
var BUBBLES_GAP = ((BUBBLES_X_END - BUBBLES_X_START) / 25);
var BUBBLES_Y_START = 26;
var BUBBLES_Y_END = 522;
var BUBBLES_SIZE = 3;
var BUBBLES_COUNTER = 0;

var SUPER_BUBBLES = [];
var SUPER_BUBBLES_SIZE = 8;
var SUPER_BUBBLES_BLINK = false;
var SUPER_BUBBLES_BLINK_STATE = 0;
var SUPER_BUBBLES_BLINK_TIMER = -1;
var SUPER_BUBBLES_BLINK_SPEED = 525;

function initBubbles() { 
	BUBBLES_COUNTER = 0;
	BUBBLES_ARRAY.length = 0;

	var canvas = document.getElementById('canvas-bubbles');
	canvas.setAttribute('width', '550');
	canvas.setAttribute('height', '550');
	if (canvas.getContext) { 
		BUBBLES_CANVAS_CONTEXT = canvas.getContext('2d');
	}
}

function getBubblesCanevasContext() { 
	return BUBBLES_CANVAS_CONTEXT;
}

function drawBubbles() { 

	var ctx = getBubblesCanevasContext();
	var boneImage = new Image();
	boneImage.src = 'static/assets/img/osso.png'; // Caminho para a imagem do osso
	
	boneImage.onload = function() {
		for (var line = 1, linemax = 29, i = 0, s = 0; line <= linemax; line++) { 
			var y = getYFromLine(line);
			for (var x = BUBBLES_X_START, xmax = BUBBLES_X_END, bubble = 1; x < xmax; bubble++, x += BUBBLES_GAP) { 
				if (canAddBubble(line, bubble)) { 
					var type = "";
					var size = "";
					var scaleFactor = 1; // Fator de escala padrão

					if (isSuperBubble(line, bubble)) { 
						type = "s";
						size = SUPER_BUBBLES_SIZE;
						scaleFactor = 0.8; // Diminui o tamanho dos super bubbles pela metade
						SUPER_BUBBLES[s] = line + ";" + bubble + ";" + parseInt(correctionX(x, bubble)) + "," + parseInt(y) + ";0";
						s++;
					} else { 
						type = "b";
						size = BUBBLES_SIZE;
					}

					BUBBLES_COUNTER++;

					// Desenha a imagem do osso, aplicando o fator de escala
					ctx.drawImage(boneImage, correctionX(x, bubble) - size * scaleFactor, y - size * scaleFactor, size * scaleFactor * 3, size * scaleFactor * 3);
					
					BUBBLES_ARRAY.push(parseInt(correctionX(x, bubble)) + "," + parseInt(y) + ";" + line + ";" + bubble + ";" + type + ";0");
					i++;
				}
			}
		}
	};
}

function stopBlinkSuperBubbles() { 
	clearInterval(SUPER_BUBBLES_BLINK_TIMER);
	SUPER_BUBBLES_BLINK_TIMER = -1;
	SUPER_BUBBLES_BLINK = false;
}

var SUPER_BUBBLES_SIZE = 7.6;

function setSuperBubbleOnXY(x, y, eat) {
    for (var i = 0, imax = SUPER_BUBBLES.length; i < imax; i++) {
        var bubbleParams = SUPER_BUBBLES[i].split(";");
        var testX = parseInt(bubbleParams[2].split(",")[0]);
        var testY = parseInt(bubbleParams[2].split(",")[1]);
        if (testX === x && testY === y) {
            // Marca a super bubble como comida
            SUPER_BUBBLES[i] = SUPER_BUBBLES[i].substr(0, SUPER_BUBBLES[i].length - 1) + "1";
            eraseBubble("s", x, y);  // Apaga a super bubble da tela
            break;
        }
    }
}

function blinkSuperBubbles() {
    if (SUPER_BUBBLES_BLINK === false) {
        SUPER_BUBBLES_BLINK = true;
        SUPER_BUBBLES_BLINK_TIMER = setInterval(blinkSuperBubbles, SUPER_BUBBLES_BLINK_SPEED);
    } else {
        SUPER_BUBBLES_BLINK_STATE = 1 - SUPER_BUBBLES_BLINK_STATE; // Alterna entre 0 e 1

        var ctx = getBubblesCanevasContext();
        var boneImage = new Image();
        boneImage.src =  'static/assets/img/osso.png';

        boneImage.onload = function() {
            for (var i = 0, imax = SUPER_BUBBLES.length; i < imax; i++) {
                var s = SUPER_BUBBLES[i];
                var sx = parseInt(s.split(";")[2].split(",")[0]);
                var sy = parseInt(s.split(";")[2].split(",")[1]);
                var isEaten = s.split(";")[3] === "1";  // Verifica se a super bubble foi comida

                if (!isEaten) {
                    // Apaga a área ocupada pela super bubble antes de redesenhar
                    ctx.clearRect(sx - SUPER_BUBBLES_SIZE, sy - SUPER_BUBBLES_SIZE, SUPER_BUBBLES_SIZE * 3, SUPER_BUBBLES_SIZE * 3);

                    if (SUPER_BUBBLES_BLINK_STATE === 0) {
                        // Desenha a imagem do osso na posição correta
                        ctx.drawImage(boneImage, sx - SUPER_BUBBLES_SIZE, sy - SUPER_BUBBLES_SIZE, SUPER_BUBBLES_SIZE * 3, SUPER_BUBBLES_SIZE * 3);
                    }
                }
            }
        };
    }
}


function setSuperBubbleOnXY( x, y, eat ) { 

	for (var i = 0, imax = SUPER_BUBBLES.length; i < imax; i ++) { 
		var bubbleParams = SUPER_BUBBLES[i].split( ";" );
		var testX = parseInt(bubbleParams[2].split( "," )[0]);
		var testY = parseInt(bubbleParams[2].split( "," )[1]);
		if ( testX === x && testY === y ) { 
			SUPER_BUBBLES[i] = SUPER_BUBBLES[i].substr( 0, SUPER_BUBBLES[i].length - 1 ) + "1";
			break;
		}
	}
}

function getBubbleOnXY( x, y ) { 

	var bubble = null;
	for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i ++) { 
		var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
		var testX = parseInt(bubbleParams[0].split( "," )[0]);
		var testY = parseInt(bubbleParams[0].split( "," )[1]);
		if ( testX === x && testY === y ) { 
			bubble = BUBBLES_ARRAY[i];
			break;
		}
	}
	return bubble;
}

function eraseBubble(t, x, y) { 
    var ctx = getBubblesCanevasContext();
	
    var size = (t === "s") ? SUPER_BUBBLES_SIZE : BUBBLES_SIZE;
    var radius = size * 5
	
    // Ajuste para limpar uma área maior e garantir que a super bubble seja completamente apagada
    var clearSize = size * 5;
    ctx.clearRect(x - clearSize / 2, y - clearSize / 2, clearSize, clearSize);
}

function isSuperBubble(line, bubble) { 
	if ( (line === 23 || line === 4) && (bubble === 1 || bubble === 26)) { 
		return true;
	}
	
	return false;
}

function canAddBubble(line, bubble) { 
	
	if ( ( ( line >= 1 && line <= 4) || (line >= 9 && line <= 10) || (line >= 20 && line <= 22) || (line >= 26 && line <= 28) ) && (bubble === 13 || bubble === 14)) {
		return false;
	} else if ( ( (line >= 2 && line <= 4) || (line >= 21 && line <= 22) ) && ( (bubble >= 2 && bubble <= 5) || (bubble >= 7 && bubble <= 11) || (bubble >= 16 && bubble <= 20) || (bubble >= 22 && bubble <= 25) ) ) { 
		return false;
	} else if ( ( line >= 6 && line <= 7 ) && ( (bubble >= 2 && bubble <= 5) || (bubble >= 7 && bubble <= 8) || (bubble >= 10 && bubble <= 17) ||  (bubble >= 19 && bubble <= 20) || (bubble >= 22 && bubble <= 25) ) ) { 
		return false;
	} else if ( ( line === 8 ) && ( (bubble >= 7 && bubble <= 8) || (bubble >= 13 && bubble <= 14) || (bubble >= 19 && bubble <= 20) ) ) { 
		return false;
	} else if ( (( line >= 9 &&  line <= 19) ) && ( (bubble >= 1 && bubble <= 5) || (bubble >= 22 && bubble <= 26) ) ) { 
		return false;
	} else if ( ( line === 11 || line === 17 ) && ( (bubble >= 7 && bubble <= 20) ) ) { 
		return false;
	} else if ( ( line === 9 || line === 10 ) && ( (bubble === 12 || bubble === 15) ) ) { 
		return false;
	} else if ( ( (line >= 12 && line <= 13) || (line >= 15 && line <= 16) ) && ( (bubble === 9 || bubble === 18) ) ) { 
		return false;
	} else if ( line === 14 && ( (bubble >= 7 && bubble <= 9) || (bubble >= 18 && bubble <= 20) ) ) { 
		return false;
	} else if ( (line === 18 || line === 19) && ( bubble === 9 || bubble === 18) ) { 
		return false;
	} else if ( ( line >= 9 && line <= 10 ) && ( (bubble >= 7 && bubble <= 11) || (bubble >= 16 && bubble <= 20) ) ) { 
		return false;
	} else if ( (( line >= 11 && line <= 13) || (line >= 15 && line <= 19) ) && ( (bubble >= 7 && bubble <= 8) || (bubble >= 19 && bubble <= 20) ) ) { 
		return false;
	} else if ( ( (line >= 12 && line <= 16) || (line >= 18 && line <= 19) ) && ( bubble >= 10 && bubble <= 17) ) { 
		return false;
	} else if ( (line === 23) && ( (bubble >= 4 && bubble <= 5) || (bubble >= 22 && bubble <= 23) ) ) { 
		return false;
	} else if ( (line >= 24 && line <= 25) && ( (bubble >= 1 && bubble <= 2) || (bubble >= 4 && bubble <= 5) || (bubble >= 7 && bubble <= 8) || (bubble >= 10 && bubble <= 17) || (bubble >= 19 && bubble <= 20) || (bubble >= 22 && bubble <= 23) || (bubble >= 25 && bubble <= 26) ) ) { 
		return false;
	} else if ( (line === 26) && ( (bubble >= 7 && bubble <= 8) || (bubble >= 19 && bubble <= 20) ) ) { 
		return false;
	} else if ( (line >= 27 && line <= 28) && ( (bubble >= 2 && bubble <= 11) || (bubble >= 16 && bubble <= 25) ) ) { 
		return false;
	}
	
	return true;
}

function correctionX(x, bubble) { 
	
	if (bubble === 3) { 
		return x + 1;
	} else if (bubble === 6) { 
		return x + 1;
	} else if (bubble === 15) { 
		return x + 1;
	} else if (bubble === 18) { 
		return x + 1;
	} else if (bubble === 21) { 
		return x + 2;
	} else if (bubble === 24) { 
		return x + 2;
	} else if (bubble === 26) { 
		return x + 1;
	}
	return x;
}

function getYFromLine(line) { 
	var y = BUBBLES_Y_START;
	if (line < 8) { 
		y = BUBBLES_Y_START + ( (line - 1) * 18 );
	} else if (line > 7 && line < 15) { 
		y = 150 + ( (line - 8) * 18 );
	} else if (line > 14 && line < 21) { 
		y = 256 + ( (line - 14) * 18 );
	} else if (line > 20 && line < 26) { 
		y = 362 + ( (line - 20) * 18 );
	} else if (line > 25 && line < 29) { 
		y = 452 + ( (line - 25) * 18 );
	} else if (line === 29) { 
		y = BUBBLES_Y_END;
	}

	return y;
}