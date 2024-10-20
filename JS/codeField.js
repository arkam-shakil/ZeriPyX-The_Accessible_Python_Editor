const textField = document.getElementById("code-field");

textField.addEventListener('keydown', function(event) {
	if (event.key === 'Tab') {
		event.preventDefault(); // Insert a tab character for indentation
		insertTabCharacterAtCaret('\u00A0\u00A0');
	} 
	else if (event.ctrlKey && event.key === 'g') {
		event.preventDefault(); // Enable 'Go To Line' feature
		goToSpecifiedLine(textField);
	}
});

function goToSpecifiedLine(textField) {
	const lineNumberInput = prompt("Enter the line number you want to jump to:");
	const allLines = textField.querySelectorAll('li');
	const lineNumber = parseInt(lineNumberInput, 10);
	
	if (isNaN(lineNumber) || lineNumber < 1 || lineNumber > allLines.length) {
		alert("Invalid line number. Please enter a valid line.");
		return;
	}
	
	moveCaretToLine(allLines[lineNumber - 1]); // Move caret to specified line
}

function moveCaretToLine(el) {
	const range = document.createRange();
	const selection = window.getSelection();
	range.setStart(el, 0);
	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
}

function insertTabCharacterAtCaret(tabCharacter) {
	const selection = window.getSelection();
	const range = selection.getRangeAt(0);
	const tabNode = document.createTextNode(tabCharacter);
	
	range.insertNode(tabNode); // Insert tab character at caret's position
	range.setStartAfter(tabNode); // Move caret after the tab character
	selection.removeAllRanges();
	selection.addRange(range);
}
