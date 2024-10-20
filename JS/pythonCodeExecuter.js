const prepareIDE = document.querySelector("#prepare-ide");
const rootPage = document.querySelector("#root");
const codeField = document.querySelector("#code-field");
const outputList = document.querySelector("#output-list");
let pyodide;

// Exposing functions to Pyodide
globalThis.appendToOutputList = appendToOutputList;
globalThis.getUserInput = getUserInput;


export async function pyodideInIt() {
	prepareIDE.innerText = "Initializing, Please wait...\n";
	
	try {
		pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/" });
		prepareIDE.innerText = "Editor is ready. Happy coding!";
		rootPage.classList.remove("hidden");
		prepareIDE.classList.add("hidden");
	} catch (error) {
		prepareIDE.innerText = "Unable to prepare the IDE. Please check your internet connection. If everything appears to be fine, consider refreshing the web page or restarting your browser.";
	}
}

function appendToOutputList(message) {
	// Creating HTML elements
	let listItem = document.createElement('li');
	let title = document.createElement('h3');
	let copyButton = document.createElement('button');
	let executionDetails = document.createElement('div');
	
	// Get current date and time for title
	const dateString = new Date().toLocaleDateString();
	const timeString = new Date().toLocaleTimeString();
	title.innerText = `Executed on ${dateString} at ${timeString}`;
	
	// Creating 'Copy' button
	copyButton.innerText = "Copy";
	copyButton.setAttribute("aria-label", `Copy (${title.innerText})`);
	copyButton.addEventListener('click', function () {
		navigator.clipboard.writeText(message).then(() => {
			alert("Details copied!");
		});
	});
	
	// Populating execution details
	executionDetails.innerText = message;
	
	// Appending title, copy button, and details in the listitem
	listItem.append(title);
	listItem.append(copyButton);
	listItem.append(executionDetails);
	
	// Appending list item
	outputList.appendChild(listItem);
	executionDetails.setAttribute('tabindex', '-1');
	executionDetails.focus();
}

function getUserInput(prompt) {
	return window.prompt(prompt);
}

export async function evaluatePython(code) {
	if (!pyodide) {
		alert("Pyodide is not initialized yet. Please wait.");
		return;
	}
	
	// Create an array to buffer the output
	let outputBuffer = [];
	
	try {
		pyodide.runPython(`
			import sys
			from js import appendToOutputList, getUserInput

			# Buffer to store print outputs
			output_buffer = []

			# Custom print function to capture output in the buffer
			def custom_print(*objects, sep=' ', end='\\n'):
				output_buffer.append(sep.join(map(str, objects)) + end)

			# Redirect print to custom_print
			sys.stdout.write = lambda message: output_buffer.append(message)

			# Override input function to show prompt
			def input(prompt=''):
				output_buffer.append(prompt)  # This ensures the prompt is printed
				response = getUserInput(prompt)
				if response is None:
					raise EOFError("User cancelled input.")
				return response
		`);

		// Execute the user's code
		pyodide.runPython(code);

		// Get the buffered output and join it as a single string
		const finalOutput = pyodide.runPython("''.join(output_buffer)");

		// Append the entire output at once to the output list
		appendToOutputList(finalOutput);
	} catch (err) {
		appendToOutputList(`Error: ${err}`);
	}
}

