'use strict';
// Constants
const WIDTH = window.innerWidth / 4 * 3;
const HEIGHT = window.innerHeight - 45;
let cnvs = document.getElementById('cnvs');
cnvs.width = WIDTH;
cnvs.height = HEIGHT;
let ctx = cnvs.getContext('2d');
var STROKE, K, H, R, NODE_COLOR = [], EDGE_STYLE = "solid", MODE = "adding";
var nodes = [];
var edges = [];
var counter = 0;
var dragok = false;
var startX;
var startY;
var BB = cnvs.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;

// Data structure to store events and related stuff
let events = [];
let msg_counter = 0;
let node_ids = [];
let dep_graph;

function dependency_graph() {
	node_ids = [];
	for (const node of nodes) {
		node_ids.push(node.id);
	}
	console.log("node ids: " + node_ids);

	dep_graph = new DependencyGraph(node_ids, events); // pass highest node id

	let asy = document.getElementById("asy"); asy.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	let pp = document.getElementById("pp"); pp.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	let co = document.getElementById("co"); co.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	let mb = document.getElementById("mb"); mb.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	let onen = document.getElementById("onen"); onen.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	let nn = document.getElementById("nn"); nn.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	let rsc = document.getElementById("rsc"); rsc.innerHTML = "<span style='color: RED;'><b>NO</b></span>";

	let is_MSC = dep_graph.isMSC();
	asy.innerHTML = is_MSC ? "<span style='color: LimeGreen;'><b>YES</b></span>" : "<span style='color: RED;'><b>NO</b></span>"; if (!is_MSC) return;
	let is_pp = dep_graph.ispp();
	pp.innerHTML = is_pp ? "<span style='color: LimeGreen;'><b>YES</b></span>" : "<span style='color: RED;'><b>NO</b></span>"; if (!is_pp) return;
	let is_co = dep_graph.isco();
	co.innerHTML = is_co ? "<span style='color: LimeGreen;'><b>YES</b></span>" : "<span style='color: RED;'><b>NO</b></span>"; if (!is_co) return;
	let is_mb = dep_graph.ismb();
	mb.innerHTML = is_mb ? "<span style='color: LimeGreen;'><b>YES</b></span>" : "<span style='color: RED;'><b>NO</b></span>"; if (!is_mb) return;
	let is_onen = dep_graph.isonen();
	onen.innerHTML = is_onen ? "<span style='color: LimeGreen;'><b>YES</b></span>" : "<span style='color: RED;'><b>NO</b></span>"; if (!is_onen) return;
	// nn and rsc
	dep_graph.analyze_linearizations();

	// let is_nn = dep_graph.isnn();
	// nn.innerHTML = is_nn ? "<span style='color: LimeGreen;'><b>YES</b></span>" : "<span style='color: RED;'><b>NO</b></span>"; if (!is_nn) return;
	// let is_rsc = isrsc();
	// rsc.innerHTML = is_rsc ? "<span style='color: LimeGreen;'><b>YES</b></span>" : "<span style='color: RED;'><b>NO</b></span>"; if (!is_rsc) return;

}

function init_events() {
	for (let i = 0; i < K; i++) { // each row i will be an array of events for the process i
		events[i] = [];
	}
}

function reset_data() { nodes = []; edges = []; }

function changeMode(x) { MODE = x; }
function changeEdgeStyle(x) { EDGE_STYLE = x; }

function init() {
	STROKE = parseInt(document.getElementById("_stroke").value);
	K = parseInt(document.getElementById("_protocols").value);
	H = parseInt(document.getElementById("_H").value);
	R = parseInt(document.getElementById("_ray").value);
	NODE_COLOR[0] = document.getElementById("_sc").value;
	NODE_COLOR[1] = document.getElementById("_tc").value;

	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, cnvs.width, cnvs.height);

	// My stuff
	init_events();
}

function drawCircle(c, x, y, r, col, strk) {
	c.beginPath();
	c.arc(x, y, r, 0, 2 * Math.PI);
	c.closePath();
	c.fillStyle = col;
	c.strokeStyle = "#000";
	c.lineWidth = strk;
	c.fill();
	c.stroke();
}

function drawLine(c, xs, ys, xn, yn, col, strk, dash_flag) {
	if (dash_flag)
		c.setLineDash([5, 10]);

	c.beginPath();
	c.moveTo(xs, ys);
	c.lineTo(xn, yn);
	c.closePath();

	c.strokeStyle = col;
	c.lineWidth = strk;
	c.stroke();

	if (dash_flag)
		c.setLineDash([]);
}

function drawArrow(c, xs, ys, xn, yn, col, strk, dash_flag) {
	var headlen = 10; // length of head in pixels
	var dx = xn - xs;
	var dy = yn - ys;
	var angle = Math.atan2(dy, dx);

	drawLine(c, xs, ys, xn, yn, col, strk, dash_flag);

	c.beginPath();
	c.moveTo(xn, yn);
	c.lineTo(xn - headlen * Math.cos(angle - Math.PI / 6), yn - headlen * Math.sin(angle - Math.PI / 6));
	c.moveTo(xn, yn);
	c.lineTo(xn - headlen * Math.cos(angle + Math.PI / 6), yn - headlen * Math.sin(angle + Math.PI / 6));

	c.closePath();
	c.strokeStyle = col;
	c.lineWidth = strk;
	c.stroke();
}

function getNodeById(id) {
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].id == id) {
			return nodes[i];
		}
	}
}

function insert_event(id) {
	let node = getNodeById(id);
	console.log("inserting node " + id + " of process " + node.p);

	let p = node.p;
	let added = false;

	if (events[p].length == 0) {
		console.log("added because empty process list");
		events[p].push(id);
		added = true;
	}
	else {
		for (let i = 0; i < events[p].length; i++) {
			if (node.y < getNodeById(events[p][i]).y) {
				events[p].splice(i, 0, id);
				console.log("added in correct order");
				added = true;
				break;
			}
		}
	}

	if (!added) {
		console.log("added at the end");
		events[p].push(id);
	}
}

function updateEvents() {
	init_events();  // reset

	console.log("events before inserting");
	console.log(events);

	for (let i = 0; i < nodes.length; i++) {
		insert_event(nodes[i].id);
		// events[nodes[i].p].push(nodes[i].id)
	}
}

function draw() {
	console.log("draw() called");
	init();

	for (var i = 0; i < K; i++) { drawLine(ctx, (i + 0.5) * (cnvs.width / K), 0, (i + 0.5) * (cnvs.width / K), cnvs.height, "#000", STROKE, false); }

	for (var i = 0; i < nodes.length; i++) { if (nodes[i] != null) drawLine(ctx, 0, nodes[i].y, cnvs.width, nodes[i].y, "#ddd", STROKE, true); }
	for (var i = 0; i < nodes.length; i++) { if (nodes[i] != null) drawCircle(ctx, nodes[i].x, nodes[i].y, R, NODE_COLOR[i % 2], STROKE); }

	for (var e in edges) {
		if (edges[e] != null) {
			var src = getNode(nodes, edges[e].source);
			var trg = getNode(nodes, edges[e].target);
			drawArrow(ctx, src.x, src.y, trg.x, trg.y, "#000", 1, edges[e].dashed);
		}
	}

	updateEvents();
}

draw();

function getNode(N, id) {
	for (var n in N)
		if (N[n] != null && N[n].id == id)
			return N[n];
}

function myDown(e) {
	// get the current mouse position
	var mx = parseInt(e.clientX - offsetX);
	var my = parseInt(e.clientY - offsetY);

	// test each rect to see if mouse is inside
	dragok = false;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i] != null) {
			var r = nodes[i];
			if (mx <= r.x + r.r && mx >= r.x - r.r && my <= r.y + r.r && my >= r.y - r.r) {
				dragok = true;
				r.isDragging = true;
				break;
			}
		}
	}
	// save the current mouse position
	startX = mx;
	startY = my;
}

function myUp(e) {
	e.preventDefault();
	e.stopPropagation();

	// clear all the dragging flags
	dragok = false;
	putNode(e, $(this).position().left, $(this).position().top, false);
	for (var i = 0; i < nodes.length; i++) { if (nodes[i] != null) nodes[i].isDragging = false; }
	draw();
}

function myMove(e) {
	if (dragok) {
		e.preventDefault();
		e.stopPropagation();

		// get the current mouse position
		var mx = parseInt(e.clientX - offsetX);
		var my = parseInt(e.clientY - offsetY);

		// calculate the distance the mouse has moved
		// since the last mousemove
		var dx = mx - startX;
		var dy = my - startY;

		// move each rect that isDragging 
		// by the distance the mouse has moved
		// since the last mousemove
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] != null) {
				var r = nodes[i];
				if (r.isDragging) {
					r.x += dx;
					r.y += dy;
				}
			}
		}

		// redraw the scene with the new rect positions
		draw();

		// reset the starting mouse position for the next mousemove
		startX = mx;
		startY = my;

	}
}

function putNode(e, lft, tp, newNode) {
	var posX = e.pageX - lft, posY = e.pageY - tp;

	var x = (Math.round(posX / (cnvs.width / K) - 0.5) + 0.5) * (cnvs.width / K);
	var y = (Math.round(posY / (cnvs.height / H) - 0.5) + 0.5) * (cnvs.height / H);


	console.log();


	// drawLine(ctx, 0, y, cnvs.width, y, "#ddd", 1);
	// drawCircle(ctx, x, y, 25, "#fff", 3);


	if (newNode) {
		var s_p = Math.abs(Math.round(posX / (cnvs.width / K) - 0.5)); // process number of send

		if (Math.round(posX / (cnvs.width / K) - 0.5) == K - 1) {
			var xr = x - (cnvs.width / K);
			var r_p = s_p - 1;
		}
		else {
			var xr = x + (cnvs.width / K);
			var r_p = s_p + 1;
		}
		var yr = y;

		msg_counter++;
		nodes.push({ "id": counter, "x": x, "y": y, "r": 15, "p": s_p, "m": msg_counter, "isDragging": false });
		nodes.push({ "id": counter + 1, "x": xr, "y": yr, "r": 15, "p": r_p, "m": msg_counter, "isDragging": false });
		edges.push({ "source": counter, "target": counter + 1, "dashed": (EDGE_STYLE === "dashed") });
		counter += 2;
	} else {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] != null && nodes[i].isDragging) { // update node properties if dragged
				nodes[i].x = x;
				nodes[i].y = y;
				nodes[i].p = Math.abs(Math.round(posX / (cnvs.width / K) - 0.5));
			}
		}
	}
}

function deleteNode(e, lft, tp) {
	var posX = e.pageX - lft, posY = e.pageY - tp;

	var x = (Math.round(posX / (cnvs.width / K) - 0.5) + 0.5) * (cnvs.width / K);
	var y = (Math.round(posY / (cnvs.height / H) - 0.5) + 0.5) * (cnvs.height / H);


	// drawLine(ctx, 0, y, cnvs.width, y, "#ddd", 1);
	// drawCircle(ctx, x, y, 25, "#fff", 3);

	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i] != null && nodes[i].x == x && nodes[i].y == y) {
			var j = Math.floor(i / 2) * 2, y = j + 1;
			// delete nodes[y];
			// delete nodes[j];
			// delete edges[j / 2];

			// my version, no undefined holes
			nodes.splice(y, 1);
			nodes.splice(j, 1);
			edges.splice(j / 2, 1);

			break;
		}
	}
}

$(document).ready(function () {

	$('#cnvs').mousedown(function (e) {
		e.preventDefault();
		if (e.which == 1) { // left click
			myDown(e);
		} else {
			if (MODE === "adding")
				putNode(e, $(this).position().left, $(this).position().top, true);
			else
				deleteNode(e, $(this).position().left, $(this).position().top);
		}
		return false;
	});
	$('#cnvs').mouseup(myUp);
	$('#cnvs').mousemove(myMove);

	$(document).on('contextmenu', function (e) { e.preventDefault(); });
});