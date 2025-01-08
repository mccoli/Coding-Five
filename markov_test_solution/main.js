// Setup a Markov chain with an n-gram of length 3
markov = RiTa.markov(3);

// Load data to be fed to Markov chain
let conversation = "";
Promise.all([
	fetch("./human1.txt").then((res) => res.text()).then((text) => conversation += text),
	fetch("./human2.txt").then((res) => res.text()).then((text) => conversation += text),
]).then(() => {
	// "Train" Markov chain with data
	markov.addText(conversation);
});

const textarea = document.getElementById("textarea");
const inputSuggestions = document.getElementById("input-suggestions");
textarea.addEventListener("keyup", generate);

function generate(e) {
	if(e.key === " "){
		const inputText = textarea.value.trim();
		const lastText = inputText.split(" ").slice(-3);
		const suggestions = markov.completions(lastText);

		inputSuggestions.innerHTML = "";
		suggestions.forEach((suggestion) => {
			const btn = document.createElement("button");
			btn.className = "suggestion-button";
			btn.innerHTML = suggestion;
			inputSuggestions.appendChild(btn);
		});
	}
}

document.addEventListener("click", useSuggestion);

function useSuggestion(e){
	if(e.target && e.target.className === "suggestion-button"){
		if(!/\s$/.test(textarea.value)){
			textarea.value += " ";
		}

		textarea.value += e.target.innerHTML;

		textarea.dispatchEvent(new KeyboardEvent("keyup", {key: " "}));
	}
}