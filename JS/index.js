import {pyodideInIt, evaluatePython} from "./pythonCodeExecuter.js";

// Triggering pyodideInIt()
pyodideInIt();


// Saving reference of the code field, run button, import library button, 
const codeField = document.querySelector("#code-field");
const outputPanel = document.querySelector("#output-section");
const runButton = document.querySelector("#run-code-btn");
const exportCodeButton = document.querySelector("#export-code-btn");
const copyCodeButton = document.querySelector("#copy-code-btn");

function executePythonCode(code, errorInCaseFieldIsEmpty) {
	if (!code) {
		//alert("Please enter some code to run.");
		alert(errorInCaseFieldIsEmpty);
		return;
	}
	evaluatePython(code);
}

function copyCode() {
	const code = codeField.innerText.trim();
	navigator.clipboard.writeText(code).then(() => {
		alert("Code copied!");
	});
}

function exportCode() {
	const code = codeField.innerText.trim();
	
	// Create a blob object with the text
	const blob = new Blob([code], { type: "text/x-python" });
	
	// Create a hidden anchor element to trigger the download
	const downloadLink = document.createElement("a");
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = "exported-content.py";
	document.body.appendChild(downloadLink);
	
	// Trigger the download by simulating a click on the anchor element
	downloadLink.click();
	
	// Remove the download link after the download is triggered
	document.body.removeChild(downloadLink);
}

// Attaching click event on the 'RUN' button
runButton.addEventListener("click", function () {
	const code = codeField.innerText.trim().replace('\u00A0', '');;
	executePythonCode(code, "Please enter some code to run.");
});

//Attaching click event to copy button.
copyCodeButton.addEventListener('click', copyCode);

// Attaching click event to export button.
exportCodeButton.addEventListener("click", exportCode);

// Attaching keydown event on the body element to track execution of keyboard commands
document.body.addEventListener("keydown", function (event) {
	if (event.altKey && event.code === "KeyR") {
		event.preventDefault();
	const code = codeField.innerText.trim().replace('\u00A0', '');;
		executePythonCode(code, "Please enter some code to run.");
	}
	else if (event.altKey && event.code === "KeyX") {
		event.preventDefault();
		exportCode();
	}
	else if (event.altKey && event.code === "KeyC") {
		event.preventDefault();
		copyCode();
	}
	else if (event.altKey && event.code === "KeyE") {
		event.preventDefault();
		codeField.focus();
	}
	else if (event.altKey && event.code === "KeyO") {
		event.preventDefault();
		outputPanel.focus();
	}
});
