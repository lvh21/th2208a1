function Boxes() {
  let box1Element = document.getElementById(
    "box-" + document.getElementById("select-1").value
  );
  let box2Element = document.getElementById(
    "box-" + document.getElementById("select-2").value
  );

  document.getElementById("new-container").innerHTML = "";
  var clone1 = box1Element.cloneNode(true);
  var clone2 = box2Element.cloneNode(true);
  document.getElementById("new-container").appendChild(clone1);
  document.getElementById("new-container").appendChild(clone2);
}

function Display(canvas) {
  var context = canvas.getContext("2d");

  var centerX = 0;
  var centerY = 0;

  var fullTiles = 0;
  var clippedTiles = 0;
  var reusedTiles = 0;

  var textColor = "rgb(0,0,0)";
  var fullColor = "rgb(34,177,76)";
  var clippedColor = "rgb(112,146,190)";
  var reusedColor = "rgb(185,122,87)";
  var spaceColor = "rgb(80,80,80)";
  var backColor = "rgb(245,245,245)";

  var normalFont = "12px Arial";
  var headerFont = "bold 16px Arial";
  var tileFont = "9px Arial";



  // draw the floor
  function DrawTiles(tile, area, space, scale) {
    // area at drawing scale
    var areaW = area.width * scale;
    var areaH = area.height * scale;

    // floor at drawing scale
    var tileP = space * scale;
    var tileW = tile.width * scale;
    var tileH = tile.height * scale;
    var tileA = tileW * tileH;

    // Espaço utilizado pelo piso.
    var spaceW = tileW + tileP;
    var spaceH = tileH + tileP;

    // Utilização do piso cortado.
    var clipA = 0; // Área de sobra do corte.
    var clipS = 0; // Tamanho de sobra do corte (usado em conjunto com clipT)
    var clipT = false; // Quando 'true' considera a altura, quando 'false' considera a largura.

    // Configurações persistentes.
    context.lineWidth = tileP;
    context.strokeStyle = spaceColor;
    context.font = tileFont;

    for (var x = tileP; x < areaW; x += spaceW) {
      // Se a largura requerida for suficiente para largura do próximo piso inteiro,
      // atribui a largura do piso inteiro. Caso contrário, atribui a largura requerida.
      var reqW = x + tileW <= areaW ? tileW : areaW - (x + tileP);

      for (var y = tileP; y < areaH; y += spaceH) {
        // Se a altura requerida for suficiente para altura do próximo piso inteiro,
        // atribui a altura do piso inteiro. Caso contrário, atribui a altura requerida.
        var reqH = y + tileH <= areaH ? tileH : areaH - (y + tileP);

        // Área requerida.
        var reqA = reqW * reqH;

        // A área requerida é para um piso inteiro.
        if (tileA == reqA) {
          context.fillStyle = fullColor;
          ++fullTiles;
        }
        // A área requerida é menor que um piso inteiro.
        else {
          // A área de corte é suficiente, tamanho do corte é suficiente.
          if (
            clipA - reqA >= 0 &&
            ((clipT && reqW <= clipS) || (!clipT && reqH <= clipS))
          ) {
            context.fillStyle = reusedColor;

            clipA -= reqA;
            clipS -= clipT ? reqW : reqH;

            ++reusedTiles;
          } else {
            //A área ou o tamanho do corte não foi suficiente, seleciona um novo piso.

            context.fillStyle = clippedColor;

            clipA = tileA - reqA;

            // Novo corte na altura.
            if (tileW != reqW) {
              clipS = tileW - reqW;
              clipT = true;
            }
            // Novo corte na largura.
            else if (tileH != reqH) {
              clipS = tileH - reqH;
              clipT = false;
            }

            ++clippedTiles;
          }
        }

        // Desenha o piso.
        context.fillRect(centerX + x, centerY + y, reqW, reqH);

        // Desenha o rejunte.
        context.strokeRect(
          centerX + x - tileP,
          centerY + y - tileP,
          reqW + tileP,
          reqH + tileP
        );
      }
    }
  }

  // Reinicia os dados.
  function Reset() {
    fullTiles = 0;
    clippedTiles = 0;
    reusedTiles = 0;
  }

  // Limpa o canvas.
  this.Clear = function () {
    context.save();

    context.fillStyle = backColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.restore();
  };

  // Desenha a demonstração.
  this.Draw = function (area, tile, space, scale) {
    context.save();
    this.Clear();

    centerY = parseInt((canvas.height - area.height * scale) / 2) - 25;
    centerX = parseInt((canvas.width - area.width * scale) / 2);

    if (tile.width != tile.height) {
      var textA, textB;

      if (tile.width > tile.height) {
        textA = "horizontal";
        textB = "vertical";
      } else {
        textA = "vertical";
        textB = "horizontal";
      }

      // Demonstração A
      Reset();
      centerX -= (area.width * scale) / 2;

      DrawTiles(tile, area, space, scale);
      DrawText(area, scale, "Piso na " + textA);
      DrawLegend(area, scale);

      // Demonstração B
      Reset();
      centerX += area.width * scale + 50;

      DrawTiles({ width: tile.height, height: tile.width }, area, space, scale);
      DrawText(area, scale, "Piso na " + textB);
      DrawLegend(area, scale);
    } else {
      Reset();

      DrawTiles(tile, area, space, scale);
      DrawText(area, scale, "Piso quadrado");
      DrawLegend(area, scale);
    }

    context.restore();
  };
}
var form = document.getElementById('draw-form');
		var canvas = document.getElementById('draw-canvas');
		var display = new Display(canvas);

		canvas.width  = window.innerWidth;
		canvas.height = (window.innerHeight - 100);

		//Suprime o submit do form.
		form.onsubmit = function(){
			return false;
		};

		// Botão calcular.
		form['draw-calc'].onclick = function(){
		
			var area = {
				width: parseInt(form['draw-area-width'].value),
				height: parseInt(form['draw-area-height'].value)
			};

			var tile = {
				width: parseInt(form['draw-tile-width'].value),
				height: parseInt(form['draw-tile-height'].value)
			};

			var space = form['draw-tile-space'].value;

			var scale = ((canvas.height - 225) / (area.height > area.width ? area.height : area.width));

			display.Draw(area, tile, space, scale);
		}
		
		// Botão limpar
		form['draw-clear'].onclick = function(){
			display.Clear();
		}
		
		display.Clear();
