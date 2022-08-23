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
var draw_edges = [];
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
let dep_graph;

// Communication models table
let asy = document.getElementById("asy");
let pp = document.getElementById("pp");
let co = document.getElementById("co");
let mb = document.getElementById("mb");
let onen = document.getElementById("onen");
let nn = document.getElementById("nn");
let rsc = document.getElementById("rsc");

function dependency_graph() {

	dep_graph = new DependencyGraph(nodes, draw_edges, events); // pass highest node id

	asy.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	pp.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	co.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	mb.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	onen.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	nn.innerHTML = "<span style='color: RED;'><b>NO</b></span>";
	rsc.innerHTML = "<span style='color: RED;'><b>NO</b></span>";

	const com_name = ["asy", "pp", "co", "mb", "onen", "nn", "rsc"];
	const com_box = [asy, pp, co, mb, onen, nn, rsc];
	const is_com = [dep_graph.isMSC, dep_graph.ispp, dep_graph.isco, dep_graph.ismb, dep_graph.isonen, dep_graph.isnn, dep_graph.isrsc];

	for (let i = 0; i < com_name.length; i++) {
		let [is_valid, problem] = is_com[i].call(dep_graph);  // !IMPORTANT to pass the context to call(),  
															   // otherwise 'this' will refer to is_com and not to dep_graph
		com_box[i].innerHTML = is_valid ? 
			"<span style='color: LimeGreen;'><b>YES</b></span>" : 
			"<span style='color: RED;'><b>NO</b></span>"; 
		if (!is_valid) {
			const problem_msg = parse_problem(com_name[i], problem);
			com_box[i].innerHTML += `&nbsp&nbsp<i class="fas fa-info-circle" data-html="true" data-toggle="tooltip" title="${problem_msg}"></i>`;
			break;
		} 
	}
	
	$('[data-toggle="tooltip"]').tooltip();  // enable tooltips
}

function parse_problem(com_name, problem) {
	let problem_msg = ""; 
	switch(com_name) {
		case "asy":
			problem_msg = parse_cycle(problem);
			break;
		case "pp":
			problem_msg = "Problematic messages:<br/>"
			problem_msg += problem.join(",");
			break;
		case "co":
			problem_msg = "Problematic messages:<br/>"
			problem_msg += problem.join(",");
			break;
		case "mb":
			problem_msg = parse_cycle(problem);
			break;
		case "onen":
			problem_msg = parse_cycle(problem);
			break;
		case "nn":
			problem_msg = parse_cycle(problem);
			break;
		case "rsc":
			if(Array.isArray(problem)) {
				problem_msg = "Crown detected with messages:<br/>"
				problem_msg += problem.join(", ");
			} else {
				problem_msg = problem;
			}
			break;
	}

	function parse_cycle(problem) {
		let cycle = problem;
		let complete_cycle = [...cycle];
		complete_cycle = parse_events(complete_cycle);
	
		let cycle_msg = "Cycle detected:<br/>" + 
			complete_cycle.join("->");

		return cycle_msg;
	}
	function parse_events(events) {
		let parsed_events = events.map((id) => {
			let msg = getNodeById(id).m;
			if(id % 2 == 0) // send
				return "!" + msg;
			else  // receive
				return "?" + msg;
		});
	
		return parsed_events;
	}

	return problem_msg;
}

function print_cycle(cycle) {
	let complete_cycle = [...cycle];
	complete_cycle = complete_cycle.map((id) => {
		let msg = getNodeById(id).m;
		if(id % 2 == 0) // send
			return "!" + msg;
		else  // receive
			return "?" + msg;
	});

	return complete_cycle.join("->");
}

function clear_table() {
	asy.innerHTML = "";
	pp.innerHTML = "";
	co.innerHTML = "";
	mb.innerHTML = "";
	onen.innerHTML = "";
	nn.innerHTML = "";
	rsc.innerHTML = "";
}

function init_events() {
	for (let i = 0; i < K; i++) { // each row i will be an array of events for the process i
		events[i] = [];
	}
}

function reset_data() { nodes = []; draw_edges = []; counter = 0; msg_counter = 0; clear_table(); }

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
	c.fill();
	c.strokeStyle = "#000";
	c.lineWidth = strk;
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

function drawLabel(c, x, y, msg) {
	c.font = "1em Arial";
	ctx.fillStyle = "#000";
	c.fillText(msg,x,y);
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
		if ( !(nodes[i].type === "receive" && nodes[i].unmatched) ) {
			insert_event(nodes[i].id);
		}
		// events[nodes[i].p].push(nodes[i].id)
	}
}

function draw() {
	console.log("draw() called");
	init();
	console.log("K: " + K);

	for (var i = 0; i < K; i++) { drawLine(ctx, (i + 0.5) * (cnvs.width / K), 0, (i + 0.5) * (cnvs.width / K), cnvs.height, "#000", STROKE, false); }

	for (var i = 0; i < nodes.length; i++) { 
		if (nodes[i] != null) {
			drawLine(ctx, 0, nodes[i].y, cnvs.width, nodes[i].y, "#ddd", STROKE, true); 
		}
	}
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i] != null) {
			if (nodes[i].type === "send") 
				drawCircle(ctx, nodes[i].x, nodes[i].y, R, NODE_COLOR[0], STROKE);
			else if (nodes[i].unmatched)
				drawCircle(ctx, nodes[i].x, nodes[i].y, R, "#c4c4c4", 1);
			else
				drawCircle(ctx, nodes[i].x, nodes[i].y, R, NODE_COLOR[1], STROKE);
		}
	}

	for (var e in draw_edges) {
		if (draw_edges[e] != null) {
			var src = getNode(nodes, draw_edges[e].source);
			var trg = getNode(nodes, draw_edges[e].target);
			if (src.unmatched && src.type === "send") {  // unmatched message
				// compute sin cos tg
				let cos = Math.abs(trg.x-src.x) / Math.sqrt((trg.x-src.x)**2 + (trg.y-src.y)**2);
				let sin = Math.sqrt(1-cos**2);
				let tg = sin/cos;
				let offsetX, offsetY;
				offsetX = (trg.x-src.x) > 0 ? -(R*1.5) : (R*1.5);
				offsetY = (trg.y-src.y) > 0 ? -(R*1.5*tg) : (R*1.5*tg);
				drawArrow(ctx, src.x, src.y, trg.x+offsetX, trg.y+offsetY, "#000", 1, draw_edges[e].dashed);
			}
			else 
				drawArrow(ctx, src.x, src.y, trg.x, trg.y, "#000", 1, draw_edges[e].dashed);
			// drawLabel(ctx, Math.floor((src.x+trg.x)/2), Math.floor((src.y+trg.y)/2), "m"+src.m);
			var label_x = src.x+20;
			var label_y = src.y <= trg.y ? (src.y-10) : (src.y+20);
			drawLabel(ctx, label_x, label_y, "m"+src.m);
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
		if (EDGE_STYLE != "dashed") {  // matched message
			nodes.push({ "id": counter, "x": x, "y": y, "r": 15, "p": s_p, "m": msg_counter, "isDragging": false, "type": "send", "unmatched": false});
			nodes.push({ "id": counter+1, "x": xr, "y": yr, "r": 15, "p": r_p, "m": msg_counter, "isDragging": false, "type": "receive", "unmatched": false });
		}
		else {
			nodes.push({ "id": counter, "x": x, "y": y, "r": 15, "p": s_p, "m": msg_counter, "isDragging": false, "type": "send", "unmatched": true });
			nodes.push({ "id": counter+1, "x": xr, "y": yr, "r": 15, "p": r_p, "m": msg_counter, "isDragging": false, "type": "receive", "unmatched": true });
		}
		draw_edges.push({ "source": counter, "target": counter + 1, "dashed": (EDGE_STYLE == "dashed") });
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
			// delete draw_edges[j / 2];

			// my version, no undefined holes
			nodes.splice(y, 1);
			nodes.splice(j, 1);
			draw_edges.splice(j / 2, 1);

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