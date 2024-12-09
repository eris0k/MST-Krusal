/**
 * The class UnionFind code was inspired by William Fiset's youtube video
 * Here's the link https://www.youtube.com/watch?v=KbFlZYCpONw&t=74s&ab_channel=WilliamFiset 
 */
class UnionFind {
    constructor(size){
        this.size = size;
        this.sz = new Array(size).fill(1); // each component initally size 1
        this.id = new Array(size);

        for(let i = 0; i < size; i++){
            this.id[i] = i; // intially each component is self root
        }
    }
    // find where component p belongs to
    find(p){
        let root = p;
        while (root !== this.id[root]){
            root = this.id[root];
        }

        // path compression
        while(p !== root){
            let next = this.id[p];
            this.id[p] = root;
            p = next;
        }

        return root;
    }

    // check if element are connected
    connected(p, q) {
        return this.find(p) === this.find(q);
    }

    unify(p, q) {
        const root1 = this.find(p);
        const root2 = this.find(q);

        if (root1 == root2) return false;

        if(this.sz[root1] < this.sz[root2]) {
            this.sz[root2] += this.sz[root1];
            this.id[root1] = root2;
        } else {
            this.sz[root1] += this.sz[root2];
            this.id[root2] = root1;
        }
    }

}

const stage = new Konva.Stage({
    container: 'container',
    width: 600,
    height: 450,
});

const layer = new Konva.Layer();

// data for problem 1
const problem1 = {

    nodes : [
        {
            id: "Gate",
            x: 50,
            y: 250
        },
        {
            id: "Library",
            x: 100,
            y: 110
        },
        {
            id: "Blanchard",
            x: 220,
            y: 350
        },
        {
            id: "Kendade",
            x: 220,
            y: 100
        },
        {
            id: "Amphitheater",
            x: 300,
            y: 220
        },
        {
            id: "Kendall",
            x: 480,
            y: 30
        },
        {
            id: "Art Building",
            x: 300,
            y: 150
        },
        
        
        
    ],
    
    edges : [
        // edge from gate to blanchard
        {
            from: 1, to: 2, weight: 5
        },
        // edge from gate to library
        {
            from: 1, to: 3, weight: 12
        },
        // edge from Library to Kendade
        {
            from: 2, to: 4, weight: 4
        },
        // edge from Blanchard to Amphitheater
        {
            from: 3, to: 5, weight: 5
        },
        // edge from Kendade to Kendall
        {
            from: 4, to: 6, weight: 16
        },
        // edge from Amphitheater to Art Building
        {
            from: 5, to: 7, weight: 2
        },
        // edge from Art Building to Kendall
        {
            from: 7, to: 6, weight: 16
        },
        // edge from Gate to Amphitheater
        {
            from: 1, to: 5, weight: 9
        },
        // edge from Kendade to Art Building
        {
            from: 4, to: 7, weight: 3
        },
        // edge from Blanchard to Library
        {
            from: 3, to: 2, weight: 10
        },
        // edge from Blanchard to Kendade
        {
            from: 3, to: 4, weight: 10
        },
    ]
}

// data for problem 2
const problem2 = {

    nodes: [
        {
            id: "A",
            x: 80,
            y: 300
        },
        {
            id: "B",
            x: 100,
            y: 180
        },
        {
            id: "C",
            x: 220,
            y: 240
        },
        {
            id: "D",
            x: 180,
            y: 290
        },
        {
            id: "E",
            x: 300,
            y: 150
        },
        {
            id: "F",
            x: 310,
            y: 220
        },
        {
            id: "G",
            x: 470,
            y: 180
        },
        {
            id: "H",
            x: 350,
            y: 300
        },
        {
            id: "I",
            x: 190,
            y: 340
        },
    ],

    edges: [
        // edge from A to B
        {
            from: 1, to: 2, weight: 5
        },
        // edge from B to C
        {
            from: 2, to: 3, weight: 5
        },
        // edge from A to D
        {
            from: 1, to: 4, weight: 3
        },
        // edge from C to D
        {
            from: 3, to: 4, weight: 2
        },
        // edge from B to E
        {
            from: 2, to: 5, weight: 10
        },
         // edge from C to F
         {
            from: 3, to: 6, weight: 5
        },
        // edge from E to F
        {
            from: 5, to: 6, weight: 4
        },
        // edge from E to G
        {
            from: 5, to: 7, weight: 9
        },
        // edge from F to G
        {
            from: 6, to: 7, weight: 8
        },
        // edge from F to H
        {
            from: 6, to: 8, weight: 6
        },
        // edge from G to H
        {
            from: 7, to: 8, weight: 9
        },
        // edge from A to I
        {
            from: 1, to: 9, weight: 4
        },
        // edge from H to I
        {
            from: 8, to: 9, weight: 10
        },
    ]
}

// initialize unionFind
//const unionFind = new UnionFind(problem.nodes.length);

// initialize the mst cost
let goalCost = 35;

// initialize the build cost;
let buildCost = 0;

// initialize the selected nodes
const selectedNodes = new Set();

// get the dom elements of the buttons
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

// get the dom element of the problem context text
const problemText = document.getElementById("problemContext");

function renderProblem(problem){

    // Clear previous problem
    layer.destroyChildren();

    // initialize unionFind
    const unionFind = new UnionFind(problem.nodes.length);

    // render edges
    problem.edges.forEach( edge => {
        const line = new Konva.Line({
            points: [
                problem.nodes[edge.from - 1].x,
                problem.nodes[edge.from - 1].y,
                problem.nodes[edge.to - 1].x,
                problem.nodes[edge.to - 1].y
            ],
            stroke: 'black',
            strokeWidth: 4,
            id: `${edge.from}-${edge.to}Edge`
        });
    
        // Midpoint for the edge weight
        const midX = (problem.nodes[edge.from - 1].x +  problem.nodes[edge.to - 1].x)/2;
        const midY = (problem.nodes[edge.from - 1].y +  problem.nodes[edge.to - 1].y)/2;
        
        const text = new Konva.Text({
            x: midX + 10,
            y: midY - 15,
            text: edge.weight,
            fontSize: 14,
            fontFamily: 'Josefin Sans',
        })
    
        
        layer.add(line);
        layer.add(text);
        
        // click event
        line.on('click', () => {
    
            // the nodes of the selected edge
            const p = edge.from - 1;
            const q = edge.to - 1;
    
            // check if create circle
            if(!unionFind.connected(p, q)){
                // no circle
                unionFind.unify(p, q);
    
                selectedNodes.add(p);
                selectedNodes.add(q);
                buildCost += edge.weight;
    
                line.stroke("green");
    
                // if traversed all the nodes
                if(selectedNodes.size === problem.nodes.length){
                    // if meet the minimum cost
                    if(buildCost === goalCost){
                        const winText = new Konva.Text({
                            x: 400,
                            y: 400,
                            text: "You are correct!",
                            fontSize: 26,
                            fontFamily: 'Josefin Sans',
                            fill: 'green'
                        })
                        layer.add(winText);
                    } else {
                        const failText = new Konva.Text({
                            x: 100,
                            y: 400,
                            text: "You are incorrect! Let's try that again!",
                            fontSize: 26,
                            fontFamily: 'Josefin Sans',
                            fill: 'red'
                        })
                        layer.add(failText);
                    }
                }
            } else {
                alert("Cannot select this edge because it will create circle");
                return;
            }
        })

        // hover event to change cursor
        line.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        line.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });
        
    })

    // render nodes
    problem.nodes.forEach( node => {
        const circle = new Konva.Circle({
            x: node.x,
            y: node.y,
            radius: 10,
            fill: 'blue',
            id: `${node.id}Node`,
        });
    
        const text = new Konva.Text({
            x: node.x - 20,
            y: node.y - 25,
            text: node.id,
            fontSize: 14,
            fontFamily: 'Josefin Sans',
        
        })
        layer.add(circle);
        layer.add(text);
    })
    
    stage.add(layer);
    
    layer.draw();
}

// event when click buttons
button1.addEventListener('click',()=>{
    problemText.innerText = "Winter is here and MHC is planning to string a twinkling lights around campus. However, the college has limited budget, so they decided to decorate only around some of the center buildings. Because they are so busy with other works, they appointed you to help them find the optimal round around these buildings to string the lights. Let's help them!"
    goalCost = 35;
    renderProblem(problem1);
})

button2.addEventListener('click',()=>{
    problemText.innerText = "WaterFun Company has bought a land and want to turn it into a grand water park. You were hired by them to help them determine what is the optimal round based on given stops to build a flow of water around the park. Let's start!"
    goalCost = 37;
    renderProblem(problem2);
})

renderProblem(problem1);

