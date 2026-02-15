// ===============================
// Graph Traversal Visualizer JS
// ===============================

// Graph represented as adjacency list
let graph = {};
let positions = {};
let visited = {};
let traversalOrder = [];
let isAnimating = false;

// Canvas setup
const canvas = document.getElementById("graph-canvas");
const ctx = canvas.getContext("2d");

// Node colors
const colors = {
    unvisited: "#94a3b8",
    visited: "#22c55e",
    current: "#f97316",
};

// ===============================
// Node & Edge Creation
// ===============================

function addNode() {
    const nodeInput = document.getElementById("node");
    const node = nodeInput.value.trim();

    if (!node || node in graph) return;

    graph[node] = [];
    visited[node] = false;

    positions[node] = {
        x: Math.random() * (canvas.width - 100) + 50,
        y: Math.random() * (canvas.height - 100) + 50,
    };

    nodeInput.value = "";
    drawGraph();
}

function addEdge() {
    const edgeInput = document.getElementById("edge");
    const [u, v] = edgeInput.value.trim().split(" ");

    if (!u || !v || !(u in graph) || !(v in graph)) return;

    if (!graph[u].includes(v)) graph[u].push(v);
    if (!graph[v].includes(u)) graph[v].push(u); // Undirected

    edgeInput.value = "";
    drawGraph();
}

// ===============================
// Drawing Graph
// ===============================

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;

    for (const u in graph) {
        for (const v of graph[u]) {
            ctx.beginPath();
            ctx.moveTo(positions[u].x, positions[u].y);
            ctx.lineTo(positions[v].x, positions[v].y);
            ctx.stroke();
        }
    }

    // Draw nodes
    for (const node in graph) {
        drawNode(node, visited[node] ? colors.visited : colors.unvisited);
    }
}

function drawNode(node, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(positions[node].x, positions[node].y, 20, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node, positions[node].x, positions[node].y);
}

// ===============================
// BFS
// ===============================

async function startBFS() {
    if (isAnimating) return;

    const startNode = prompt("Enter the starting node for BFS:");
    if (!(startNode in graph)) return;

    resetTraversal();
    isAnimating = true;

    let queue = [startNode];
    visited[startNode] = true;

    while (queue.length > 0) {
        const node = queue.shift();

        highlightNode(node, colors.current);
        traversalOrder.push(node);
        updateTraversalDisplay();

        await sleep(getSpeed());

        for (let neighbor of graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.push(neighbor);
            }
        }

        highlightNode(node, colors.visited);
    }

    isAnimating = false;
}

// ===============================
// DFS
// ===============================

async function startDFS() {
    if (isAnimating) return;

    const startNode = prompt("Enter the starting node for DFS:");
    if (!(startNode in graph)) return;

    resetTraversal();
    isAnimating = true;

    await dfsRecursive(startNode);

    isAnimating = false;
}

async function dfsRecursive(node) {
    visited[node] = true;

    highlightNode(node, colors.current);
    traversalOrder.push(node);
    updateTraversalDisplay();

    await sleep(getSpeed());

    for (let neighbor of graph[node]) {
        if (!visited[neighbor]) {
            await dfsRecursive(neighbor);
        }
    }

    highlightNode(node, colors.visited);
}

// ===============================
// Helper Functions
// ===============================

function highlightNode(node, color) {
    drawGraph(); // redraw full graph first
    drawNode(node, color);
}

function resetTraversal() {
    traversalOrder = [];
    visited = resetVisited();
    updateTraversalDisplay();
    drawGraph();
}

function resetVisited() {
    let reset = {};
    for (let node in graph) {
        reset[node] = false;
    }
    return reset;
}

function updateTraversalDisplay() {
    const output = document.getElementById("traversalOutput");
    if (traversalOrder.length === 0) {
        output.innerText = "No traversal yet";
    } else {
        output.innerText = traversalOrder.join(" → ");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getSpeed() {
    return parseInt(document.getElementById("speedControl").value);
}

function resetGraph() {
    graph = {};
    positions = {};
    visited = {};
    traversalOrder = [];
    isAnimating = false;

    document.getElementById("traversalOutput").innerText = "No traversal yet";
    drawGraph();
}