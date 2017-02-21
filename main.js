//создание глобальных переменных
var game = {},i=0,keys = {};

//инструменты для работы с радианными углами
function normalize(rad){
	var norm=rad;
	if (Math.abs(+rad)>Math.PI) {
		var norm=0;
		switch (Math.sign(+rad)) {
			case -1:
				 norm = 2*Math.PI - (+rad % (2*Math.PI));
				break;
			case 1:
				 norm = 2*Math.PI - (+rad % (2*Math.PI));
				break;
		}
		
	}
	return norm
}
//генератор случайных чисел
function getRnd(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
//управление 
window.addEventListener("keydown",
    function(e){
        if (!(e.keyCode in keys)) {
        	keys[e.keyCode]=true;
        }
    },
false);

window.addEventListener('keyup',
    function(e){
        if (e.keyCode in keys) {
    	delete keys[e.keyCode];
	}
    },
false);

//создание главного объекта
window.addEventListener("load",function(){
	window.game = {
		physConst:{
			padSpeed:3.5,
			ballSpeed:7
		},
		mainCnv:document.getElementById("game"),
		mainCnvCtx:document.getElementById("game").getContext("2d"),
		ptsCnv:document.getElementById("points"),
		ptsCnvCtx:document.getElementById("points").getContext("2d"),
		hidCnv:document.getElementById("hidden"),
		hidCnvCtx:document.getElementById("hidden").getContext("2d"),
		fps:60,
		obj:{
			pad1:{
				dir:0,
				left:50,
				top: 225,
				width: 50,
				height: 150
			},

			pad2:{
				dir:0,
				left:700,
				top: 225,
				width: 50,
				height: 150
			},
			ball:{
				dir:0,
				size:20,
				left:390,
				top:290
			}
		},
		players:1,
		outOfBounds:function(){
			if (game.obj.ball.left < game.obj.pad1.left) return 1;
			if (game.obj.ball.left > game.obj.pad2.left + game.obj.pad2.width) return 2;
			if (game.obj.ball.top <= game.physConst.ballSpeed) return 3;
			if (game.obj.ball.top + game.obj.ball.size + game.physConst.ballSpeed>600) return 4;
			return 0;
		},
		moveBall:function() {
			game.obj.ball.left+= Math.cos(game.obj.ball.dir)*game.physConst.ballSpeed;
			game.obj.ball.top -= Math.sin(game.obj.ball.dir)*game.physConst.ballSpeed;
		},
		ballCollision:function(){
			if (game.obj.ball.left <= game.obj.pad1.left + game.obj.pad1.width && game.obj.ball.top>=game.obj.pad1.top && game.obj.ball.top+game.obj.ball.size<= game.obj.pad1.top + game.obj.pad1.height && Math.cos(game.obj.ball.dir))
				return 1;
			if (game.obj.ball.left + game.obj.ball.size >= game.obj.pad2.left && game.obj.ball.top>=game.obj.pad2.top && game.obj.ball.top+game.obj.ball.size<= game.obj.pad2.top + game.obj.pad2.height && Math.cos(game.obj.ball.dir)>0)
				return 2;
			if (game.obj.ball.left <= game.obj.pad1.left + game.obj.pad1.width && Math.abs(game.obj.ball.top-game.obj.pad1.top)<game.obj.ball.size+0.5)
				return 3;
			if (game.obj.ball.left <= game.obj.pad1.left + game.obj.pad1.width && Math.abs(game.obj.ball.top-game.obj.pad1.top - game.obj.pad1.height)<game.obj.ball.size+0.5)
				return 3.5;
			if (game.obj.ball.left + game.obj.ball.size >= game.obj.pad2.left && Math.abs(game.obj.ball.top-game.obj.pad2.top)<game.obj.ball.size+0.5)
				return 4;
			if (game.obj.ball.left + game.obj.ball.size >= game.obj.pad2.left && Math.abs(game.obj.ball.top-game.obj.pad2.top -game.obj.pad2.height)<game.obj.ball.size+0.5)
				return 4.5;
			return 0;

		},
		pCnt:function(n){
			game.players = n
		},
		givePnt:function(n){
			game.points[n-1]++;
		},
		resetBall:function(){
			game.obj.ball={
				dir:0,
				size:20,
				left:390,
				top:290
			};
			game.obj.pad1.top=225;
			game.obj.pad2.top=225;
			game.stop(true);
			setTimeout(game.start,300);
		},
		calculatePhysics:function(){
			//физика pad'ов
			switch(game.players) {
				case 1:
					game.obj.pad1.dir = 0;
					if((87 in keys) || (38 in keys)) {
						game.obj.pad1.dir--;
					}
					if((83 in keys) || (40 in keys)) {
						game.obj.pad1.dir++;
					}
					
					game.obj.pad2.dir =  -Math.sign(game.obj.pad2.top + 0.5*game.obj.pad2.width - game.obj.ball.top - 0.5*game.obj.ball.size);
					break;
				case 2:
					game.obj.pad1.dir = 0
					if(87 in keys) {
						game.obj.pad1.dir--;
					}
					if(83 in keys) {
						game.obj.pad1.dir++;
					}
					game.obj.pad2.dir = 0
					if(38 in keys){
						game.obj.pad2.dir--;
					}
					if(40 in keys) {
						game.obj.pad2.dir++;
					}
					break;
				}
				if ((game.obj.pad1.top>-game.physConst.padSpeed*game.obj.pad1.dir) &&((game.obj.pad1.top + game.obj.pad1.height + game.physConst.padSpeed*game.obj.pad1.dir)<600)){
					game.obj.pad1.top += game.physConst.padSpeed*game.obj.pad1.dir
				}
				if ((game.obj.pad2.top>-game.physConst.padSpeed*game.obj.pad2.dir) &&((game.obj.pad2.top + game.obj.pad2.height + game.physConst.padSpeed*game.obj.pad2.dir)<600)){
					game.obj.pad2.top += game.physConst.padSpeed*game.obj.pad2.dir
				}
				//физика мяча
				//мяч не дивжется
				if (game.obj.ball.dir == 0) {
					do {game.obj.ball.dir = getRnd(-30,30)*0.1;}
					while (Math.abs(Math.tan(game.obj.ball.dir)) > 2)
				}
				//мяч уже движется
				else { 
					var res = game.outOfBounds(); 
					if (res) console.log(res);
						switch(res) {
							case 1: game.givePnt(2);
									game.resetBall();
								break;
							case 2: game.givePnt(1);
									game.resetBall();
								break;
							case 3: 
									console.log(game.obj.ball.dir);
									if(Math.sin(game.obj.ball.dir) > 0) game.obj.ball.dir = -normalize(2*Math.PI-normalize(game.obj.ball.dir));
								break;
							case 4:
									console.log(game.obj.ball.dir);
									if(Math.sin(game.obj.ball.dir) < 0) game.obj.ball.dir = normalize(2*Math.PI-normalize(game.obj.ball.dir));
									console.log(game.obj.ball.dir);
								break;
						}
					}						
						switch (game.ballCollision()) {
							case 1:game.obj.ball.dir = Math.PI-game.obj.ball.dir
								game.obj.ball.left+=game.physConst.ballSpeed;
								break;
							case 2:game.obj.ball.dir = Math.PI-game.obj.ball.dir
								game.obj.ball.left-=game.physConst.ballSpeed;
								break;
							case 3:
								game.obj.ball.dir = Math.PI / 4;
								break;
							case 3.5:
								game.obj.ball.dir = -Math.PI / 4;
								break;
							case 4:
								game.obj.ball.dir = Math.PI * 0.8;
								break;
							case 4.5:
								game.obj.ball.dir = -Math.PI* 0.8;
								break;
						}
					game.moveBall();
				},
		redrawGame:function(){
        	var Ctx = game.hidCnvCtx;
			Ctx.clearRect(0, 0, game.mainCnv.width, game.mainCnv.height);
			Ctx.fillStyle="#FFFFFF";
			var pad1 = game.obj.pad1;
			Ctx.fillRect(pad1.left,pad1.top,pad1.width,pad1.height);
			var pad2 = game.obj.pad2
			Ctx.fillRect(pad2.left,pad2.top,pad2.width,pad2.height);
			var ball = game.obj.ball
			Ctx.fillRect(ball.left,ball.top,ball.size,ball.size);
			game.mainCnvCtx.clearRect(0,0,800,600);
			game.mainCnvCtx.drawImage(game.hidCnv, 0, 0);
		},
		points:new Array(0,0),
		start:function(){
			game.interval = setInterval(game.reDraw,1000/game.fps)
			document.getElementById("menu").style.display="none";
			var pause =document.getElementById("pause").disabled = false
		},
		stop:function(bool){
			clearInterval(game.interval);
			game.interval = 0;
			if (!bool) document.getElementById("menu").style.display="block"
			else {
				var pause =document.getElementById("pause").disabled = true
			}
		},
		pause:function() {
			if (game.interval) {
				game.stop()
			}
			else game.start();
		},
		reDraw:function(){
			game.calculatePhysics();
			game.redrawGame();
			game.redrawPoints();
		},
		redrawPoints:function(){
			var Ctx = game.hidCnvCtx;
			Ctx.font = "64px Arial";
			Ctx.fillText(game.points[0],50,75)
			Ctx.fillText(game.points[1],650,75)
			game.ptsCnvCtx.clearRect(0,0,800,600);
			game.ptsCnvCtx.drawImage(game.hidCnv, 0, 0);
		}}
		game.start();
	})