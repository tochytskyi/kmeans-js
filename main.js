'use strict'

//do something on finished clustering
let callback = function(err, clusters, centroids) {
    if (err) {
    	throw new Error(err);
	}
	console.log('Finished clustering...');
    console.dir(clusters);
    console.dir(centroids);

    for (let centroid in centroids) {
    	centroids[centroid][0] = Math.round(centroids[centroid][0]);
    	centroids[centroid][1] = Math.round(centroids[centroid][1]);
    	centroids[centroid][2] = Math.round(centroids[centroid][2]);
    }

    document.getElementById('first').style.backgroundColor = `rgb(${centroids[0][0]},${centroids[0][1]},${centroids[0][2]})`;
    document.getElementById('second').style.backgroundColor = `rgb(${centroids[1][0]},${centroids[1][1]},${centroids[1][2]})`;
    document.getElementById('third').style.backgroundColor = `rgb(${centroids[2][0]},${centroids[2][1]},${centroids[2][2]})`;
}

window.onload = function() {
	let canvas = document.getElementById("canvas");
	let context = canvas.getContext("2d");
	let imageUrl = "assets/circles.jpg";
    let imageObj = new Image();

    imageObj.src = imageUrl;
	imageObj.onload = function(){
		canvas.width = imageObj.width;
	    canvas.height = imageObj.height;
	    context.drawImage(imageObj, 0, 0);	

	    let canvasColorRGB = new Array();	
	    let size = imageObj.width * imageObj.height;

	    console.log(`image width: ${imageObj.width}`);    
	    console.log(`image height: ${imageObj.height}`);
	    console.log(`image size: ${size}`);  
	    console.log(`Analyzing the image...`); 
	   
	    let pixelsColorData = context.getImageData(0, 0, imageObj.width, imageObj.height).data;

	    for (let i = 0; i < pixelsColorData.length; i += 4) {
	    	let r = pixelsColorData[i];
		    let g = pixelsColorData[i + 1];
		    let b = pixelsColorData[i + 2];
		    if (r < 250 && g < 250 && b < 250) {
		    	//lets miss pixels with white color. Means such as background color
		    	canvasColorRGB.push(new Array(r,g,b));
		    }		    	    	    		    
	    }
	    console.log(`Analyzing finished`); 

		try {
			console.log('Start to clustering color data...');
			let kmeans = new Kmeans(canvasColorRGB, 3, callback);
		} catch (err) {
			console.error(err);
		}
	    
	};	
};



