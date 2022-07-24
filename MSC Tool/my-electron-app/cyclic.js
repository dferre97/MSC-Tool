// A JavaScript Program to detect cycle in a graph

class DependencyGraph {
	node_ids = [];
	highest_id;
	events;
	adj = [];
	proc_edges = [];
	match_edges = [];
	hb_edges = [];
	hb_adj_tc = [];

	mb_edges = [];
	onen_edges = [];
	nn_edges = [];

	constructor(node_ids, events) {
		this.node_ids = node_ids;
		this.highest_id = node_ids[node_ids.length - 1] + 1;
		this.events = events;

		// computes process relation
		for (const p_events of this.events) {
			if (p_events.length > 0) {
				for (let i = 0; i < p_events.length - 1; i++) {
					this.proc_edges.push([p_events[i], p_events[i + 1]]);
				}
			}
		}

		// computes matching relation
		for (const edge of edges) {
			this.match_edges.push([edge.source, edge.target]);
		}

		// compute adjacency matrix
		this.#resetAdjacencyMatrix();
		this.hb_edges = this.proc_edges.concat(this.match_edges);
		this.#computeAdjacencyMatrix(this.hb_edges, this.adj);
	}

	#resetAdjacencyMatrix() {
		for (let i = 0; i < this.highest_id; i++)
			this.adj.push([]);
	}
	#computeAdjacencyMatrix(edges, adjacency_m) {
		for (const edge of edges) {
			this.addEdge(edge[0], edge[1], adjacency_m);
		}
	}
	addEdge(source, dest, adjacency_m) {
		console.log("addEdge " + source + "," + dest);
		if (!adjacency_m[source].includes(dest)){
			adjacency_m[source].push(dest);
		}
	}

	isMSC() {
		return !DependencyGraph.isCyclic(this.adj, this.highest_id);
	}
	#procBefore(id1, id2, p) { // id1 and id2 must be on the same process p, returns true if id1 happens before id2
		if (this.events[p].indexOf(id1) < this.events[p].indexOf(id2))
			return true;
		else
			return false;
	}
	ispp() {
		// check if there are two messages on the same channel where send and receive orders do not match
		for (let i = 0; i < K; i++) {  // for each process
			for (let j = 0; j < this.events[i].length - 1; j++) {
				let id = this.events[i][j];
				if (id % 2 == 0) { // only send events (even ids)
					let crt_node = getNodeById(id);
					let crt_node_rec = getNodeById(id + 1);
					for (let k = j + 1; k < this.events[i].length; k++) {
						let tmp_id = this.events[i][k];
						if (tmp_id % 2 == 0) { // only send events (even ids)
							let tmp_node = getNodeById(tmp_id);
							let tmp_node_rec = getNodeById(tmp_id + 1);

							if (crt_node_rec.p == tmp_node_rec.p &&
								this.#procBefore(tmp_id + 1, id + 1, tmp_node_rec.p)) { // same source, destination, inverted send/receive order
								return false;
							}
						}
					}
				}
			}
		}

		return true;
	}
	#computeHappensBefore() {
		this.hb_adj_tc = JSON.parse(JSON.stringify(this.adj));

		for (let ev_successors of this.hb_adj_tc) {  // for every event
			for (let succ of ev_successors) {  // for every adjacent event
				for (let next of this.hb_adj_tc[succ]) {
					if (!ev_successors.includes(next))
						ev_successors.push(next);
				}
			}
		}
	}
	#happensBefore(id1, id2) { // check if id1 happens before id2
		return this.hb_adj_tc[id1].includes(id2);
	}
	isco() {
		this.#computeHappensBefore();

		// check if there are two messages received by the same process, whose send events are causally related, and with inverted send/receive orders
		for (let i = 0; i < K; i++) {  // for each process
			for (let j = 0; j < this.events[i].length - 1; j++) {
				let id = this.events[i][j];
				if (id % 2 !== 0) { // only receive events (odd ids)
					for (let k = j + 1; k < this.events[i].length; k++) {
						let tmp_id = this.events[i][k];
						if (tmp_id % 2 !== 0) { // only receive events (odd ids)
							let tmp_node_send = getNodeById(tmp_id - 1);

							if (this.#happensBefore(tmp_id - 1, id - 1, tmp_node_send.p)) { // same destination, inverted send/receive order
								return false;
							}
						}
					}
				}
			}
		}

		return true;
	}
	ismb() {
		this.mb_edges = [];

		// Find messages received by the same process and impose the mb relation
		for (let i = 0; i < K; i++) {  // for each process
			for (let j = 0; j < this.events[i].length - 1; j++) {
				let id = this.events[i][j];
				if (id % 2 !== 0) { // only receive events (odd ids)
					for (let k = j + 1; k < this.events[i].length; k++) {
						let tmp_id = this.events[i][k];
						if (tmp_id % 2 !== 0) { // only receive events (odd ids)
							
							// add mb relation
							this.mb_edges.push([id - 1, tmp_id - 1])
						}
					}
				}
			}
		}

		let mb_adj = JSON.parse(JSON.stringify(this.adj));
		for (const edge of this.mb_edges) {
			this.addEdge(edge[0], edge[1], mb_adj)
		}
		
		return !DependencyGraph.isCyclic(mb_adj, this.highest_id);
	}
	isonen() {
		this.onen_edges = [];

		// Find messages sent by the same process and impose the onen relation
		for (let i = 0; i < K; i++) {  // for each process
			for (let j = 0; j < this.events[i].length - 1; j++) {
				let id = this.events[i][j];
				if (id % 2 == 0) { // only send events (even ids)
					for (let k = j + 1; k < this.events[i].length; k++) {
						let tmp_id = this.events[i][k];
						if (tmp_id % 2 == 0) { // only send events (even ids)
							// add onen relation
							this.onen_edges.push([id + 1, tmp_id + 1])
						}
					}
				}
			}
		}

		let onen_adj = JSON.parse(JSON.stringify(this.adj));
		for (const edge of this.onen_edges) {
			this.addEdge(edge[0], edge[1], onen_adj)
		}
		
		return !DependencyGraph.isCyclic(onen_adj, this.highest_id);
	}
	isnn() {
		let nn_adj = JSON.parse(JSON.stringify(this.adj));
		this.nn_edges = this.hb_edges.concat(this.mb_edges).concat(this.onen_edges);
		for (const edge of this.nn_edges) {
			this.addEdge(edge[0], edge[1], nn_adj)
		}

		// compute transitive closure of mb and onen union
		let nn_adj_tc = JSON.parse(JSON.stringify(nn_adj));
		for (let ev_successors of nn_adj_tc) {  // for every event
			for (let succ of ev_successors) {  // for every adjacent event
				for (let next of nn_adj_tc[succ]) {
					if (!ev_successors.includes(next))
						ev_successors.push(next);
				}
			}
		}

		// compute nn rel
		for(const id1 of this.node_ids) {
			for (const id2 of this.node_ids) {
				// case 2 nn relation
				if (id1 % 2 !== 0 && id1 % 2 !== 0 &&
					!nn_adj_tc[id1].includes(id2) &&
					nn_adj_tc[id1-1].includes(id2-1)) { 
					
					this.nn_edges.push([id1, id2])
				}
				// case 3 nn relation
				if (id1 % 2 == 0 && id1 % 2 == 0 &&
					!nn_adj_tc[id1].includes(id2) &&
					nn_adj_tc[id1+1].includes(id2+1)) { 
					
					this.nn_edges.push([id1, id2])
				}
			}
		}

		this.#computeAdjacencyMatrix(this.nn_edges, nn_adj);
		
		return !DependencyGraph.isCyclic(nn_adj, this.highest_id);
	}
	static isCyclic(adjacency_m, highest_id) {
		// Mark all the vertices as not visited and
		// not part of recursion stack
		let visited = new Array(highest_id);
		let recStack = new Array(highest_id);
		for (let i = 0; i < highest_id; i++) {
			visited[i] = false;
			recStack[i] = false;
		}


		// Call the recursive helper function to
		// detect cycle in different DFS trees
		for (let i = 0; i < highest_id; i++)
			if (adjacency_m[i] !== null) {
				if (DependencyGraph.isCyclicUtil(i, visited, recStack, adjacency_m))
					return true;
			}

		return false;
	}
	static isCyclicUtil(i, visited, recStack, adjacency_m) {
		// Mark the current node as visited and
		// part of recursion stack
		if (recStack[i])
			return true;

		if (visited[i])
			return false;

		visited[i] = true;

		recStack[i] = true;
		let children = adjacency_m[i];

		for (let c = 0; c < children.length; c++)
			if (DependencyGraph.isCyclicUtil(children[c], visited, recStack, adjacency_m))
				return true;

		recStack[i] = false;

		return false;
	}

	// other approach based on computing all linearizations and checking their properties
	analyze_linearizations() {
		let in_degrees = new Array(this.highest_id).fill(0);

		// compute in-degrees
		for (let ev_successors of this.adj) {  // for every event
			for (let succ of ev_successors) {  // for every adjacent event
				in_degrees[succ]++;
			}
		}

		let discovered = new Array(this.highest_id).fill(false);
		this.findLinearizations(in_degrees, [], discovered);
	}

	findLinearizations (in_degrees, crt_lin, discovered) {
		for (const id of this.node_ids) {
			if (in_degrees[id] == 0 && !discovered[id]) {
				for (const succ of this.adj[id]) {
					in_degrees[succ]--;
				}

				crt_lin.push(id);
				discovered[id] = true;
				// console.log("added "+id);

				this.findLinearizations(in_degrees, crt_lin, discovered);

				for (const succ of this.adj[id]) {
					in_degrees[succ]++;
				}

				crt_lin.pop();
				discovered[id] = false;
				// console.log("removed "+id);
			}
		}

		if (crt_lin.length == this.node_ids.length) {
			console.log(crt_lin);

			if (this.#is_nn_lin(crt_lin)) {
				console.log("found a nn-linearization !!!");
				let nn = document.getElementById("nn");
				nn.innerHTML = "<span style='color: LimeGreen;'><b>YES</b></span>";
			}
			if (this.#is_rsc_lin(crt_lin)) {
				console.log("found a rsc-linearization !!!");
				let rsc = document.getElementById("rsc");
				rsc.innerHTML = "<span style='color: LimeGreen;'><b>YES</b></span>";
			}
		}
	}

	#is_nn_lin(lin) {
		let sends = [];
		let receives = [];

		for (const ev of lin) {
			if(ev % 2 == 0)	sends.push(ev);	
			else receives.push(ev);	
		}

		for (const i in sends) {
			if (sends[i] !== receives[i]-1) {
				return false;
			}
		}

		return true;
	}
	#is_rsc_lin(lin) {
		if (lin.length % 2 !== 0) return false;

		for (let i = 0; i < lin.length-1; i+=2) {
			if (lin[i+1] !== lin[i]+1) return false;
		}

		return true;
	}
}
