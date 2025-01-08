const controlsContainer = d3.select("#controls");
const activationFunctions = ["sigmoid", "direct"];

const activationField = controlsContainer
	.append("fieldset");
activationField
	.append("legend")
		.text("Select an activation function");
const activationSelect = activationField
	.selectAll("label")
	.data(activationFunctions)
	.join("label")
		.text(function(d){
			return d;
		});
activationSelect
	.append("input")
		.attr("type", "radio")
		.attr("name", "activation")
		.attr("value", function(d){
			return d;
		})
		.attr("checked", function(d){
			if(d === "sigmoid"){
				return true;
			}
		})
		.on("change", function(e, d){
			nn.activationFunction = d;
			output = nn.query(
				inputVal
			);
			update();
		});

// Neural Network field
const neuralNetworkField = controlsContainer
	.append("fieldset");
neuralNetworkField
	.append("legend")
		.text("Neural Network");
// Input layer size
drawNeuralNetworkField({
	label: "Input neurons",
	name: "nn-input-size",
	value: inputVal.length
});
drawNeuralNetworkField({
	label: "Hidden neurons",
	name: "nn-hidden-size",
	value: hiddenSize
});
drawNeuralNetworkField({
	label: "Output neurons",
	name: "nn-output-size",
	value: outputSize
});
function drawNeuralNetworkField({label, name, value}){
	neuralNetworkField
		.append("label")
			.style("display", "flex")
			.style("align-items", "center")
			.style("justify-content", "space-between")
			.text(label)
			.append("input")
				.style("margin-left", "15px")
				.attr("type", "range")
				.attr("min", 1)
				.attr("max", 10)
				.attr("step", 1)
				.attr("value", value)
				.attr("name", name)
				.on("input", function(){
					if(this.getAttribute("name") === "nn-input-size"){
						inputVal = Array(parseInt(this.value)).fill().map(() => Math.random());
					}else if(this.getAttribute("name") === "nn-hidden-size"){
						hiddenSize = parseInt(this.value);
					}else if(this.getAttribute("name") === "nn-output-size"){
						outputSize = parseInt(this.value);
						trainingTarget = Array(outputSize).fill().map(() => Math.random());
					}
					nn = new NeuralNetwork(inputVal.length, hiddenSize, outputSize, 0.1);
					output = nn.query(inputVal);
					update();
					updateInputField();
					updateTrainingFields();
				});
}

// Input field
const inputField = controlsContainer
	.append("fieldset")
		.attr("id", "input-field");
inputField
	.append("legend")
		.text("Input");
updateInputField();

function updateInputField(){
	const label = inputField
		.selectAll("label")
		.data(inputVal)
		.join("label")
			.style("display", "flex")
			.text(function(d, i){
				return `i${i}`;
			});
	label.append("input")
		.style("margin-left", "10px")
		.attr("name", function(d, i){
			`input-${i}`
		})
		.attr("type", "text")
		.attr("value", function(d){
			return d;
		})
		.attr("data-index", function(d, i){
			return i;
		});
	label.selectAll("input")
		.on("input", function(){
			if(!isNaN(parseFloat(this.value))){
				inputVal[parseInt(this.getAttribute("data-index"))] = parseFloat(this.value);
				output = nn.query(inputVal);
				update();
			}
		});
}

// Training field
const trainingFields = controlsContainer
	.append("fieldset");
trainingFields
	.append("legend")
		.text("Training");

// Train once button
trainingFields
	.append("button")
		.text("Train Once")
		.on("click", trainNN);

let trainingNN = false;
function trainNN(){
	trainOutput = nn.train(inputVal, trainingTarget);
	output = nn.query(inputVal);
	update();

	if(trainingNN){
		requestAnimationFrame(trainNN);
	}
}

// Train continuous button
const continousTrainingBtn = trainingFields
	.append("button")
		.text("Train Continous")
		.on("click", function(){
			stopTrainingBtn.attr("disabled", null);
			this.setAttribute("disabled", true);
			trainingNN = true;
			trainNN();
		});
const stopTrainingBtn = trainingFields
	.append("button")
		.text("Stop training")
		.attr("disabled", true)
		.on("click", function(){
			continousTrainingBtn.attr("disabled", null);
			this.setAttribute("disabled", true);
			trainingNN = false;
		});

// Training outputs
let trainingTargetFields = trainingFields
	.append("div")
	.style("display", "flex")
	.style("flex-direction", "column")
	.style("margin-top", "10px")
updateTrainingFields();

function updateTrainingFields(){
	trainingTargetFields
		.selectAll("label")
		.data(trainingTarget)
		.join("label")
			.style("display", "flex")
			.text(function(d, i){
				return `Target ${i}`
			})
			.append("input")
				.attr("data-index", function(d, i){
					return i;
				})
				.attr("type", "text")
				.style("margin-left", "10px")
				.attr("value", function(d){
					return d;
				})
				.on("input", function(){
					if(!isNaN(parseFloat(this.value))){
						trainingTarget[parseInt(this.getAttribute("data-index"))] = parseFloat(this.value);
						update();
					}
				});
}