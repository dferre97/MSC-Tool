
// A JavaScript Program to detect cycle in a graph

let V;
let adj=[];
function Graph(v)
{
    adj=[]; // reset
	V=v;
	for (let i = 0; i < V; i++)
		adj.push([]);
}

// This function is a variation of DFSUtil() in
	// https://www.geeksforgeeks.org/archives/18212
function isCyclicUtil(i,visited,recStack)
{
    console.log("isCyclicUtil with i="+i);
	// Mark the current node as visited and
		// part of recursion stack
		if (recStack[i])
			return true;

		if (visited[i])
			return false;
			
		visited[i] = true;

		recStack[i] = true;
		let children = adj[i];

		for (let c=0;c< children.length;c++)
			if (isCyclicUtil(children[c], visited, recStack))
				return true;
				
		recStack[i] = false;

		return false;
}

function addEdge(source,dest)
{
    console.log("addEdge "+source+","+dest);
	adj[source].push(dest);
}

// Returns true if the graph contains a
	// cycle, else false.
	// This function is a variation of DFS() in
	// https://www.geeksforgeeks.org/archives/18212
function isCyclic()
{
	// Mark all the vertices as not visited and
		// not part of recursion stack
		let visited = new Array(V);
		let recStack = new Array(V);
		for(let i=0;i<V;i++)
		{
			visited[i]=false;
			recStack[i]=false;
		}
		
		
		// Call the recursive helper function to
		// detect cycle in different DFS trees
		for (let i = 0; i < V; i++)
            if (adj[i] !== null) {
                if (isCyclicUtil(i, visited, recStack))
				return true;
            }

		return false;
}

// // Driver code
// Graph(4);
// addEdge(0, 1);
// addEdge(0, 2);
// addEdge(1, 2);
// addEdge(2, 0);
// addEdge(2, 3);

// if(isCyclic())
// 	document.write("Graph contains cycle");
// else
// 	document.write("Graph doesn't "
// 				+ "contain cycle");
