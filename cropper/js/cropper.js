var cropper = function(container,imgContainer,cropperBox,canvasWindow,imgFile){
	var cropperObj = {
		container: container,  //最外面的容器，所有的图片的大小可以超过这部分
		imgContainer: imgContainer,   //用来放图片的canvas
		canvasWindow:canvasWindow,  //显示我们裁剪内容为窗口
		cropper: cropperBox,   //移动的裁剪框，根据他的位置，我么的裁剪内容窗口跟随移动
		imgFile: imgFile,   //图片文件
		imgFileUrl: null,
		ratio: null,
		disX: 0,   //鼠标和拖动元素的距离水平
		disY: 0,   //鼠标和拖动元素的距离垂直
		move: false,   //是否可以拖动的标志
		cropperedData:[],   //这些数据用来后来转换成图片资源的数据
		canvasSize:{width:0,height:0},  //所有canvas的大小，这个是根据原始图片和最外面的容器来的
		init: function(){
			this.readImgFile();
		},
		readImgFile: function(){
			var instance = this;
			var oReader = new FileReader();
			oReader.readAsDataURL(instance.imgFile);
			oReader.onload = function(){
				var imgUrl = instance.imgFileUrl = oReader.result;
				instance.drawImgOnCanvas(imgUrl);
			}
		},
		drawImgOnCanvas: function(imgSrc){
			var instance = this;
			var ctx = this.imgContainer.getContext("2d"); 

			var img = new Image(); 
				img.src = imgSrc; // 设置图片源地址

				img.onload = function(){
					instance.getCanvasSize(img);
					instance.setCanvasSize();

					var width  = instance.canvasSize.width;
					var height = instance.canvasSize.height;

					ctx.drawImage(img,0,0,width,height);
			    	instance.cropperBox(0,0);   //裁剪出一个窗口
			    	instance.cropper.onmousedown = instance.startMove;
			    }

			},
		/*由传过去的图片和本来定好的盒子来决定图片该怎么显示，并且不失真，
		*图片显示的宽度和高度和我们固定的容器有关
		*/
		getCanvasSize: function(img){
			var maxWidth = this.container.offsetWidth;
			var maxHeight = this.container.offsetHeight;

			if(img.width < maxWidth && img.height < maxHeight){
				this.canvasSize.width = img.width;
				this.canvasSize.height = img.height;
			}else{
				var pWidth =img.width/(img.height/maxHeight);  //基准是：图片的高度为外面框的高度，而来定义宽度
				var pHeight =img.height/(img.width/maxWidth);  //基准是： 图片的宽度为外面框的宽度，而来定义高度

				this.canvasSize.width = img.width>img.height?maxWidth:pWidth;
				this.canvasSize.height = img.height>img.width?maxHeight:pHeight;

				this.ratio = img.width>img.height?(img.width/maxWidth):(img.height/maxHeight);

			}
		},
		/*设置那放图片的canvas的宽高，遮罩层的宽高
		*/
		setCanvasSize: function(){
			this.imgContainer.width = this.canvasWindow.width = this.canvasSize.width;
			this.imgContainer.height = this.canvasWindow.height = this.canvasSize.height;
		},
		cropperBox: function(x,y){
			var instance = this;
			var ctx = instance.canvasWindow.getContext("2d");

			//图片canvas的长宽
			var canvasWidth = instance.canvasSize.width,canvasHeight = instance.canvasSize.height;
			//裁剪框的长宽  
			var cropperedWidth = instance.cropper.offsetWidth,cropperedHeight = instance.cropper.offsetHeight;
			//清除掉之前画的框
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			//开始画
			ctx.fillStyle = "rgba(0,0,0,0.4)";
			ctx.fillRect(0,0, canvasWidth, canvasHeight);
			ctx.clearRect(x,y,cropperedWidth,cropperedHeight);
			//存储画的矩形的数据
			instance.cropperedData = [x,y,cropperedWidth,cropperedHeight]
		},
		startMove: function(e){
			e = e || window.event;
			cropperObj.move = true;
			cropperObj.getDis(e.clientX,e.clientY);

			document.onmousemove = function(e){

				if(cropperObj.move){
					e = e|| window.event;
					var pPosition = cropperObj.getPosition(cropperObj.canvasWindow);
					var left = Math.min(Math.max(0,e.clientX - cropperObj.disX - pPosition.left),cropperObj.canvasWindow.offsetWidth - cropperObj.cropper.offsetWidth);
					var top = Math.min(Math.max(0,e.clientY - cropperObj.disY - pPosition.top),cropperObj.canvasWindow.offsetHeight - cropperObj.cropper.offsetHeight);

					cropperObj.cropper.style.left = left + "px";
					cropperObj.cropper.style.top = top + "px";

					cropperObj.cropperBox(left,top);
				}
			};
			document.onmouseup = function(){
				cropperObj.move = false;
			}
		},
		getDis: function(mouseX,mouseY){
			var position = this.getPosition(this.cropper);
			this.disX = mouseX - position.left;
			this.disY = mouseY - position.top;
		},
		getPosition: function(node){
			var left = node.offsetLeft;
			var top = node.offsetTop;
			var current = node.offsetParent; // 取得元素的offsetParent
			while (current != null) {
				left += current.offsetLeft;
				top += current.offsetTop;
				current = current.offsetParent;
			}
			return {left:left,top:top};
		},
		exportCroppedImg: function(showCroppedImgCanvas){
			var instance = this;
		
			var cropperedData = instance.cropperedData;
			showCroppedImgCanvas.width = cropperedData[2];
			showCroppedImgCanvas.height = cropperedData[3];

			var canvas2 = document.createElement("canvas");
    		var cxt2=canvas2.getContext("2d");

    		var sx = cropperedData[0]*instance.ratio
    		var sy = cropperedData[1]*instance.ratio
    		var  width = cropperedData[2]*instance.ratio;
    		var height = cropperedData[3]*instance.ratio;

			var img = new Image();
			img.src= instance.imgFileUrl;

			img.width = width;
			img.height = height;

			img.onload = function(){
				cxt2.drawImage(img,sx,sy,width,height,0,0,width,height);
				document.getElementById("showImg").src = canvas2.toDataURL("image/png");
			}
			
		}
	}
	return cropperObj;
}

window.onload = function(){
	
	var container = document.getElementById("box");
	var imgContainer = document.getElementById("imgCanvas");
	var canvasWindow = document.getElementById("canvasWindow");
	var cropperBox = document.getElementById("cropperBox");
	
	document.getElementById("clickMe").onclick = function(){
		document.getElementById("file").click();
	}
	document.getElementById("file").onchange = function(){
		var imgFile = this.files[0];
		var myCropper = cropper(container,imgContainer,cropperBox,canvasWindow,imgFile);
		myCropper.init();
		var showImg = document.getElementById("showImg");
		document.getElementById("exportBtn").onclick = function(){
			myCropper.exportCroppedImg(showImg);
		}
	}

}