const settings = {
	matrix_sizes: [
		[5, 5],
		[5, 5]
	],
	operation: '+'
};

class Matrix {
	constructor(root, size, controls) {
		const self = this;

		this.data = Array(size[0]).fill(0).map(()=>Array(size[1]).fill(0));
		this._canvas = document.createElement('table');
		this._root = root;
		this.size = {get 0() {return self.data.length}, get 1() {return self.data[0].length}, length: 2};
		root.appendChild(this._canvas);
		this.recreate();

		if (!controls) return;

		this._controls = document.createElement('div');
		this._controls_addrow = document.createElement('div');
		this._controls_addcol = document.createElement('div');
		this._controls_rmrow = document.createElement('div');
		this._controls_rmcol = document.createElement('div');
		this._controls_transpose = document.createElement('div');
		this._controls_field = document.createElement('div');


		this._controls_addrow.onclick = this.addRow.bind(this);
		this._controls_addcol.onclick = this.addCol.bind(this);
		this._controls_rmrow.onclick = this.rmRow.bind(this);
		this._controls_rmcol.onclick = this.rmCol.bind(this);
		this._controls_transpose.onclick = this.transpose.bind(this);
		this._controls_field.onclick = () => {};

		this._controls.className = 'controls';
		this._controls_addrow.className = 'button addrow';
		this._controls_addcol.className = 'button addcol';
		this._controls_rmrow.className = 'button rmrow';
		this._controls_rmcol.className = 'button rmcol';
		this._controls_transpose.className = 'button transpose';
		this._controls_field.className = 'button field';

		this._controls.appendChild(this._controls_addcol);
		this._controls.appendChild(this._controls_addrow);
		this._controls.appendChild(this._controls_rmcol);
		this._controls.appendChild(this._controls_rmrow);
		this._controls.appendChild(this._controls_transpose);
		this._controls.appendChild(this._controls_field);

		this._controls_field.textContent = 'R';

		this._root.appendChild(this._controls);
	}
	recreate() {
		this._canvas.innerHTML = '';
		for (let row of this.data) {
			const rowEl = document.createElement('tr');
			for (let [cellid, cell] of row.entries()) {
				const cellEl = document.createElement('td');
				cellEl.contentEditable = true;
				cellEl.oninput = () => {row[cellid] = +cellEl.textContent}
				cellEl.textContent = cell;
				rowEl.appendChild(cellEl);
			}
			this._canvas.appendChild(rowEl);
		}
	}
	update() {
		this.data.forEach((row, rowid) => {
			row.forEach((cell, cellid) => {
				this._root.querySelector(`tr:nth-child(${rowid+1}) > td:nth-child(${cellid+1})`).textContent = cell;
			})
		});
	};
	addRow() {this.data.push(Array(this.size[1]).fill(0));  this.recreate()}
	addCol() {this.data.map(x=>x.push(0)); this.recreate()}
	rmRow() {this.data.pop(); this.recreate()}
	rmCol() {this.data.map(x=>x.pop()); this.recreate()}
	transpose() {this.data = this.data[0].map((col, i) => this.data.map(row => row[i])); this.recreate()}
}


window.aaa = new Matrix(document.getElementById('m-1'), [5,5], true);
window.bbb = new Matrix(document.getElementById('m-2'), [5,5], true);
window.ccc = new Matrix(document.getElementById('m-out'), [5,5]);

const operationClass = document.getElementById('operation').classList;

document.getElementById('operation-sum').onclick = () => {settings.operation = '+'; operationClass.add('sum'); operationClass.remove('mul')};
document.getElementById('operation-mul').onclick = () => {settings.operation = '×'; operationClass.add('mul'); operationClass.remove('sum');};

document.onclick = () => {
	if (settings.operation == '+') {
		window.ccc.data = window.aaa.data.map((row,rowid) => row.map((cell,cellid) => window.bbb.data[rowid][cellid]+cell));
		window.ccc.recreate();
	} else {
		window.ccc.data = Array(window.aaa.size[0]).fill(0).map(x=>Array(window.bbb.size[1]).fill(0));
		for (let i = 0; i<window.ccc.size[0]; ++i) {
			for (let j = 0; j<window.ccc.size[1]; ++j) {
				window.ccc.data[i][j] = Array(window.aaa.data[0].length).fill(0).map((_,k) => window.aaa.data[i][k] * window.bbb.data[k][j]).reduce((a,b)=>a+b,0);
			}
		}
		window.ccc.recreate();
	}
};