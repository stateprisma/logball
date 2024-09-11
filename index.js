import xterm from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm'
let element = document.getElementById("messages");
let btn = document.getElementById("connect");

let term = new xterm.Terminal();
term.open(element);

btn.onclick = (e) => {
	startWs();
}

async function startWs() {
	var ws;
	try {
		ws = new WebSocket('ws://localhost:1234');
	} catch (e) {
		alert(e);
		return;
	}
	ws.onmessage = (event) => {
		event.data.text().then((txt) => {
			term.write(txt);
		});
	};
	term.onKey((e) => {
		let key = e.key;
		console.log(key)
		ws.send(new Blob([key]));
	});
}
