class NeuralNetwork{
	constructor(inputNodes, hiddenNodes, outputNodes, learningRate){
		this.inodes = inputNodes;
		this.hnodes = hiddenNodes;
		this.onodes = outputNodes;
		this.learningRate = learningRate;

		this.wih = math.random([this.hnodes, this.inodes], -0.5, 0.5);
		this.who = math.random([this.onodes, this.hnodes], -0.5, 0.5);

		this.activationFunction = "sigmoid";
	}

	activation(x){
		if(this.activationFunction === "sigmoid"){
			return x.map((z) => this.sigmoid(z));
		}else{
			return x;
		}
	}

	activationDerivative(x){
		if(this.activationFunction === "sigmoid"){
			return x.map((z) => this.sigmoidDerivative(z));
		}else{
			return x;
		}
	}

	sigmoid(x){
		return 1 / (1 + Math.exp(-x));
	}

	sigmoidDerivative(x){
		return this.sigmoid(x) * (1.0 - this.sigmoid(x));
	}

	train(inputs, targets){
		inputs = math.matrix(inputs);
		targets = math.matrix(targets);
		const {hiddenOutputs, finalOutputs} = this.query(inputs);

		// Backpropogate errors
		const outputErrors = math.subtract(targets, finalOutputs);
		const hiddenErrors = math.multiply(math.transpose(this.who), outputErrors);

		// Gradient descent
		const whoAdjustments = math.multiply(
			this.learningRate,
			math.dotMultiply(
				math.reshape(outputErrors, [-1, 1]),
				this.activationDerivative(math.reshape(finalOutputs, [-1, 1]))
			),
			math.transpose(math.reshape(hiddenOutputs, [-1, 1]))
		);
		this.who = math.add(this.who, whoAdjustments).toArray();

		const wihAdjustments = math.multiply(
			this.learningRate,
			math.dotMultiply(
				math.reshape(hiddenErrors, [-1, 1]),
				this.activationDerivative(math.reshape(hiddenOutputs, [-1, 1]))
			),
			math.transpose(math.reshape(inputs, [-1, 1]))
		);
		this.wih = math.add(this.wih, wihAdjustments).toArray();

		return {
			outputErrors,
			hiddenErrors,
			whoAdjustments,
			wihAdjustments
		};
	}

	query(inputs){
		const hiddenInputs = math.multiply(this.wih, math.matrix(inputs));
		const hiddenOutputs = this.activation(hiddenInputs);

		const finalInputs = math.multiply(this.who, hiddenOutputs);
		const finalOutputs = this.activation(finalInputs);

		return {
			hiddenOutputs,
			finalOutputs
		};
	}
}