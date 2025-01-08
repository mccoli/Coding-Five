let inputVal = [1.0, 2.0];
let hiddenSize = 3;
let outputSize = 2;
let trainingTarget = Array(outputSize).fill().map(() => Math.random());
let nn = new NeuralNetwork(inputVal.length, hiddenSize, outputSize, 0.1);
let output = nn.query(inputVal);
let trainOutput;

const container = d3.select("#nn-graph");
const containerRect = container.node().getBoundingClientRect();

const margin = {top: 50, right: 50, bottom: 50, left: 50};
const width = containerRect.width - margin.left - margin.right;
const height = containerRect.height - margin.top - margin.bottom;

const svg = container
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

let inputNodes, hiddenNodes, outputNodes;
let wihLinks, whoLinks;

update();

function update(){
	svg.selectAll("g").remove();

	inputNodes = drawLayer({
		data: inputVal.map((v) => {
			return {
				input: v,
				error: false
			}
		}),
		name: "input-nodes",
		color: "#69b3a2",
		x: width * 1 / 4,
		y: height / (inputVal.length+1)
	});
	hiddenNodes = drawLayer({
		data: output.hiddenOutputs.toArray().map((v, i) => {
			return {
				input: v,
				error: trainOutput?.hiddenErrors.toArray()[i][0] || false
			}
		}),
		name: "hidden-nodes",
		color: "#c6ccf4",
		x: width * 2 / 4,
		y: height / (output.hiddenOutputs.toArray().length+1)
	});
	outputNodes = drawLayer({
		data: output.finalOutputs.toArray().map((v, i) => {
			return {
				input: v,
				error: trainOutput?.outputErrors.toArray()[i][0] || false,
				target: trainingTarget[i]
			}
		}),
		name: "output-nodes",
		color: "#fce8c4",
		x: width * 3 / 4,
		y: height / (output.finalOutputs.toArray().length+1)
	});
	wihLinks = drawLinks({
		data: math.flatten(math.transpose(nn.wih)).map((weight, i) => {
			return {
				weight,
				adjustment: trainOutput ? math.flatten(math.transpose(trainOutput.wihAdjustments)).toArray()[i] : false
			}
		}),
		name: "wih-links",
		startNodes: inputNodes,
		endNodes: hiddenNodes
	});
	whoLinks = drawLinks({
		data: math.flatten(math.transpose(nn.who)).map((weight, i) => {
			return {
				weight,
				adjustment: trainOutput ? math.flatten(math.transpose(trainOutput.whoAdjustments)).toArray()[i] : false
			}
		}),
		name: "who-links",
		startNodes: hiddenNodes,
		endNodes: outputNodes
	});

	svg.selectAll(".weight-links")
		.lower();
}

function drawLayer({data, name, color, x, y}){
	const layerNodes = svg
		.append("g")
		.attr("class", "layer")
		.selectAll(`.${name}`)
		.data(data)
		.join("g");

	layerNodes
		.append("circle")
			.attr("class", name)
			.attr("r", 30)
			.style("fill", color)
			.attr("cx", function(){
				return x;
			})
			.attr("cy", function(d, i){
				return y * (i+1);
			});

	// Input labels
	layerNodes.append("text")
		.attr("text-anchor", "middle")
		.attr("x", function(){
			return x;
		})
		.attr("y", function(d, i){
			return y * (i+1) + 5;
		})
		.text(function(d){
			return doNf(d.input, 1, 3);
		});

	// Error labels
	layerNodes.append("text")
		.attr("text-anchor", "middle")
		.attr("fill", "red")
		.attr("x", function(d, i, nodes){
			return x;
		})
		.attr("y", function(d, i, nodes){
			return y * (i+1) + 25;
		})
		.text(function(d){
			if(d.error === false){
				return "";
			}else{
				return doNf(d.error, 1, 3);
			}
		});

	if(trainOutput){
		// Training target labels
		layerNodes.append("text")
			.attr("text-anchor", "middle")
			.attr("fill", "blue")
			.attr("x", function(d, i, nodes){
				return x;
			})
			.attr("y", function(d, i, nodes){
				return y * (i+1) - 15;
			})
			.text(function(d){
				if(!d.target){
					return "";
				}else{
					return doNf(d.target, 1, 3);
				}
			});
	}

	layerNodes
		.on("mouseenter", function(e, d){
			this.querySelector("text").textContent = d.input;
		});
	layerNodes
		.on("mouseleave", function(e, d){
			this.querySelector("text").textContent = doNf(d.input, 1, 3);
		});

	return layerNodes;
}

function drawLinks({data, name, startNodes, endNodes}){
	startNodes.each(function(d, i){
		const startNode = this;
		endNodes.each(function(e, j){
			const endNode = this;
			const scx = parseFloat(startNode.querySelector("circle").getAttribute("cx"));
			const scy = parseFloat(startNode.querySelector("circle").getAttribute("cy"));
			const ecx = parseFloat(endNode.querySelector("circle").getAttribute("cx"));
			const ecy = parseFloat(endNode.querySelector("circle").getAttribute("cy"));
			const weightIndex = i * endNodes.size() + j;

			data[weightIndex].startPos = {
				x: scx,
				y: scy
			};
			data[weightIndex].endPos = {
				x: ecx,
				y: ecy
			};
		});
	});

	const links = svg
		.append("g")
		.attr("class", "weight-links")
		.selectAll(`.${name}`)
		.data(data)
		.join("g");

	links
		.append("line")
			.style("stroke", "#aaa")
			.attr("x1", function(d){
				return d.startPos.x;
			})
			.attr("y1", function(d){
				return d.startPos.y;
			})
			.attr("x2", function(d){
				return d.endPos.x;
			})
			.attr("y2", function(d){
				return d.endPos.y;
			});

	links
		.append("text")
			.attr("text-anchor", "middle")
			.text(function(d){
				return getText(d);
			})
			.attr("x", function(d){
				return lerp(d.startPos.x, d.endPos.x, 0.35);
			})
			.attr("y", function(d){
				return lerp(d.startPos.y, d.endPos.y, 0.35);
			});

	links.on("mouseenter", function(e, d){
		this.querySelector("text").textContent = d.weight;
	});
	links.on("mouseleave", function(e, d){
		this.querySelector("text").textContent = getText(d);
	});

	function getText(d){
		if(d.adjustment){
			const formatWeight = doNf(d.weight-d.adjustment, 1, 3);
			const formatAdjustment = doNf(d.adjustment, 1, 3);
			return `${formatWeight} + (${formatAdjustment})`;
		}else{
			return doNf(d.weight, 1, 3);
		}
	}

	return links;
}