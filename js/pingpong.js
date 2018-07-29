/**
 * 
 * @authors ship (you@example.org)
 * @date    2018-07-28 22:18:51
 * @version 1.0
 */
var KEY ={
	UP: 38,
	DOWN: 40,
	W: 87,
	S: 83
}

var pingpong = {
	scoreA : 0,
	scoreB : 0,
	gameover : false,
	winner : "",
	finalScore : 10 // 达到多少比分游戏结束
};
pingpong.pressedkeys = [];
pingpong.ball = {
	speed: 5,
	x: 150,
	y: 100,
	directionX: 1,//1:X轴正方向移动 -1反方向
	directionY: 1 //1:Y轴正方向移动 -1反方向
};


$(function(){
	// $("#paddleB").css("top","20px");
	// $("#paddleA").css("top","70px");

	//监听按键事件 不支持同时按键
	// $(document).keydown(function(e){
	// 	console.log(e.which);
	// 	switch(e.which){
	// 		case KEY.UP://向上键
	// 		//获取球拍B的当前top值并转化为int类型
	// 		var top = parseInt($("#paddleB").css("top"));
	// 		//球拍向上移动5个像素
	// 		$("#paddleB").css("top",top-5);
	// 		break;

	// 		case KEY.DOWN://向下键
	// 		var top = parseInt($("#paddleB").css("top"));
	// 		$("#paddleB").css("top",top+5);
	// 		break;

	// 		case KEY.W: //w键
	// 		var top = parseInt($("#paddleA").css("top"));
	// 		$("#paddleA").css("top",top-5);
	// 		break;

	// 		case KEY.S://s键
	// 		var top = parseInt($("#paddleA").css("top"));
	// 		$("#paddleA").css("top",top+5);
	// 		break;
	// 	}
	// });

	//设置interval用于每30毫秒调用一次gameloop
	pingpong.timer = setInterval(gameloop,30);

	//标记pressedkeys数组里某按键的状态是按下还是放开
	$(document).keydown(function(e){
		pingpong.pressedkeys[e.which] = true;
	});

	$(document).keyup(function(e){
		pingpong.pressedkeys[e.which] = false;
	});
});

function gameloop(){
	if (!pingpong.gameover) {
		moveBall();
		movepaddles();
	}
		
}

function movepaddles(){
	//使用自定义定时器不断检测是否有按键按下
	if(pingpong.pressedkeys[KEY.UP]){
		//获取球拍B的当前top值并转化为int类型
		var top = parseInt($("#paddleB").css("top"));
		//球拍向上移动5个像素
		$("#paddleB").css("top",top-5);
	}

	if (pingpong.pressedkeys[KEY.DOWN]) {
		var top = parseInt($("#paddleB").css("top"));
		$("#paddleB").css("top",top+5);
	}

	if (pingpong.pressedkeys[KEY.W]) {
		var top = parseInt($("#paddleA").css("top"));
		$("#paddleA").css("top",top-5);
	}

	if (pingpong.pressedkeys[KEY.S]) {
		var top = parseInt($("#paddleA").css("top"));
		$("#paddleA").css("top",top+5);
	}
}

//移动球的逻辑
function moveBall(){
	//需要引用的变量
	var playgroundHeight = parseInt($("#playground").height());
	var playgroundWidth = parseInt($("#playground").width());

	var ball = pingpong.ball;

	//检测球台边缘
	//检测底边
	if(ball.y + ball.speed*ball.directionY > playgroundHeight){
		ball.directionY = -1;
	}
	//检测顶边
	if (ball.y + ball.speed*ball.directionY < 0) {
		ball.directionY = 1;
	}
	//检测右边
	if (ball.x + ball.speed*ball.directionX > playgroundWidth) {
		// ball.directionX = -1;
		//玩家B丢分
		pingpong.scoreA++;
		$("#scoreA").html(pingpong.scoreA);
		
		//重置球
		ball.x = 250;
		ball.y = 100;
		$("#ball").css({
			"left": ball.x,
			"top": ball.y
		});
		ball.directionX = -1;
		//检测是否结束
		if (pingpong.scoreA == 10) {
			pingpong.gameover = true;
			pingpong.winner = "PlayerA";
			swal({ 
			  title: pingpong.winner+" wins！", 
			  text: "refresh(F5) to start the next game",
			  imageUrl: "image/thumbs-up.jpg" 
			});
			
			return;
		}
	}
	//检测左边
	if (ball.x + ball.speed*ball.directionX < 0) {
		// ball.directionX = 1;
		//玩家A丢分
		pingpong.scoreB++;
		$("#scoreB").html(pingpong.scoreB);
		
		//重置球
		ball.x = 150;
		ball.y = 100;
		$("#ball").css({
			"left": ball.x,
			"top": ball.y
		});
		ball.directionX = 1;
		//检测是否结束
		if (pingpong.scoreB == 10) {
			pingpong.gameover = true;
			pingpong.winner = "PlayerB";
			swal({ 
			  title: pingpong.winner+" wins！", 
			  text: "refresh(F5) to start the next game",
			  imageUrl: "image/thumbs-up.jpg" 
			});
			
			return;
		}
	}

	ball.x += ball.speed*ball.directionX;
	ball.y += ball.speed*ball.directionY;

	//todo 检测球拍
	//检测左边球拍
	var paddleAX = parseInt($("#paddleA").css("left"))+parseInt($("#paddleA").width());
	var paddleABottom = parseInt($("#paddleA").css("top")) + parseInt($("#paddleA").height());
	var paddleATop = parseInt($("#paddleA").css("top"));
	if (ball.x + ball.speed*ball.directionX < paddleAX) {//即将穿过球拍
		if (ball.y + ball.speed*ball.directionY <= paddleABottom && ball.y + ball.speed*ball.directionY >= paddleATop) {//且落点在球拍上
			ball.directionX = 1;
		}
	}

	//检测右边球拍
	var paddleBX = parseInt($("#paddleB").css("left"));
	var paddleBBottom = parseInt($("#paddleB").css("top")) + parseInt($("#paddleB").height());
	var paddleBTop = parseInt($("#paddleB").css("top"));
	if (ball.x + ball.speed*ball.directionX >= paddleBX) {
		if (ball.y + ball.speed*ball.directionY <= paddleBBottom && ball.y + ball.speed*ball.directionY >= paddleBTop) {
			ball.directionX = -1;
		}
	}
	//根据速度与方向移动乒乓球
	$("#ball").css({
		"top":ball.y,
		"left":ball.x
	});
}



