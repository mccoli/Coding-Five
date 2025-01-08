let canvas, classifier, capture, labels;
let start = false;

function setup() {
	canvas = createCanvas(400, 400);
	let constraints = {
		video: {
			mandatory: {
				minWidth: 1280,
				minHeight: 720
			},
			optional: [{ maxFrameRate: 10 }]
		}
	}
	capture = createCapture(constraints);
	capture.hide();

	labels = createDiv();

	// Initialize the Image Classifier method with MobileNet
	classifier = ml5.imageClassifier("MobileNet", modelLoaded);
	// Initialize the Image Classifier with custom trained model
	// classifier = ml5.imageClassifier("./model.json", modelLoaded);

	// When the model is loaded
	function modelLoaded() {
		console.log("Model Loaded!");
	}
}

function draw() {
	background(200);

	image(capture, 0, 0, width, width * capture.height / capture.width);

	if(start){
		frameRate(10);
		// Make a prediction with a selected image
		classifier.classify(canvas.elt, (err, results) => {
			if(err) {
				console.log(err);
			}else{
				labels.html("");
				results.forEach((result, i) => {
					const formatted = `${nfc(result.confidence, 2)} ${result.label}`;
					const label = createP(formatted);
					label.parent(labels);
				});
			}
		});
	}else{
		frameRate(60);
	}
}

function mouseClicked(){
	start = !start;
}