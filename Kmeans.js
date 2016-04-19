'use strict'

class Kmeans {

	constructor(vector, k, callback) {

		if (!vector || !vector.length) {
			throw new Error('Vector nor defined');
		}

		if (!k) {
			throw new Error('Undefined number of clusters');
		}

	    this.callback = callback;
	    this.vector = vector;

	    //clusters number
	    this.k = k;

	    /*
	    	Initialize the centroids and clusters     
	    	centroids - the center of each cluster. 
	    	They are taken by averaging each dimension of the vectors
	    */
	    
	    this.centroids = new Array(k);
	    this.cluster = new Array(k);

	    //Create centroids and place them randomly because 
	    //we don't yet know where the vectors are most concentrated
	    this.createCentroids();
	    let count = 0;
	    let notFinished = true;
	    
	    this.iterate(this.centroids.slice(0));
	}

	createCentroids() {
	    let randomArray = this.vector.slice(0);
	    randomArray.sort( () => Math.floor(Math.random() * this.vector.length) );
	    this.centroids = randomArray.slice(0, this.k);
	}

	iterate(vecArray = []) {
   
	    this.cluster = new Array(this.k);
	    
	    let tempArray = [];
	    for (let a = 0; a < this.vector[0].length; a++) {
	        tempArray.push(0);
	    }
	    for (let a = 0; a < this.k; a++) {
	        vecArray[a] = (tempArray.slice(0));
	    }
	    //Group each vector to a cluster based upon the 
	    //cooresponding centroid
	    for (let i in this.vector) {
	        let v = this.vector[i].slice(0);
	        let index = this.assignCentroid(v);
	        
	        if (!this.cluster[index]) {
	        	this.cluster[index] = [];
	    	}
	        
	        this.cluster[index].push(v);

	        for (let a = 0; a < v.length; a++){
	            vecArray[index][a] += v[a]; //keep a sum for cluster
	        }
	    }

	    //Calculate the mean values for each cluster.
	    let distance, max = 0;
	   
	    for (let a = 0; a < this.k; a++) {
	        
	        let clusterSize = 0; //cluster is empty
	        if (this.cluster[a]) {
	        	clusterSize = this.cluster[a].length;
	        }
	        
	        for (let b in vecArray[a]) {
	            vecArray[a][b] = vecArray[a][b]/clusterSize;
	        }
	        let distance = this.distance(vecArray[a], this.centroids[a]);
	        if (distance > max) {
	            max = distance;
	        }
	    }
	    
	    if (max <= 0.5) {
	        return this.callback(null, this.cluster, this.centroids);
	    }       
	    
	    /*
		    For each centroid use the mean calculated for the 
		    corresponding cluster (effectively "moving" the centroid
		    to its new "location")
	    */
	    for (let z in vecArray) {
	        this.centroids[z] = vecArray[z].slice(0);
	    }
	    this.iterate(vecArray);

	}

	assignCentroid(point) {
	    let min = Infinity, res = 0;

	    /*
		    For each vector we determine the distance to the 
		    nearest centroid. The vector is assigned to the 
		    cluster that corresponds to the nearest centroid.
	    */
	    for (let i in this.centroids) {
	        let dist = this.distance(point, this.centroids[i]);
	        if (dist < min) {
	            min = dist;
	            res = i;       
	        }
	    }
	    return res;
	}

	distance(v1, v2) {
    	let total = 0;
	    for (let c in v1) {
	        if (c != 0) {
	        	total += Math.pow(v2[c] - v1[c], 2);
	        }        
	    }
	    return Math.sqrt(total);
	}

}