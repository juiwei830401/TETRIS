var app = angular.module('myTETRIS', []);
app.controller('TETRIS', function ($rootScope, $scope, $controller, $filter, $timeout) {
	
	/**
	 * ===================================初始===================================
	 */
	
	////標題
	//var canvas_title = document.getElementById("tetris_title");
	//var ctx_title = canvas_title.getContext("2d");
	//主區域
	var canvas = document.getElementById("tetris");
	var ctx = canvas.getContext("2d");
	//預告區域
	var canvas_next = document.getElementById("tetris_next");
	var ctx_next = canvas_next.getContext("2d");
	//備用區域
	var canvas_spare = document.getElementById("tetris_spare");
	var ctx_spare = canvas_spare.getContext("2d");
	
	$scope.isGameOver = true;		//結束判斷
	$scope.isGamePause = false;		//暫停判斷
	$scope.TETRIS = {};				//方塊種類
	$scope.STYLE = {};				//每一格、線長寬
	$scope.COLOR = {};				//顏色
	$scope.TETRIMINO = {};			//方塊長寬
	$scope.KEY = {};				//按鍵陣列
	$scope.STATUS = {};				//陣列有無
	$scope.DIRECTION = {};			//按鍵按鍵
	$scope.KEY_LOCK = {};			//按鍵狀態
	$scope.tetrisArray = [];		//主區域陣列
	$scope.tetrimino_main = {};		//方塊陣列
	$scope.DATA = {};				//數據陣列
	
	////標題:一次性繪製
	//canvas_title.width = 400;
	//canvas_title.height = 80;
	//ctx_title.globalAlpha = 1;
	//ctx_title.fillStyle = "rgb(0,0,255)";
	//ctx_title.beginPath();
	//ctx_title.textAlign = "center";
	//ctx_title.font = "80px Arial";
	//ctx_title.fillText("TETRIS", canvas_title.width/2, canvas_title.height);
	//ctx_title.closePath();
	//ctx_title.stroke();
	//ctx_title.fill();
		
	$scope.init = function(){
		canvas = document.getElementById("tetris");
		ctx = canvas.getContext("2d");
		canvas_next = document.getElementById("tetris_next");
		ctx_next = canvas_next.getContext("2d");
		canvas_spare = document.getElementById("tetris_spare");
		ctx_spare = canvas_spare.getContext("2d");
		document.getElementById("score").innerHTML = 0;
		document.getElementById("level").innerHTML = '1';

		//主區域長寬格數
		$scope.TETRIS = {width: 10, height: 21};
		
		//每一格、線長寬
		$scope.STYLE = {
			//線寬。
			linePixel: 3,
			//每一個格子的寬度。（包括線的部分）
			gridPixel: 28,
			//擦掉最上面幾行。
			eraseLineCount: 1
		}
		
		//顏色
		$scope.COLOR = {
			//背景線的顏色。
			stoke: "rgb(34,34,34)",
			//雙色相間的背景格子色。
			fill: ["rgb(43,43,43)", "rgb(47,47,47)"],
			//預先顯示掉落處的格子色。
			dropFill: "rgb(102,102,102)",
			dropFillAlpha: 0.5,
			//依照不同種類的俄羅斯方塊給予不同的顏色。
			TETRIMINO: {
				I: "rgb(150, 200, 250)",
				J: "rgb(0, 100, 200)",
				L: "rgb(250, 150, 0)",
				O: "rgb(255, 100, 100)",
				S: "rgb(150, 250, 150)",
				T: "rgb(250, 200, 250)",
				Z: "rgb(200, 100, 200)"
			}
		};
		
		//數據陣列
		$scope.DATA = {
			//計分
			score: 0,
			//按鍵點擊限制(1000 = 1秒)
			lock_time: 50,
			//下降速度(1000 = 1秒)
			level: 1000
		}
		
		//方塊設定(4種方向的形狀)
		$scope.TETRIMINO = {
			I: [["0,1", "1,1", "2,1", "3,1"], ["2,0", "2,1", "2,2", "2,3"], ["0,2", "1,2", "2,2", "3,2"], ["1,0", "1,1", "1,2", "1,3"]],
			J: [["0,0", "0,1", "1,1", "2,1"], ["1,0", "2,0", "1,1", "1,2"], ["0,1", "1,1", "2,1", "2,2"], ["0,2", "1,0", "1,1", "1,2"]],
			L: [["0,1", "1,1", "2,1", "2,0"], ["1,0", "1,1", "1,2", "2,2"], ["0,1", "0,2", "1,1", "2,1"], ["0,0", "1,0", "1,1", "1,2"]],
			O: [["1,0", "2,0", "1,1", "2,1"], ["1,0", "2,0", "1,1", "2,1"], ["1,0", "2,0", "1,1", "2,1"], ["1,0", "2,0", "1,1", "2,1"]],
			S: [["1,0", "2,0", "0,1", "1,1"], ["1,0", "1,1", "2,1", "2,2"], ["1,1", "2,1", "0,2", "1,2"], ["0,0", "0,1", "1,1", "1,2"]],
			T: [["0,1", "1,0", "1,1", "2,1"], ["1,0", "1,1", "1,2", "2,1"], ["0,1", "1,1", "2,1", "1,2"], ["0,1", "1,0", "1,1", "1,2"]],
			Z: [["0,0", "1,0", "1,1", "2,1"], ["1,1", "1,2", "2,0", "2,1"], ["0,1", "1,1", "1,2", "2,2"], ["0,1", "0,2", "1,0", "1,1"]]
		};
		
		//按鍵設定
		$scope.KEY = {
			ENTER: "Enter",
			SPACE: " ",
			Z: "z",
			X: "x",
			C: "c",
			P: "p",
			ARROW_UP: "ArrowUp",
			ARROW_RIGHT: "ArrowRight",
			ARROW_DOWN: "ArrowDown",
			ARROW_LEFT: "ArrowLeft"
		}
		
		//按鍵狀態:0=開，1=鎖
		$scope.KEY_LOCK = {
			ENTER: 0,
			SPACE: 0,
			Z: 0,
			X: 0,
			C: 0,
			P: 0,
			ARROW_UP: 0,
			ARROW_RIGHT: 0,
			ARROW_DOWN: 0,
			ARROW_LEFT: 0
		}
		
		//狀態:0=無，1=有
		$scope.STATUS = {
			EMPTY: 0,
			OCCUPIED: 1
		};
		
		//方塊動作
		$scope.DIRECTION = {
			ANTICLOCKWISE: 0,
			CLOCKWISE: 1,
			UP: 2,
			RIGHT: 3,
			DOWN: 4,
			LEFT: 5
		}
		
		/**-------------------------------------------------------**/
		//主區域二維陣列
		$scope.tetrisArray = new Array($scope.TETRIS.width);
		for (var x = 0; x < $scope.tetrisArray.length; x++) {
			$scope.tetrisArray[x] = new Array($scope.TETRIS.height);
		}
		//主區域長寬
        canvas.width = $scope.TETRIS.width * $scope.STYLE.gridPixel;
        canvas.height = $scope.TETRIS.height * $scope.STYLE.gridPixel;
		//初始化。
		for (var x = 0; x < $scope.tetrisArray.length; x++) {
			for (var y = 0; y < $scope.tetrisArray[x].length; y++) {
				$scope.tetrisArray[x][y] = {
					status: $scope.STATUS.EMPTY
				};
			}
		}
		/**-------------------------------------------------------**/
		//預告區域二維陣列
		$scope.tetrisArray_next = new Array(4);
		for (var x = 0; x < 4; x++) {
			$scope.tetrisArray_next[x] = new Array(2);
		}
		//預告區域長寬
		canvas_next.width = 4 * $scope.STYLE.gridPixel;
		canvas_next.height = 2 * $scope.STYLE.gridPixel;
		//初始化。
		for (var x = 0; x < $scope.tetrisArray_next.length; x++) {
			for (var y = 0; y < $scope.tetrisArray_next[x].length; y++) {
				$scope.tetrisArray_next[x][y] = {
					status: $scope.STATUS.EMPTY
				};
			}
		}
		/**-------------------------------------------------------**/
		//備用區域二維陣列
		$scope.tetrisArray_spare = new Array(4);
		for (var x = 0; x < 4; x++) {
			$scope.tetrisArray_spare[x] = new Array(2);
		}
		//備用區域長寬
		canvas_spare.width = 4 * $scope.STYLE.gridPixel;
		canvas_spare.height = 2 * $scope.STYLE.gridPixel;
		//初始化。
		for (var x = 0; x < $scope.tetrisArray_spare.length; x++) {
			for (var y = 0; y < $scope.tetrisArray_spare[x].length; y++) {
				$scope.tetrisArray_spare[x][y] = {
					status: $scope.STATUS.EMPTY
				};
			}
		}
		/**-------------------------------------------------------**/
		
		//預告方塊初始化
		$scope.next_init();
		//方塊初始化
		$scope.tetrmino_init();
		//備用方塊初始化
		$scope.spare_init();
	}
	
	/**
	 * ==============================預告方塊初始化==============================
	 */
	$scope.next_init = function(){
		//隨機取得方塊
		var typeArray = Object.keys($scope.TETRIMINO);
		var index = Math.floor(Math.random() * typeArray.length);
		$scope.tetrimino_next = {
			type : typeArray[index],
			direction : 0,
			positionX : 0,
			positionY : 0
		}
		$scope.redraw_next();
	}
	
	/**
	 * ================================方塊初始化================================
	 */
	$scope.tetrmino_init = function(){
		//取預告區域的方塊
		$scope.tetrimino_main = {
			type : angular.copy($scope.tetrimino_next.type),
			direction : 0,
			positionX : 3,
			positionY : 0
		}
		$scope.redraw();
		$scope.next_init();
	}
	
	/**
	 * ==============================備用方塊初始化==============================
	 */
	$scope.spare_init = function(){
		$scope.tetrimino_spare = {
			type : '',
			direction : 0,
			positionX : 0,
			positionY : 0
		}
		$scope.redraw_spare();
	}
	
	/**
	 * ===================================開始===================================
	 */
	$scope.start = function(){
		$scope.isGameOver = false;
		//每秒往下一格。
		$scope.redraw();
		$scope.interval = setInterval(function () {
			var event = new Event('keydown');
			event.key = $scope.KEY.ARROW_DOWN;
			document.dispatchEvent(event);
		}, $scope.DATA.level);
		$scope.isGamePause = false;
	}
	
	/**
	 * ===================================結束===================================
	 */
	$scope.gameOver = function () {
		$scope.isGameOver = true;
		clearInterval($scope.interval);
		$scope.pause("GAME OVER");
		
	};
	
	/**
	 * ===================================暫停===================================
	 */
	 $scope.pause = function (text) {
		clearInterval($scope.interval);
		
		//背景
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.beginPath();
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		//最上面幾行擦掉。
		ctx.clearRect(0, 0, $scope.TETRIS.width * $scope.STYLE.gridPixel, $scope.STYLE.eraseLineCount * $scope.STYLE.gridPixel);
		
		//字
		ctx.globalAlpha = 1;
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.beginPath();
		ctx.textAlign = "center";
		ctx.font = "40px Arial";
		ctx.fillText(text, canvas.width/2, canvas.height/3);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		$scope.isGamePause = true;
	};
	
	/**
	 * ============================繪製方塊(預告區域)============================
	 */
	$scope.redraw_next = function(){
		//清空全部。
		ctx_next.clearRect(0, 0, 4 * $scope.STYLE.gridPixel, 2 * $scope.STYLE.gridPixel);
		
		//預告區域繪製
		ctx_next.globalAlpha = 1;
		ctx_next.lineWidth = $scope.STYLE.linePixel;
		ctx_next.strokeStyle = $scope.COLOR.stoke;
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 2; y++) {
				var getcolor = $scope.getColor($scope.tetrisArray_next, x, y);	
				$scope.drawGrid(ctx_next, x, y, getcolor, $scope.STYLE.gridPixel, $scope.STYLE.linePixel);
			}
		}
		
		//如果遊戲已經結束，就不需要再畫了。
		if (!$scope.isGameOver) {
			//畫出來 tetrimino 的部分。
			var gridPosition = $scope.TETRIMINO[$scope.tetrimino_next.type][$scope.tetrimino_next.direction];
			for (var i = 0; i < gridPosition.length; i++) {
				var position = gridPosition[i].split(",");
				var x = Number(position[0]) + $scope.tetrimino_next.positionX;
				var y = Number(position[1]) + $scope.tetrimino_next.positionY;
				$scope.drawGrid(ctx_next, x, y, $scope.COLOR.TETRIMINO[$scope.tetrimino_next.type], $scope.STYLE.gridPixel, $scope.STYLE.linePixel);
			}
		}
	}
	
	/**
	 * =============================繪製方塊(主區域)=============================
	 */
	$scope.redraw = function(){
		//清空全部。
		ctx.clearRect(0, 0, $scope.TETRIS.width * $scope.STYLE.gridPixel, $scope.TETRIS.height * $scope.STYLE.gridPixel);
		
		//主區域繪製
		ctx.lineWidth = $scope.STYLE.linePixel;
		ctx.strokeStyle = $scope.COLOR.stoke;
		for (var x = 0; x < $scope.TETRIS.width; x++) {
			for (var y = 0; y < $scope.TETRIS.height; y++) {
				var getcolor = $scope.getColor($scope.tetrisArray, x, y);	
				$scope.drawGrid(ctx, x, y, getcolor, $scope.STYLE.gridPixel, $scope.STYLE.linePixel);
			}
		}
		
		//如果遊戲已經結束，就不需要再畫了。
		if (!$scope.isGameOver) {
			//畫出來 tetrimino 預先顯示掉落處的部分。
			ctx.globalAlpha = $scope.COLOR.dropFillAlpha;
			var dropPosition = $scope.getDropPosition();
			var gridPosition = $scope.TETRIMINO[$scope.tetrimino_main.type][$scope.tetrimino_main.direction];
			for (var i = 0; i < gridPosition.length; i++) {
				var position = gridPosition[i].split(",");
				var x = Number(position[0]) + dropPosition[0];
				var y = Number(position[1]) + dropPosition[1];
				$scope.drawGrid(ctx, x, y, $scope.COLOR.dropFill, $scope.STYLE.gridPixel, $scope.STYLE.linePixel);
			}
			//畫出來 tetrimino 的部分。
			ctx.globalAlpha = 1;
			var gridPosition2 = $scope.TETRIMINO[$scope.tetrimino_main.type][$scope.tetrimino_main.direction];
			for (var i = 0; i < gridPosition2.length; i++) {
				var position = gridPosition2[i].split(",");
				var x = Number(position[0]) + $scope.tetrimino_main.positionX;
				var y = Number(position[1]) + $scope.tetrimino_main.positionY;
				$scope.drawGrid(ctx, x, y, $scope.COLOR.TETRIMINO[$scope.tetrimino_main.type], $scope.STYLE.gridPixel, $scope.STYLE.linePixel);
			}
			
		}
		//最上面幾行擦掉。
		ctx.clearRect(0, 0, $scope.TETRIS.width * $scope.STYLE.gridPixel, $scope.STYLE.eraseLineCount * $scope.STYLE.gridPixel);
       
	}
	
	/**
	 * ============================繪製方塊(備用區域)============================
	 */
	$scope.redraw_spare = function(){
		//清空全部。
		ctx_spare.clearRect(0, 0, 4 * $scope.STYLE.gridPixel, 2 * $scope.STYLE.gridPixel);
		
		//預告區域繪製
		ctx_spare.globalAlpha = 1;
		ctx_spare.lineWidth = $scope.STYLE.linePixel;
		ctx_spare.strokeStyle = $scope.COLOR.stoke;
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 2; y++) {
				var getcolor = $scope.getColor($scope.tetrisArray_spare, x, y);	
				$scope.drawGrid(ctx_spare, x, y, getcolor, $scope.STYLE.gridPixel, $scope.STYLE.linePixel);
			}
		}
		
		//如果遊戲已經結束，就不需要再畫了。
		if (!$scope.isGameOver) {
			//畫出來 tetrimino 的部分。
			var gridPosition = $scope.TETRIMINO[$scope.tetrimino_spare.type][$scope.tetrimino_spare.direction];
			for (var i = 0; i < gridPosition.length; i++) {
				var position = gridPosition[i].split(",");
				var x = Number(position[0]) + $scope.tetrimino_spare.positionX;
				var y = Number(position[1]) + $scope.tetrimino_spare.positionY;
				$scope.drawGrid(ctx_spare, x, y, $scope.COLOR.TETRIMINO[$scope.tetrimino_spare.type], $scope.STYLE.gridPixel, $scope.STYLE.linePixel);
			}
		}
	}
	
	/**
	 * ===============================取得該格顏色===============================
	 */
    $scope.getColor = function(tetrisArray, x, y) {
        var grid = tetrisArray[x][y];
        if (grid.status == $scope.STATUS.EMPTY) {
            return $scope.COLOR.fill[(x + y) % 2];
        } else if ("color" in grid) {
            return grid.color;
        } else {
            throw new Error("don't know what color it should be. grid[" + x + "][" + y + "]:" + JSON.stringify(grid));
        }
    }
	
	/**
	 * =============================取得掉落處的座標=============================
	 */
     $scope.getDropPosition = function() {
		var main = angular.copy($scope.tetrimino_main);
        while (!$scope.isCollision(main)) {
			main.positionY++;
        }
		main.positionY--;
        return [main.positionX, main.positionY]
    }
	
	/**
	 * ============================區域畫格(一次一格)============================
	 */
    $scope.drawGrid = function(ctx, x, y, fillStyle, gridPixel, linePixel) {
        var startPositionX = gridPixel * x + linePixel / 2;
        var startPositionY = gridPixel * y + linePixel / 2;
        //雙色相間的背景格子色。
        ctx.fillStyle = fillStyle;

        ctx.beginPath();
        ctx.moveTo(startPositionX, startPositionY);
        ctx.lineTo(startPositionX + gridPixel - linePixel, startPositionY);
        ctx.lineTo(startPositionX + gridPixel - linePixel, startPositionY + gridPixel - linePixel);
        ctx.lineTo(startPositionX, startPositionY + gridPixel - linePixel);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
	
	/**
	 * =================================方塊消除=================================
	 */
    $scope.checkAndDestroyLine = function () {
        var newTetrisArray = JSON.parse(JSON.stringify($scope.tetrisArray));
        //紀錄目前有幾行滿行。
        var fullLineCount = 0;
        for (var y = $scope.TETRIS.height - 1; 0 <= y; y--) {
            var isFull = true;
            for (var x = 0; x < $scope.TETRIS.width; x++) {
                if (fullLineCount <= y) {
                    //如果下面的有滿行就往下補。
                    if (fullLineCount > 0) {
                        newTetrisArray[x][y + fullLineCount] = $scope.tetrisArray[x][y];
                    }
                    if ($scope.tetrisArray[x][y].status != $scope.STATUS.OCCUPIED) {
                        isFull = false;
                    }
                } else {
                    //依據 fullLineCount 最上面幾行直接給予空行。
                    newTetrisArray[x][y] = {
                        status: $scope.STATUS.EMPTY
                    };
                }
            }
            if (isFull) {
                fullLineCount++;
				$scope.score_change(1000);
            }
        }
		
        $scope.tetrisArray = newTetrisArray;
    };
	
	
	/**
	 * =================================方塊移動=================================
	 */
	$scope.move = function(direction){
		switch(direction){
			case $scope.DIRECTION.RIGHT:
				$scope.tetrimino_main.positionX++;
				break;
			case $scope.DIRECTION.LEFT:
				$scope.tetrimino_main.positionX--;
				break;
			case $scope.DIRECTION.DOWN:
				$scope.tetrimino_main.positionY++;
				break;
			case $scope.DIRECTION.UP:
				$scope.tetrimino_main.positionY--;
				break;
		}
	}
	
	/**
	 * =================================方塊旋轉=================================
	 */
	$scope.rotate = function(direction){
		var directionArray = $scope.TETRIMINO[$scope.tetrimino_main.type];
		switch(direction){
			case $scope.DIRECTION.ANTICLOCKWISE:
				$scope.tetrimino_main.direction = ($scope.tetrimino_main.direction + (directionArray.length - 1)) % directionArray.length;
				break;
			case $scope.DIRECTION.CLOCKWISE:
				$scope.tetrimino_main.direction = ($scope.tetrimino_main.direction + 1) % directionArray.length;
				break;
		}
	}
	
	/**
	 * =================================方塊調換=================================
	 */
	$scope.change = function(){
		var main = angular.copy($scope.tetrimino_main.type);
		var spare = angular.copy($scope.tetrimino_spare.type);
		var next = angular.copy($scope.tetrimino_next.type);
		
		//備用區域 IS NULL : 備用區域存主方塊，主區域存預告方塊
		if(spare == ''){
			$scope.tetrimino_spare.type = main;
			$scope.tetrimino_main.type = next;
		}
		//備用區域 IS NOT NULL : 備用區域存主方塊，主區域存備用方塊
		else{
			$scope.tetrimino_spare.type = main;
			$scope.tetrimino_main.type = spare;
		}
	}
	
	/**
	 * =================================碰撞檢查=================================
	 */
	$scope.isCollision = function(main){
		var gridPosition = [];
		gridPosition = $scope.TETRIMINO[main.type][main.direction];
		for (var i = 0; i < gridPosition.length; i++) {
			var position = gridPosition[i].split(",");
            var x = Number(position[0]) + main.positionX;
			var y = Number(position[1]) + main.positionY;
			
			if (x < 0 || ($scope.TETRIS.width - 1) < x) {
				return true;
			}
			if (y < 0 || ($scope.TETRIS.height - 1) < y) {
				return true;
			}
			if ($scope.tetrisArray[x][y].status == $scope.STATUS.OCCUPIED) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * =================================按鍵操作=================================
	 */
	document.addEventListener('keydown', function (event) {
		var key = event.key;
		switch (key) {
			//開始
			case $scope.KEY.ENTER:
				if($scope.KEY_LOCK.ENTER == 1){
					return;
				}
				if($scope.isGameOver){
					if($scope.isGamePause){
						$scope.init();
					}
					$scope.start();
					$scope.next_init();
				}
				
				//鎖鍵
				$scope.KEY_LOCK.ENTER = 1;
				break;
				
			//暫停
			case $scope.KEY.P:
				if($scope.isGameOver || $scope.KEY_LOCK.P == 1){
					return;
				}

				//停止=>開始
				if($scope.isGamePause){
					$scope.start();
				}
				//開始=>停止
				else{
					$scope.pause('PAUSE');
				}
				
				//鎖鍵
				$scope.KEY_LOCK.P = 1;
				break;
			
			//逆時針旋轉
			case $scope.KEY.Z:
				if($scope.isGameOver || $scope.KEY_LOCK.Z == 1){
					return;
				}
				$scope.rotate($scope.DIRECTION.ANTICLOCKWISE);
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.rotate($scope.DIRECTION.CLOCKWISE);
				} else {
					$scope.redraw();
				}

				//僅限$scope.DATA.level 200以上
				if($scope.DATA.level > 200){
					//鎖鍵
					$scope.KEY_LOCK.Z = 1;
				}
				break;
				
			//順時針旋轉
			case $scope.KEY.X:
				if($scope.isGameOver || $scope.KEY_LOCK.X == 1){
					return;
				}
				$scope.rotate($scope.DIRECTION.CLOCKWISE);
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.rotate($scope.DIRECTION.ANTICLOCKWISE);
				} else {
					$scope.redraw();
				}

				//僅限$scope.DATA.level 200以上
				if($scope.DATA.level > 200){
					//鎖鍵
					$scope.KEY_LOCK.X = 1;
				}
				break;
			
			//調換
			case $scope.KEY.C:
				if($scope.isGameOver || $scope.KEY_LOCK.C == 1){
					return;
				}
				
				//先記錄3區域方塊，以便復原用
				var main = angular.copy($scope.tetrimino_main.type);
				var spare = angular.copy($scope.tetrimino_spare.type);
				var next = angular.copy($scope.tetrimino_next.type);
				
				$scope.change();
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.tetrimino_main.type = main;
					$scope.tetrimino_spare.type = spare;
					$scope.tetrimino_next.type = next;
				} else {
					if(spare == ''){
						$scope.next_init();
					}
					$scope.redraw();
					$scope.redraw_spare();
				}

				//僅限$scope.DATA.level 200以上
				if($scope.DATA.level > 200){
					//鎖鍵
					$scope.KEY_LOCK.C = 1;
				}
				break;
			
			//↑
			case $scope.KEY.ARROW_UP:
				if($scope.isGameOver || $scope.KEY_LOCK.ARROW_UP == 1){
					return;
				}
				$scope.rotate($scope.DIRECTION.CLOCKWISE);
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.rotate($scope.DIRECTION.ANTICLOCKWISE);
				} else {
					$scope.redraw();
				}

				//僅限$scope.DATA.level 200以上
				if($scope.DATA.level > 200){
					//鎖鍵
					$scope.KEY_LOCK.ARROW_UP = 1;
				}
				break;
			
			//↓
			case $scope.KEY.ARROW_DOWN:
				if($scope.isGameOver || $scope.KEY_LOCK.ARROW_DOWN == 1){
					return;
				}
				$scope.move($scope.DIRECTION.DOWN);
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.move($scope.DIRECTION.UP);
					
					//將$scope.tetrimino_main存入$scope.tetrisArray
					var gridPosition = $scope.TETRIMINO[$scope.tetrimino_main.type][$scope.tetrimino_main.direction];
					for (var i = 0; i < gridPosition.length; i++) {
						var position = gridPosition[i].split(",");
						var x = Number(position[0]) + $scope.tetrimino_main.positionX;
						var y = Number(position[1]) + $scope.tetrimino_main.positionY;
						$scope.tetrisArray[x][y].status = $scope.STATUS.OCCUPIED;
						$scope.tetrisArray[x][y].color = $scope.COLOR.TETRIMINO[$scope.tetrimino_main.type];
					}
					
					$scope.redraw();
					$scope.checkAndDestroyLine();
					$scope.score_change(10);
					//換下一個俄羅斯方塊的時候，如果發生碰撞就代表遊戲結束。
					$scope.tetrmino_init();
					if ($scope.isCollision($scope.tetrimino_main)) {
						$scope.gameOver();
					} else {
						$scope.redraw();
					}
						
				} else {
					$scope.redraw();
				}
				
				//僅限$scope.DATA.level 200以上
				if($scope.DATA.level > 200){
					//鎖鍵
					$scope.KEY_LOCK.ARROW_DOWN = 1;
					//延遲後解鎖
					setTimeout(function(){
						$scope.KEY_LOCK.ARROW_DOWN = 0;
					},$scope.DATA.lock_time);
				}
				break;
			
			//←
			case $scope.KEY.ARROW_LEFT:
				if($scope.isGameOver || $scope.KEY_LOCK.ARROW_LEFT == 1){
					return;
				}
				$scope.move($scope.DIRECTION.LEFT);
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.move($scope.DIRECTION.RIGHT);
				} else {
					$scope.redraw();
				}

				//僅限$scope.DATA.level 200以上
				if($scope.DATA.level > 200){
					//鎖鍵
					$scope.KEY_LOCK.ARROW_LEFT = 1;
					//延遲後解鎖
					setTimeout(function(){
						$scope.KEY_LOCK.ARROW_LEFT = 0;
					},$scope.DATA.lock_time);
				}
				break;
			
			//→
			case $scope.KEY.ARROW_RIGHT:
				if($scope.isGameOver || $scope.KEY_LOCK.ARROW_RIGHT == 1){
					return;
				}
				$scope.move($scope.DIRECTION.RIGHT);
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.move($scope.DIRECTION.LEFT);
				} else {
					$scope.redraw();
				}

				//僅限$scope.DATA.level 200以上
				if($scope.DATA.level > 200){
					//鎖鍵
					$scope.KEY_LOCK.ARROW_RIGHT = 1;
					//延遲後解鎖
					setTimeout(function(){
						$scope.KEY_LOCK.ARROW_RIGHT = 0;
					},$scope.DATA.lock_time);
				}
				break;
			
			//▼
			case $scope.KEY.SPACE:
				if($scope.isGameOver || $scope.KEY_LOCK.SPACE == 1){
					return;
				}
				while (!$scope.isCollision($scope.tetrimino_main)) {
					$scope.move($scope.DIRECTION.DOWN);
				}
				//如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
				if ($scope.isCollision($scope.tetrimino_main)) {
					$scope.move($scope.DIRECTION.UP);
					//將$scope.tetrimino_main存入$scope.tetrisArray
					var gridPosition = $scope.TETRIMINO[$scope.tetrimino_main.type][$scope.tetrimino_main.direction];
					for (var i = 0; i < gridPosition.length; i++) {
						var position = gridPosition[i].split(",");
						var x = Number(position[0]) + $scope.tetrimino_main.positionX;
						var y = Number(position[1]) + $scope.tetrimino_main.positionY;
						$scope.tetrisArray[x][y].status = $scope.STATUS.OCCUPIED;
						$scope.tetrisArray[x][y].color = $scope.COLOR.TETRIMINO[$scope.tetrimino_main.type];
					}
					
					$scope.redraw();
					$scope.checkAndDestroyLine();
					$scope.score_change(20);
					//換下一個俄羅斯方塊的時候，如果發生碰撞就代表遊戲結束。
					$scope.tetrmino_init();
					if ($scope.isCollision($scope.tetrimino_main)) {
						$scope.gameOver();
					} else {
						$scope.redraw();
					}
				} else {
					$scope.redraw();
				}
				//鎖鍵
				$scope.KEY_LOCK.SPACE = 1;
				break;
		}
	});
	
	/**
	 * ========================解鎖按鍵(防止按住連續觸發)========================
	 */
	document.addEventListener('keyup', function (event) {
		var key = event.key;
		switch (key) {
			//開始
			case $scope.KEY.ENTER:
				$scope.KEY_LOCK.ENTER = 0;
				break;
				
			//暫停
			case $scope.KEY.P:
				$scope.KEY_LOCK.P = 0;
				break;
			
			//逆時針旋轉
			case $scope.KEY.Z:
				$scope.KEY_LOCK.Z = 0;
				break;
				
			//順時針旋轉
			case $scope.KEY.X:
				$scope.KEY_LOCK.X = 0;
				break;
			
			//調換
			case $scope.KEY.C:
				$scope.KEY_LOCK.C = 0;
				break;
			
			//↑
			case $scope.KEY.ARROW_UP:
				$scope.KEY_LOCK.ARROW_UP = 0;
				break;
			//▼
			case $scope.KEY.SPACE:
				$scope.KEY_LOCK.SPACE = 0;
				break;
		}
	});
	
	/**
	 * =================================速度分級=================================
	 */
    $scope.level_change = function (){
		if (!$scope.isGameOver) {
			if($scope.DATA.score < 5000){
				$scope.DATA.level = 1000;
				document.getElementById("level").innerHTML = '1';
			}else if($scope.DATA.score < 10000){
				$scope.DATA.level = 900;
				document.getElementById("level").innerHTML = '2';
			}else if($scope.DATA.score < 15000){
				$scope.DATA.level = 800;
				document.getElementById("level").innerHTML = '3';
			}else if($scope.DATA.score < 20000){
				$scope.DATA.level = 700;
				document.getElementById("level").innerHTML = '4';
			}else if($scope.DATA.score < 26000){
				$scope.DATA.level = 600;
				document.getElementById("level").innerHTML = '5';
			}else if($scope.DATA.score < 33000){
				$scope.DATA.level = 500;
				document.getElementById("level").innerHTML = '6';
			}else if($scope.DATA.score < 41000){
				$scope.DATA.level = 400;
				document.getElementById("level").innerHTML = '7';
			}else if($scope.DATA.score < 50000){
				$scope.DATA.level = 300;
				document.getElementById("level").innerHTML = '8';
			}else if($scope.DATA.score < 60000){
				$scope.DATA.level = 200;
				document.getElementById("level").innerHTML = '9';
			}else if($scope.DATA.score < 80000){
				$scope.DATA.level = 100;
				document.getElementById("level").innerHTML = 'MAX';
			}else{
				$scope.DATA.level = 50;
				document.getElementById("level").innerHTML = '--';
			}
			
			clearInterval($scope.interval);
			$scope.start();
		}
    };
	
	$scope.score_change = function (score){
		$scope.DATA.score += score;
		document.getElementById("score").innerHTML = $scope.DATA.score;
		$scope.level_change();
	}
	
	$scope.init();
});
