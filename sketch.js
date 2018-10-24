/*jshint esversion: 6 */
var track = [];
var reducedTrack = [];
var tpTrack = [], tpDist;
var optimalTrack = [];
var n = 10;
var e, tp;

var trackToggle = false,
	reducedToggle = false,
	tpToggle = true,
	bruteToggle = true,
	noLoopToggle = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(55);
	noFill();
	// Sliders
	sliderEps = createSlider(1, 100, 50);
	sliderEps.position(175, 30);
	sliderTp = createSlider(1, 5, 1);
	sliderTp.position(350, 30);
	sliderEps.input(updateEps);
	sliderTp.input(updateTp);
	updateEps();
	updateTp();

	generateTrack(n);
	optimalTrack = BrutForceTwoTurnpoints(track);
}

function draw() {
	clear();
	background(55);
	// Update slider values
	strokeWeight(1);
	stroke(255);
	text("Epsilon: " + e, sliderEps.x + sliderEps.width/4, sliderEps.y - 10);
	text("Turnpoints: " + tp, sliderTp.x + sliderTp.width/4, sliderTp.y - 10);


	drawPoints(track);
	if (trackToggle) {
		drawPath(track, color(255, 52, 52), 4);
	}
	if (reducedToggle) {
		drawPath(reducedTrack, color(52, 52, 255), 2);
	}
	if (tpToggle) {
		drawPath(tpTrack, color(52, 255, 52), 1);
	}
	if (bruteToggle) {
		drawPath(optimalTrack, color(255, 255, 255), 4);	
	}


}


function generateTrack(n) {
	var x = 100, y = 100;
	track.push(new Point(x,y));
	var r, theta = PI/4;
	for (i=1; i<n; i++) {
		r = random(50, (width + height)/2/n);
		theta += random(-PI/4, PI/4);
		x += r * cos(theta);
		y += r * sin(theta);
		track.push(new Point(x,y));
	}
}

function drawPoints(path) {
	for (i=0; i<path.length; i++) {
		track[i].display();
	}
}

function drawPath(path, color, sw) {
	stroke(color);
	strokeWeight(sw);
	beginShape(LINES);
	for (i=0; i<path.length-1; i++) {
		vertex(path[i].x, path[i].y);
		vertex(path[i+1].x, path[i+1].y);
	}
	endShape();
}

function DouglasPeucker(path, epsilon) {
	var dmax = 0, index = 0, d;
	// Search the most distant point from the average path
	for (i=1; i < path.length-1; i++) {
		d = path[i].distanceToSegment(path[0], path[path.length-1]);
		if (d > dmax) {
			index = i;
			dmax = d;
		}
	}
	var resultPath;
	if (dmax > epsilon) {
		// Divide
		var path1 = DouglasPeucker(path.slice(0, index+1), epsilon);
		var path2 = DouglasPeucker(path.slice(index), epsilon);
		// Merge
		resultPath = path1.concat(path2.slice(1));
	}
	else { // Endpoint
		resultPath = [path[0], path[path.length-1]];
	}
	return resultPath;
}

// TODO study complexity of this method
function TurnPointsDetection(path, nPoints) {
	var dmax = 0, index = 0, d;
	// Search the most distant point from the average path
	for (i=1; i < path.length-1; i++) {
		d = path[i].distanceToSegment(path[0], path[path.length-1]);
		if (d > dmax) {
			index = i;
			dmax = d;
		}
	}
	var resultDist = 0;
	var tempPath, resultPath = [];
	var path1, path2, dist1, dist2;
	if (nPoints > 1 && dmax > 0) { 
		if (nPoints % 2 == 1) { // case nPoints is odd
			// Divide
			[path1, dist1] = TurnPointsDetection(path.slice(0, index+1), nPoints-1);
			[path2, dist2] = TurnPointsDetection(path.slice(index), nPoints-1);
			// Merge
			resultPath = path1.concat(path2.slice(1));
			resultDist = dist1 + dist2;
		} else { // TODO case nPoints is even
			for (i=1; i < path.length - 1; i++) {
				// Loop through each internal node and recursively
				// compute nPoints-1 turnpoints complementary path
				// keep the path that maximize the total distance
				// Complexity ? 
				path1 = [path[0], path[i]];
				dist1 = path[0].distanceToPoint(path[i]);
				[path2, dist2] = TurnPointsDetection(path.slice(i), nPoints-1);
				if (dist1 + dist2 > resultDist) {
					resultPath = path1.concat(path2.slice(1));
					resultDist = dist1 + dist2;
				}
			}
		}
	} else { // Endpoint, nPoints is 1
		resultPath = [path[0], path[index], path[path.length-1]];
		resultDist = path[0].distanceToPoint(path[index]) + path[index].distanceToPoint(path[path.length-1]);
	}
	return [resultPath, resultDist];
}

// Brute force method to obtain the two-turnpoints path. O(n**2)
function BrutForceTwoTurnpoints(path) {
	var optimalPath = [];
	var d, dmax = 0;
	for (i=1; i < path.length - 2; i++) {
		for (j=i+1; j < path.length - 1; j++) {
			d = path[0].distanceToPoint(path[i]) + path[i].distanceToPoint(path[j]) + path[j].distanceToPoint(path[path.length-1]);
			if (d > dmax) {
				dmax = d;
				optimalPath = [path[0], path[i], path[j], path[path.length-1]];
			}
		}
	}
	return optimalPath;
}

function handleClick(cb) {
	switch(cb.name){
		case "trackToggle":
			trackToggle = cb.checked;
			break;
		case "reducedToggle":
			reducedToggle = cb.checked;
			break;
		case "tpToggle":
			tpToggle = cb.checked;
			break;
		case "bruteToggle":
			bruteToggle = cb.checked;
			break;
		case "noLoop":
			noLoopToggle = cb.checked;
	}
}

function updateEps() {
	e = sliderEps.value();
	try {
		reducedTrack = DouglasPeucker(track, e);
	} catch (e) {
		console.warn(e);
	}
}

function updateTp() {
	tp = sliderTp.value();
	try {
		[tpTrack, tpDist] = TurnPointsDetection(track, tp);
	} catch (e) {
		console.warn(e);
	}
}