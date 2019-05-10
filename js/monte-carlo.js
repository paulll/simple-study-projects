const Random = require("./random-js.min");
const $=document.getElementById.bind(document);
const canvas = document.getElementById("draw-zone");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const random = new Random.Random(Random.browserCrypto);

const state = {
	size: 300,
	length: 10,
	step: 15,
	crosses: 0,
	needles: 0,
	padding: 0,
	style: 2,
	hue: 0
};

const drawBackground = () => {
	if (!(state.step > 0)) return;
	ctx.clearRect(0,0,state.size, state.size);
	for (let i = 0; i<state.size; i+=state.step) {
		ctx.beginPath();
		ctx.moveTo(i+0.5, 0);
		ctx.lineTo(i+0.5, state.size);
		ctx.stroke();
	}
};

const e_length = $('length'),
	  e_step = $('step'),
	  e_number = $('number'),
	  e_crosses = $('crosses'),
	  e_pi = $('pi'),
	  e_percent = $('percent'),
	  e_padding = $('padding');

const updateStatistics = () => {
	e_length.textContent = state.length;
	e_step.textContent = state.step;
	e_number.textContent = state.needles;
	e_crosses.textContent = state.crosses;
	e_pi.textContent = (state.needles/state.crosses)*(state.length/state.step)*2;
	e_percent.textContent = 100 - Math.abs((state.needles/state.crosses*state.length/state.step*2) - Math.PI)/ Math.PI * 100;
};

$('more_needles').onmousedown = () => {
	const interval = setInterval(() => {
		if (state.style === 0) ctx.strokeStyle = `rgb(0,0,0)`;
		if (state.style === 1) ctx.strokeStyle = `hsl(${360*Math.random()},100%,50%)`;
		if (state.style === 2) ctx.strokeStyle = `hsl(${(state.hue+=0.1)%360},100%,50%)`;

		for (let i = 0; i<10; ++i) {
			const x = random.real(state.padding, state.padding + state.size-state.padding * 2, true);
			const y = random.real(state.padding, state.padding + state.size-state.padding * 2, true);

			const r = random.real(0, Math.PI, true);
			const l = state.length;

			const cos = Math.cos(r), sin = Math.sin(r);

			const x1 = x + l/2 * cos;
			const x2 = x - l/2 * cos;
			const y1 = y + l/2 * sin;
			const y2 = y - l/2 * sin;

			ctx.beginPath();
			ctx.moveTo(Math.floor(x1)+0.5,Math.floor(y1)+0.5); // +0.5 - фикс бага рендера canvas, при котором
			ctx.lineTo(Math.floor(x2)+0.5,Math.floor(y2)+0.5); // линии вдоль целочисленных координат всегда толще чем 1px
			ctx.stroke();

			state.crosses += Math.abs(Math.round((x1/state.step)-Math.round(x2/state.step)));
			state.needles++;
		}

		updateStatistics();
	}, 60/1000);

	document.onmouseup = document.onmouseout = () => {
		clearInterval(interval);
	}
};

e_step.oninput =     () => {state.step =       +$('step').textContent; drawBackground(); state.crosses = 0; state.needles = 0;};
e_length.oninput =   () => {state.length =   +$('length').textContent; drawBackground(); state.crosses = 0; state.needles = 0;};
e_padding.oninput =  () => {state.padding = +$('padding').textContent; drawBackground(); state.crosses = 0; state.needles = 0;};

const select = element => {
	document.querySelector('.selected')
		&& document.querySelector('.selected').classList.remove('selected');
	element.classList.add('selected');
};

$('mono').onclick = () => {state.style = 0; select($('mono'))};
$('random').onclick = () => {state.style = 1; select($('random'))};
$('color').onclick = () => {state.style = 2; select($('color'))};

e_padding.textContent = state.padding;
e_length.textContent = state.length;
e_step.textContent = state.step;
e_number.textContent = state.needles;
e_crosses.textContent = state.crosses;

drawBackground();
