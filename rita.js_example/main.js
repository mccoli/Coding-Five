// Setup a Markov chain with an n-gram of length 4
markov = RiTa.markov(4);

// Load data to be fed to Markov chain
let kafka, wittgenstein;
Promise.all([
	fetch("./kafka.txt").then((res) => res.text()).then((text) => kafka = text),
	fetch("./wittgenstein.txt").then((res) => res.text()).then((text) => wittgenstein = text)
]).then(() => {
	// "Train" Markov chain with data
	markov.addText(kafka);
	markov.addText(wittgenstein);
});

// Generate text with Markov chain based n-grams
const textarea = document.getElementById("textarea");
textarea.addEventListener("click", generate);

function generate() {
	// Generate 10 sentences
	const lines = markov.generate(10);
	textarea.innerText = lines.join(" ");
}

const probabilitiesButton = document.getElementById("show-probabilities");
probabilitiesButton.addEventListener("click", showProbabilities);

function showProbabilities(){
	console.log(markov.probabilities());
}