export function calculateRows(container: HTMLDivElement) {
	const dummy = document.createElement('div');
	dummy.textContent = 'M';

	const computedStyle = getComputedStyle(container);
	dummy.style.fontFamily = computedStyle.fontFamily;
	dummy.style.fontSize = computedStyle.fontSize;
	dummy.style.position = 'absolute';

	document.body.appendChild(dummy);
	const rowHeight = dummy.offsetHeight;
	document.body.removeChild(dummy);

	return Math.floor(window.innerHeight / rowHeight) - 2;
}
