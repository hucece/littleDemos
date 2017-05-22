$(function(){
	$("#clickMeBtn").on("click",function(){
		$("#myFile").click();
	})
	$("#myFile").on("change",function(){
		var file = this.files[0];
		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = function(e){
			var imgURL = fileReader.result;
			$("#imgSource")[0].src = imgURL;
			var cropperImg = $("#imgSource").cropper({
				viewMode: 3,
                dragMove: 'move',
                autoCropArea: 0.6,    //剪短尺寸，就是裁剪的尺寸
                restore: true,
                modal: true,   //裁剪以外的地方全是模态
                guides: true,  //Show the dashed lines above the crop box.
                highlight: true,  //Show the white modal above the crop box (highlight the crop box).
                cropBoxMovable: true,   //裁剪可以移动
                cropBoxResizable: false ,//裁剪可以resize
                dragCrop: false
			}).cropper('reset').cropper('replace', imgURL);
		}
	})
	$("#croperClickBtn").on("click",function(){
		var cropperImg= $("#imgSource").cropper('getCroppedCanvas'); //获取裁剪的图片
		$("#croppedImg")[0].src = cropperImg.toDataURL();  //将裁剪的图片转换成url资源
	})
	//上传图片到服务器端
	function ajaxToServer(imgUrl){
		if(!!imgUrl){
			var blob = getCropperedImg(imgUrl);
			var fd = new FormData();
			fd.append("file",blob);
			$.ajax({
				url: 'picture/upload',
				data: fd,
				contentType: false,
				processData: false,
				cache: false,
				success: function(data){

				}
			}) 
		}
	}
})
function getCropperedImg(imgUrl){
	var data = imgUrl.split(',')[1];
	data = window.atob(data);
	var ia = new Uint8Array(data.length);
	for(var i=0,len=data.length;i<len;i++){
		ia[i] = data.charCodeAt(i);
	}
	var blob = new Blob([ia],{type:'image/png'});
	return blob;
}