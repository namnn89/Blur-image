//Term Image
  var srcImage = "http://image.prntscr.com/image/a2f0754e63de4263a607565074472079.jpg";
  drawImg(srcImage);
  var canvas, ghostcanvas, gctx, WIDTH, HEIGHT, blurCanvas;

  var isDown = false;
  var offsetX = offsetY = scrollX = scrollY = 0;
  var ctx, tempCtx;
  var PI2 = Math.PI * 2;
  var arrDrawed, currentDrawed;
  var img;
  var access_blur, is_edit;

  var MAX_WIDTH = MAX_HEIGHT = 500;
  var ratio;

  var imgBlur;

  function drawImg(srcImage) {
  	access_blur = false;
  	$(window).scrollLeft(0);
  	$(window).scrollTop(0);
  	img = new Image();
  	arrDrawed = new Array();
  	currentDrawed = new Array();
  	is_edit = true;
  	if (srcImage.substring(0, 4).toLowerCase() === 'http') {
  		img.crossOrigin = 'anonymous';
  	}

  	img.onload = function() {
  		ghostcanvas = document.createElement('canvas');

  		blurCanvas = document.createElement('canvas');
  		ctxBlur = blurCanvas.getContext("2d");

  		tempCanvas = document.getElementById('tempCanvas');
  		tempCtx = tempCanvas.getContext("2d");

  		canvas = document.getElementById("canvas");
  		ctx = canvas.getContext("2d");

  		//ratio = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
	
  		canvas.width = tempCanvas.width = ghostcanvas.width = WIDTH = blurCanvas.width = img.width
  				//* ratio;
  		canvas.height = tempCanvas.height = ghostcanvas.height = HEIGHT = blurCanvas.height = img.height
  				//* ratio;

  		ctx.drawImage(img,0,0);
  		//ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0,img.width * ratio, img.height * ratio)
  		ctxBlur.drawImage(canvas, 0, 0);
  		setTimeout(function() {
  			canvasOffset = $("#canvas").offset();
  			offsetX = parseInt(canvasOffset.left);
  			offsetY = parseInt(canvasOffset.top);
  		}, 500)

  	};

  	img.src = srcImage;

  	imgBlur = new Image();

  	imgDelete = new Image();
  	imgDelete.crossOrigin = 'anonymous';
  	imgDelete.onload = function() {
  		imgDelete.width = imgDelete.height = 26;
  	}
  	imgDelete.src = "http://image.prntscr.com/image/e26177aae0c04c6dbfad394df0ca2479.png";
  	img.src = srcImage.replace(/^https:\/\//i, 'http://');
  	boxes2 = [];
  }

  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

  function setOffset(){
  	if(isAndroid) {
  		canvasOffset = canvas.getBoundingClientRect();
  	}else {
  		canvasOffset = $("#canvas").offset();
  	}
  	
  	offsetX = parseInt(canvasOffset.left);
  	offsetY = parseInt(canvasOffset.top );
  }
  function handleMouseDown(e) {
  	if (!access_blur)
  		return;
  	setOffset();
  	e.preventDefault();
  	e.stopPropagation();
  	currentDrawed = new Array();
  	isDown = true;
  }

  function handleMouseUp(e) {
  	if (!access_blur)
  		return;
  	if (currentDrawed !== undefined) {
  		arrDrawed.push(currentDrawed);
  		currentDrawed = undefined;
  	}
  	e.preventDefault();
  	e.stopPropagation();
  	drawImgBlur();

  	// mainDraw();
  	isDown = false;
  }

  function handleMouseOut(e) {
  	if (!access_blur)
  		return;
  	if (currentDrawed !== undefined) {
  		arrDrawed.push(currentDrawed);
  		currentDrawed = undefined;
  	}
  	e.preventDefault();
  	e.stopPropagation();
  	if (isDown) {
  		drawImgBlur();
  		// mainDraw();
  	}
  	isDown = false;
  }

  function handleMouseMove(e) {
  	if (!isDown || !access_blur) {
  		return;
  	}
  	e.preventDefault();
  	e.stopPropagation();

  	if (e.type == 'touchmove') {
  		positionX = e.originalEvent.touches[0].pageX;
  		positionY = e.originalEvent.touches[0].pageY;
  	} else {
  		positionX = e.clientX;
  		positionY = e.clientY;
  	}
  	
  	mouseX = parseInt(positionX - offsetX);
  	mouseY = parseInt(positionY - offsetY);
  	
  	currentDrawed.push({
  		x : mouseX,
  		y : mouseY
  	});
  	
  	ctx.fillStyle = "#000";
  	ctx.beginPath();
  	ctx.arc(mouseX, mouseY, 20, 0, PI2);
  	ctx.closePath();
  	ctx.fill();
  	tempCtx.beginPath();
  	tempCtx.arc(mouseX, mouseY, 20, 0, PI2);
  	tempCtx.closePath();
  	tempCtx.fill();
  }

  function drawImgBlur() {
  	ctx.clearRect(0, 0, canvas.width, canvas.height);
  	tempCtx.clearRect(0, 0, canvas.width, canvas.height);
  	for (var i = 0; i < arrDrawed.length; i++) {
  		var temp = arrDrawed[i];
  		for (var j = 0; j < temp.length; j++) {
  			mouseX = temp[j].x;
  			mouseY = temp[j].y;
  			tempCtx.beginPath();
  			tempCtx.arc(mouseX, mouseY, 20, 0, PI2);
  			tempCtx.closePath();
  			tempCtx.fillStyle = "#fff";
  			tempCtx.fill();
  		}
  	}

  	tempCtx.save();
  	tempCtx.globalCompositeOperation = "source-in";
  	tempCtx.drawImage(img,0,0)
  	tempCtx.restore();

  	boxBlurCanvasRGBA("tempCanvas", 0, 0, tempCanvas.width, tempCanvas.height,
  			9, 0);

  	ctxBlur.save();
  	ctxBlur.clearRect(0, 0, canvas.width, canvas.height);
  	ctxBlur.drawImage(tempCanvas, 0, 0);
  	ctxBlur.globalCompositeOperation = "destination-over";
  	ctxBlur.drawImage(img,0,0)
  	ctxBlur.restore();

  	ctx.save();
  	ctx.clearRect(0, 0, canvas.width, canvas.height);
  	ctx.drawImage(blurCanvas, 0, 0);

  	drawStamp();
  	ctx.restore();
  }

  $(document).on('mousedown touchstart', '#canvas', function(e) {
  	setOffset();
  	handleMouseDown(e);
  	handleMouseDownTerm(e);

  });

  $(document).on('mouseup touchend', '#canvas', function(e) {
  	handleMouseUp(e);
  	handleMouseUpTerm(e);
  });

  $(document).on('mousemove touchmove', '#canvas', function(e) {
  	handleMouseMove(e);
  	handleMouseMoveTerm(e);
  });

  $(document).on('mouseout touchleave', '#canvas', function(e) {
  	handleMouseOut(e);
  	handleMouseOutTerm(e);
  });

  $(document).on('scroll', '.modal-content', function(e) {
  	handleMouseOut(e);
  });
  $(document).on('click', '#undo', function() {
  	arrDrawed.pop();
  	drawImgBlur();
  });

  $(window).resize(function() {
  	if (!is_edit)
  		return;
  	setOffset();
  });

  $(window).scroll(function() {
  	if (!is_edit)
  		return;
  	setOffset();
  });

  /**
   * 
   * Term Image
   */
  var stampImage = true;

  var boxes2 = [];

  // New, holds the 8 tiny boxes that will be our selection handles
  // the selection handles will be in this order:
  // 0 1 2
  // 3 4
  // 5 6 7
  var selectionHandles = [];

  // Hold canvas information
  var INTERVAL = 20; // how often, in milliseconds, we check to see if a redraw
  // is needed

  var isDrag = false;
  var isResizeDrag = false;
  var expectResize = -1; // New, will save the # of the selection handle if the
  // mouse is over one.
  var mx, my; // mouse coordinates

  // when set to true, the canvas will redraw everything
  // invalidate() just sets this to false right now
  // we want to call invalidate() whenever we make a change
  var canvasValid = true;

  // The node (if any) being selected.
  // If in the future we want to select multiple objects, this will get turned
  // into an array
  var mySel = null;

  // The selection color and width. Right now we have a red selection with a small
  // width
  var mySelColor = '#CC0000';
  var mySelWidth = 2;
  var mySelBoxColor = 'darkred'; // New for selection boxes
  var mySelBoxSize = 16;

  // since we can drag from anywhere in a node
  // instead of just its x/y corner, we need to save
  // the offset of the mouse when we start dragging.
  var offsetx, offsety;

  // Padding and border style widths for mouse offsets
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

  var imgDelete;

  // Box object to hold data
  function Box2(srcImg) {
  	this.x = 0;
  	this.y = 0;
  	this.w = 1; // default width and height?
  	this.h = 1;
  	this.fill = 'rgba(255,255,255,0)';
  	this.src = srcImg;
  	if (srcImg) {
  		this.imgTerm = setImage(this.src);
  	}

  }

  function setImage(srcImg) {
  	var imgTerm = new Image();
  	imgTerm.crossOrigin = 'anonymous';
  	imgTerm.onload = function() {
  		invalidate();
  	}
  	imgTerm.src = srcImg.replace(/^https:\/\//i, 'http://');
  	return imgTerm;
  }

  // New methods on the Box class
  Box2.prototype = {
  	// we used to have a solo draw function
  	// but now each box is responsible for its own drawing
  	// mainDraw() will call this with the normal canvas
  	// myDown will call this with the ghost canvas with 'black'
  	draw : function(context, optionalColor) {
  		if (context === gctx) {
  			context.fillStyle = 'black'; // always want black for the ghost
  			// canvas
  		} else {
  			context.fillStyle = this.fill;
  		}

  		// We can skip the drawing of elements that have moved off the screen:
  		if (this.x > WIDTH || this.y > HEIGHT)
  			return;
  		if (this.x + this.w < 0 || this.y + this.h < 0)
  			return;
  		context.fillRect(this.x, this.y, this.w, this.h);
  		if (this.imgTerm) {
  			context.drawImage(this.imgTerm, this.x, this.y, this.w, this.h);
  		}
  		// draw selection
  		// this is a stroke along the box and also 8 new selection handles
  		if (mySel === this) {
  			context.strokeStyle = mySelColor;
  			context.lineWidth = mySelWidth;
  			context.strokeRect(this.x, this.y, this.w, this.h);

  			// draw the boxes

  			var half = mySelBoxSize / 2;

  			// 0 1 2 8 9
  			// 3 4
  			// 5 6 7

  			// top left, middle, right
  			selectionHandles[0].x = this.x - half;
  			selectionHandles[0].y = this.y - half;

  			selectionHandles[1].x = this.x + this.w / 2 - half;
  			selectionHandles[1].y = this.y - half;

  			selectionHandles[2].x = this.x + this.w - half;
  			selectionHandles[2].y = this.y - half;

  			// middle left
  			selectionHandles[3].x = this.x - half;
  			selectionHandles[3].y = this.y + this.h / 2 - half;

  			// middle right
  			selectionHandles[4].x = this.x + this.w - half;
  			selectionHandles[4].y = this.y + this.h / 2 - half;

  			// bottom left, middle, right
  			selectionHandles[6].x = this.x + this.w / 2 - half;
  			selectionHandles[6].y = this.y + this.h - half;

  			selectionHandles[5].x = this.x - half;
  			selectionHandles[5].y = this.y + this.h - half;

  			selectionHandles[7].x = this.x + this.w - half;
  			selectionHandles[7].y = this.y + this.h - half;

  			selectionHandles[8].x = this.x + this.w - half + 10;
  			selectionHandles[8].y = this.y - mySelBoxSize - 10;

  			context.fillStyle = mySelBoxColor;
  			for (var i = 0; i < 9; i++) {
  				var cur = selectionHandles[i];
  				if (i == 8) {
  					context.drawImage(imgDelete, cur.x, cur.y);
  				} else if (i < 8) {

  					context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
  				}

  			}
  		}

  	} // end draw

  }

  function addRect(x, y, w, h, fill, srcImgTerm) {
  	var rect = new Box2(srcImgTerm);
  	rect.x = x;
  	rect.y = y;
  	rect.w = w
  	rect.h = h;
  	// rect.fill = fill;
  	boxes2.push(rect);
  	invalidate();
  }

  // initialize our canvas, add a ghost canvas, set draw loop
  // then add everything we want to intially exist on the canvas
  function init2() {
  	// canvas = document.getElementById("canvas");
  	// ctx = canvas.getContext('2d');
  	gctx = ghostcanvas.getContext('2d');
  	// fixes a problem where double clicking causes text to get selected on the
  	// canvas
  	/*
  	 * canvas.onselectstart = function() { //return false; }
  	 */

  	// fixes mouse co-ordinate problems when there's a border or padding
  	// see getMouse for more detail
  	if (document.defaultView && document.defaultView.getComputedStyle) {
  		stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(
  				canvas, null)['paddingLeft'], 10) || 0;
  		stylePaddingTop = parseInt(document.defaultView.getComputedStyle(
  				canvas, null)['paddingTop'], 10) || 0;
  		styleBorderLeft = parseInt(document.defaultView.getComputedStyle(
  				canvas, null)['borderLeftWidth'], 10) || 0;
  		styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas,
  				null)['borderTopWidth'], 10) || 0;
  	}

  	// make mainDraw() fire every INTERVAL milliseconds
  	setInterval(mainDraw, INTERVAL);

  	for (var i = 0; i < 9; i++) {
  		var rect = new Box2;
  		selectionHandles.push(rect);
  	}
  }

  function clearGhost(c) {
  	c.clearRect(0, 0, WIDTH, HEIGHT);

  }
  // wipes the canvas context
  function clear(c) {
  	c.clearRect(0, 0, WIDTH, HEIGHT);
  	c.drawImage(blurCanvas, 0, 0);
  	// c.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width *
  	// ratio,img.height * ratio);
  }

  // Main draw loop.
  // While draw is called as often as the INTERVAL variable demands,
  // It only ever does something if the canvas gets invalidated by our code
  function mainDraw() {
  	if (canvasValid == false) {
  		clear(ctx);

  		drawStamp();

  		// Add stuff you want drawn on top all the time here

  		canvasValid = true;
  	}
  }

  function drawStamp() {
  	var l = boxes2.length;
  	for (var i = 0; i < l; i++) {
  		boxes2[i].draw(ctx); // we used to call drawshape, but now each
  		// box draws itself
  	}
  }

  // Happens when the mouse is moving inside the canvas
  function handleMouseMoveTerm(e) {
  	if (!stampImage) {
  		return;
  	}
  	if (e.type == 'touchmove' || e.type == 'touchstart' || e.type == 'touchend') {
  		var l = boxes2.length;
  		// we are over a selection box
  		if (expectResize !== -1) {
  			e.preventDefault();
  			e.stopPropagation();
  			isResizeDrag = true;
  			isDrag = false;

  		} else {
  			isDrag = true;
  		}
  	}

  	if (isDrag) {
  		getMouse(e);
  		if (mx < 0 || my < 0 || mx > canvas.width
  				|| my > canvas.height) {
  			return;
  		}
  		mySel.x = mx - offsetx;
  		mySel.y = my - offsety;
  		
  		// something is changing position so we better invalidate the canvas!
  		invalidate();
  	} else if (isResizeDrag) {
  		if (mx < 0 || my < 0 || mx > canvas.width
  				|| my > canvas.height) {
  			return;
  		}
  		// time ro resize!
  		var oldx = mySel.x;
  		var oldy = mySel.y;

  		// 0 1 2
  		// 3 4
  		// 5 6 7
  		switch (expectResize) {
  		case 0:
  			if (mx + 12 >= oldx + mySel.w || my + 12 >= oldy + mySel.h) {
  				isResizeDrag = true;
  				return;
  			}
  			mySel.x = mx;
  			mySel.y = my;
  			mySel.w += oldx - mx;
  			mySel.h += oldy - my;
  			break;
  		case 1:
  			if (my + 12 >= oldy + mySel.h) {
  				return;
  			}
  			mySel.y = my;
  			mySel.h += oldy - my;
  			break;
  		case 2:
  			if (mx <= oldx + 12 || my + 12 >= oldy + mySel.h) {
  				return;
  			}
  			mySel.y = my;
  			mySel.w = mx - oldx;
  			mySel.h += oldy - my;
  			break;
  		case 3:
  			if (mx + 12 >= oldx + mySel.w) {
  				return;
  			}
  			mySel.x = mx;
  			mySel.w += oldx - mx;
  			break;
  		case 4:
  			if (mx <= oldx + 12) {
  				return;
  			}
  			mySel.w = mx - oldx;
  			break;
  		case 5:
  			if (mx + 12 >= oldx + mySel.w || my <= oldy + 12) {
  				return;
  			}
  			mySel.x = mx;
  			mySel.w += oldx - mx;
  			mySel.h = my - oldy;
  			break;
  		case 6:
  			if (my <= oldy + 12) {
  				return;
  			}
  			mySel.h = my - oldy;
  			break;
  		case 7:
  			if (mx <= oldx + 12 || my <= oldy + 12) {
  				return;
  			}
  			mySel.w = mx - oldx;
  			mySel.h = my - oldy;
  			break;
  		}

  		invalidate();
  	}

  	getMouse(e);
  	// if there's a selection see if we grabbed one of the selection handles
  	if (mySel !== null && !isResizeDrag) {
  		for (var i = 0; i < 9; i++) {
  			// 0 1 2
  			// 3 4
  			// 5 6 7

  			var cur = selectionHandles[i];

  			// we dont need to use the ghost context because
  			// selection handles will always be rectangles
  			if (mx >= cur.x && mx <= cur.x + mySelBoxSize && my >= cur.y
  					&& my <= cur.y + mySelBoxSize) {
  				// we found one!
  				expectResize = i;
  				invalidate();

  				switch (i) {
  				case 0:
  					canvas.style.cursor = 'nw-resize';
  					break;
  				case 1:
  					canvas.style.cursor = 'n-resize';
  					break;
  				case 2:
  					canvas.style.cursor = 'ne-resize';
  					break;
  				case 3:
  					canvas.style.cursor = 'w-resize';
  					break;
  				case 4:
  					canvas.style.cursor = 'e-resize';
  					break;
  				case 5:
  					canvas.style.cursor = 'sw-resize';
  					break;
  				case 6:
  					canvas.style.cursor = 's-resize';
  					break;
  				case 7:
  					canvas.style.cursor = 'se-resize';
  					break;
  				case 8:
  					canvas.style.cursor = 'no-drop';
  					break;
  				}
  				return;
  			}

  		}
  		// not over a selection box, return to normal
  		isResizeDrag = false;
  		expectResize = -1;
  		canvas.style.cursor = 'auto';
  	}
  }

  // Happens when the mouse is clicked in the canvas
  function handleMouseDownTerm(e) {
  	if (!stampImage) {
  		return;
  	}
  	getMouse(e);
  	if(imgStampSelect !== undefined){
  		addRect(mx, my, 50, 50, 'rgba(0,205,0,0.7)', imgStampSelect);
  		imgStampSelect = undefined;
  	}
  	if (mySel !== null && !isResizeDrag) {
  		for (var i = 0; i < 9; i++) {
  			// 0 1 2
  			// 3 4
  			// 5 6 7

  			var cur = selectionHandles[i];

  			// we dont need to use the ghost context because
  			// selection handles will always be rectangles
  			if (mx >= cur.x && mx <= cur.x + mySelBoxSize && my >= cur.y
  					&& my <= cur.y + mySelBoxSize) {
  				// we found one!
  				expectResize = i;
  				invalidate();

  				switch (i) {
  				case 0:
  					canvas.style.cursor = 'nw-resize';
  					break;
  				case 1:
  					canvas.style.cursor = 'n-resize';
  					break;
  				case 2:
  					canvas.style.cursor = 'ne-resize';
  					break;
  				case 3:
  					canvas.style.cursor = 'w-resize';
  					break;
  				case 4:
  					canvas.style.cursor = 'e-resize';
  					break;
  				case 5:
  					canvas.style.cursor = 'sw-resize';
  					break;
  				case 6:
  					canvas.style.cursor = 's-resize';
  					break;
  				case 7:
  					canvas.style.cursor = 'se-resize';
  					break;
  				case 8:
  					canvas.style.cursor = 'no-drop';
  					break;
  				}
  			}

  		}
  	}

  	var l = boxes2.length;
  	// we are over a selection box
  	if (expectResize == 8) {
  		for (var i = l - 1; i >= 0; i--) {
  			if (boxes2[i].x === mySel.x && boxes2[i].y === mySel.y) {
  				boxes2.splice(i, 1);
  				continue;
  			}
  		}
  		e.preventDefault();
  		e.stopPropagation();

  		// isResizeDrag = true;
  		clearGhost(gctx);
  		invalidate();
  		return;
  	}
  	if (expectResize !== -1) {
  		e.preventDefault();
  		e.stopPropagation();
  		isResizeDrag = true;
  		return;
  	}

  	clearGhost(gctx);

  	for (var i = l - 1; i >= 0; i--) {
  		// draw shape onto ghost context
  		boxes2[i].draw(gctx, 'black');
  		// get image data at the mouse x,y pixel
  		var imageData = gctx.getImageData(mx, my, 1, 1);
  		// var index = (mx + my * imageData.width) * 4;

  		// if the mouse pixel exists, select and break

  		if (imageData.data[3] > 0) {
  			mySel = boxes2[i];

  			offsetx = mx - mySel.x;
  			offsety = my - mySel.y;
  			mySel.x = mx - offsetx;
  			mySel.y = my - offsety;
  			isDrag = true;
  			e.preventDefault();
  			e.stopPropagation();
  			invalidate();

  			return;
  		}

  	}

  	// havent returned means we have selected nothing
  	mySel = null;
  	// clear the ghost canvas for next time
  	clearGhost(gctx);
  	// invalidate because we might need the selection border to disappear
  	invalidate();
  }

  function handleMouseUpTerm() {
  	if (!stampImage)
  		return;
  	isDrag = false;
  	isResizeDrag = false;
  	expectResize = -1;
  	invalidate();
  }

  function handleMouseOutTerm(e) {
  	if (!stampImage) {
  		return;
  	}
  	isDrag = false;
  	isResizeDrag = false;
  	invalidate();
  }

  function invalidate() {
  	canvasValid = false;
  }

  // Sets mx,my to the mouse position relative to the canvas
  // unfortunately this can be tricky, we have to worry about padding and borders
  function getMouse(e) {
  	if (e.type == 'touchmove' || e.type == 'touchstart' || e.type == 'touchend') {
  		positionX = e.originalEvent.touches[0].pageX;
  		positionY = e.originalEvent.touches[0].pageY;
  	} else {
  		positionX = e.clientX;
  		positionY = e.clientY;
  	}
  	mx = positionX - offsetX + scrollX;
  	my = positionY - offsetY + scrollY;
  }

  $(document).on('click', '.blurImage', function(e) {
  	clearSelection();
  	active($(this));
  	access_blur = true;
  	imgStampSelect = undefined;
  	termImage = false;
  	stampImage = false;
  	disable(".stampImage");
  	term_active = false;
  	$(".listTerms").hide();
  	if (mySel != null) {
  		mySel = null;
  		// clear the ghost canvas for next time
  		clearGhost(gctx);
  		// invalidate because we might need the selection border to disappear
  		invalidate();
  	}
  	
  });

  var term_active = false;

  $(document).on('click', '.stampImage', function(e) {
  	clearSelection();
  	stampImage = true;
  	disable(".blurImage");
  	access_blur = false;
  	init2();
  	active($(this));
  	if(!term_active){
  		$(".listTerms").show();
  	}else{
  		$(".listTerms").hide();
  	}
  	term_active = !term_active;
  	e.preventDefault();
  });
  var imgStampSelect = undefined ;
  var dragImage = false;
  $(document).on('mousedown', '.listTerms img', function() {
  	dragImage = true;	
  	imgStampSelect = $(this).attr("src");
  	stampImage = true;
  	term_active = false;
  	$(".listTerms").hide();
  });
  function clearSelection() {
      if(document.selection && document.selection.empty) {
          document.selection.empty();
      } else if(window.getSelection) {
          var sel = window.getSelection();
          sel.removeAllRanges();
      }
  }
  function active(selector) {
  	$(selector).removeClass("red").addClass("blue");
  }

  function disable(selector) {
  	$(selector).removeClass("blue").addClass("red");
  }
