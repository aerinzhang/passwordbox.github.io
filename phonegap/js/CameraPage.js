    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 

    // Wait for Cordova to connect with the device
    document.addEventListener("deviceready",onDeviceReady,false);

    function onDeviceReady() {
      //add init
      //$.mobile.allowCrossDomainPages= true;
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    function onPhotoDataSuccess(imageData) {
      var smallImage = document.getElementById('smallImage');
      smallImage.style.display = 'block';
      smallImage.src = "data:image/jpeg;base64," + imageData;
      drawToCanvas(imageData);
    }

    function onPhotoURISuccess(imageURI) {
      var smallImage = document.getElementById('smallImage');
      smallImage.style.display = 'block';
      smallImage.src = "data:image/jpeg;base64," + imageURI;
      drawToCanvas(imageURI);
      //var dataURL = canvas.toDataURL("image/jpeg")
    }

    function useWhiteBoard() {
       document.location.href = '#edit';
    }

    function drawToCanvas(imageInfo) {
      document.location.href = '#edit';
      var mycanvas = document.getElementById('canvas1');
      var ctx = mycanvas.getContext("2d");
      //smallImage.src = "data:image/jpeg;base64," + imageInfo;
      var imagen = new Image();
      imagen.src = "data:image/jpeg;base64," + imageInfo;
      imagen.onload = function() {
        /* look up drawImage properties*/
        ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
        if (imagen.height > imagen.width*1.5) {
          //height is longer; scale to height; space in x direction
          var newWidth = 450/imagen.height * imagen.width;
          mycanvas.width = imagen.width;
          mycanvas.height = 450;
          //var xoffset = (300 - newWidth)/2;
          //ctx.drawImage(imagen, xoffset,0, newWidth, 450);
        } else if (imagen.height < imagen.width*1.5) {
          //width is bigger; scale to width, space in y?
          //var newHeight = 300/imagen.width * imagen.height;
          //ctx.drawImage(imagen, 0, 1, 300, newHeight);
          mycanvas.width = 300;
          mycanvas.height = imagen.height;
        } else {
          //ratio of height/width is right
          mycanvas.width = 300;
          mycanvas.height = 450;
          //ctx.drawImage(imagen, 0, 0, 300, 450);
        }
        ctx.drawImage(imagen, 0, 0, mycanvas.width, mycanvas.height);
      };
	    

/*
    var img = new Image();
    img.src = "data:image/jpeg;base64," + imageInfo;
    var canvas = document.getElementById('canvas1');
    var ctx = mycanvas.getContext("2d");

    var canvasCopy = document.createElement("canvas2");
    var copyContext = canvasCopy.getContext("2d");

    img.onload = function()
    {
        var ratio = 1;

        if(img.width > canvas.width)
            ratio = canvas.width / img.width;
        else if(img.height > canvas.height)
            ratio = canvas.height / img.height;

        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        copyContext.drawImage(img, 0, 0);

        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
    };*/

    }

    function capturePhoto() {

      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20,
        destinationType: destinationType.DATA_URL,
        //destinationType: destinationType.FILE_URI,
        targetWidth: 300,
        targetHeight: 450,
        sourceType: pictureSource.CAMERA,
        savePhotoToAlbum : true,
        correctOrientation: true });
    }

    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      //      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
      //        destinationType: destinationType.DATA_URL });
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 40, allowEdit: true,
        destinationType: destinationType.DATA_URL,
        //destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.CAMERA,
        targetWidth: 300,
        targetHeight: 450,
        correctOrientation: true});
    }

    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 40, 
        destinationType: destinationType.DATA_URL,
        //destinationType: destinationType.FILE_URI,
        sourceType: source,
        targetWidth: 300,
        targetHeight: 450,
        correctOrientation: true });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }

/*var CameraPage = function(){
    this.div = $('#cameraView');
    this.takePictureButton = $('#takePicture');
    this.takePictureButton.onButtonTap(this.takePicture.bind(this));
    this.selectPictureButton = $('#selectPicture');
    this.selectPictureButton.onButtonTap(this.selectPicture.bind(this));
}

CameraPage.prototype = {
    start: function(){ },
    
    stop: function(){ },

    takePicture: function(){
        var pictureSource = navigator.camera.PictureSourceType;
        var destinationType = navigator.camera.DestinationType;

        navigator.camera.getPicture(
                    this.onPhotoDataSuccess.bind(this), 
                    this.onFail.bind(this), 
                    {quality: 50,
                     destinationType: destinationType.DATA_URL,
                     sourceType: pictureSource });
    },

    selectPicture: function() {
        var pictureSource = navigator.camera.PictureSourceType.PHOTOLIBRARY;
        var destinationType = navigator.camera.DestinationType;

        //Select picture from library    
        navigator.camera.getPicture(
            onPhotoDataSuccess.bind(this), 
            this.onFail.bind(this), 
            {quality: 50, 
             destinationType: destinationType.FILE_URI,         
             sourceType: pictureSource});
    },

    onPhotoDataSuccess: function(imageData) { 
        var pic = $('#picture');
        pic.attr('src', 'data:image/jpeg;base64,' + imageData);
    },

    onFail: function(message) {
        alert('Taking picture failed because: ' + message);
    }
}





function capturePhoto() {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, 
        { quality: 25, destinationType: Camera.DestinationType.FILE_URI });
}

function onPhotoURISuccess(imageURI) {
    createFileEntry(imageURI);
}

function createFileEntry(imageURI) {
    window.resolveLocalFileSystemURI(imageURI, copyPhoto, fail);    
}

function copyPhoto(fileEntry) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) { 
        fileSys.root.getDirectory("photos", {create: true, exclusive: false}, function(dir) { 
                fileEntry.copyTo(dir, "file.jpg", onCopySuccess, fail); 
            }, fail); 
    }, fail); 
}

function onCopySuccess(entry) {
    console.log(entry.fullPath)
}

function fail(error) {
    console.log(error.code);
}
*/
