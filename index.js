onload = () => { //await onload page event.

    let spacing = 50; //cell grid 25 x 25
    let lines = "#eee"; //grid grey.
    let cell_color = "#ccc"; //cell colour grey.

    let events = { //state of events.
        md : false, //mouse key down event.
        ctrl : false, //ctrl key down event.
    }

    //manage objects
    let grid = new Set(); // add objects of cell set of array (render from this set)

    //previous mouse pos.
    let x = 0; 
    let y = 0;

    //change in axis x and y mouse pos.
    let dx = 0;
    let dy = 0;

    //global variables
    let canvas = document.getElementById("cell");
    let ctx = canvas.getContext("2d"); //context of canvas, assigned on onload.

    function size(width, height) {
        canvas.width = width; 
        canvas.height = height;
    }

    function init() {
        //+spacing at end of y part to fill in the void from of page./
        size((Math.round(window.innerWidth / spacing)*spacing), (Math.round(window.innerHeight / spacing)*spacing)+spacing);
        draw();
    }

    function draw() { //draw canvas grid
        ctx.save();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#eeeee";
        // ctx.lineWidth = 0.5;

        ctx.clearRect(0,0, canvas.width, canvas.height); //clear canvas from (0,0)        
        ctx.beginPath();

        // -dx to span in same direction as mouse cursor. i.e. left, canvas translates left.
        // dy to span in opposite direction as mouse cursor. i.e. up, canvas translates down.
        
        //add '/ spacing' after x < canvas.width + Math.abs(dx) , to view original viewport sized canvas
        // column lines
        for (let x = 0.5; x < canvas.width + Math.abs(dx) / spacing; x += spacing) {
            if (dx > 0) {
                //span +x
                ctx.moveTo(-dx + x, 0); //dx + x, top
                ctx.lineTo(-dx + x, canvas.height); //dx -> x, bottom
            } else {
                //span -x, + canvas.width to span additional page, not until (0,0) / previous pos, but rather entire page.
                ctx.moveTo(-dx - x + canvas.width, 0); //-inf, top
                ctx.lineTo(-dx - x + canvas.width, canvas.height); //-inf, top
            }
        }
    
        // row lines
        for (let y = 0.5; y < canvas.height + Math.abs(dy) / spacing; y += spacing) {
            if (dy > 0) {
                //span (down) +y 
                ctx.moveTo(0, -dy + y); //-inf, top
                ctx.lineTo(canvas.width , -dy + y) //inf, -inf    
            } else {
                //span (up) -y
                ctx.moveTo(0,-dy - y + canvas.height);
                ctx.lineTo(canvas.width, -dy - y + canvas.height);
            }
        }

        //four conditions of cell's dx, and dy (used to keep it rendered onpage)
        // dx, dy
        
        // -dx, -dy 

        // dx, -dy 
        // -dx, dy

        // if (dx >= 0 && dy >= 0) { // +dx, +dy
        //     ctx.fillRect(50-Math.abs(dx),50-Math.abs(dy), spacing, spacing)
        // }

        // if (dx <= 0 && dy <= 0) { // -dx, -dy
        //     ctx.fillRect(50+Math.abs(dx),50+Math.abs(dy), spacing, spacing)
        // } 

        // if (dx <= 0 && dy >= 0) { // -dx, +dy
        //     ctx.fillRect(50+Math.abs(dx),50-Math.abs(dy), spacing, spacing)
        // }

        // if (dx >= 0 && dy <= 0) { // +dx, -dy
        //     ctx.fillRect(50-Math.abs(dx), 50+Math.abs(dy), spacing, spacing)
        // }

        ctx.stroke(); //render lines
        ctx.closePath(); //stop drawing lines
        ctx.restore(); //restore previous state.

    }

    init()

    // a b c
    // d z e
    // f g h
    let local = null;
    function add(cell) { //check adjacent cell (1) relative to this cell. (if conditions right, add to cell map)
        let z = cell;

        //cells in grid relative to z (itself)

        let a = [z[0]-spacing, z[1]-spacing];
        let b = [z[0]+0, z[1]-spacing];
        let c = [z[0]+spacing, z[1]-spacing];
        
        let d = [z[0]-spacing, z[1]+0];
        let e = [z[0]+spacing, z[1]+0];

        let f = [z[0]-spacing, z[1]+spacing];
        let g = [z[0]+0, z[1]+spacing];
        let h = [z[0]+spacing, z[1]+spacing];

        //adjacent cells
        local = [a,b,c,d,e,f,g,h];

        let count = null; //count adjacent cells

        //o(n) time complexity, as it is o(l * g) local * grid , but since local will not grow in size, 8*n therefore o(n) 
        //check adjacent cells relative to current cell
        // local.forEach((l) => {
        //     grid.forEach((c) => {
        //         if (c[0]*spacing == l[0] && c[1]*spacing == l[1]) {
        //             count += 1;
        //         }
        //     });
        // });

        //o(8) time complexity, as it's only iterating through local. for set.has() method is o(1), there having 8 elements in local, grid has to check local 8 times. -> o(8).
        for (let l of local) {
            let c = [l[0]/spacing,l[1]/spacing]

            if (grid.has(c.toString())) {
                count += 1;
            }
        }


        // for (let c of grid) {
        //     console.log(c[0]*spacing,);
        // }

        console.log("neighbors of",z[0],z[1],": ", count)
    }

    function adjacent(local) { //check neighboring cell of checked cell. 
        for (let i = 0; i <= local.length; i++) {
              
        }
    }

    function step() {

    }

    //test for neightbors of [1,1]
    let a = [0,0]; grid.add(a.toString());
    let b = [1,0]; grid.add(b.toString());
    let c = [2,0]; grid.add(c.toString());
    let d = [0,1]; grid.add(d.toString());
    let e = [1,1]; grid.add(e.toString());
    let f = [2,1]; grid.add(f.toString());
    let g = [0,2]; grid.add(g.toString());
    let h = [1,2]; grid.add(h.toString());
    let i = [2,2]; grid.add(i.toString());

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has
    //have to convert coordinates [x,y] to string "[x,y]", as .add([0,0]) won't reference to the same .has([0,0])


    // onresize event handler property
    onresize = () => {
        size((Math.round(window.innerWidth / spacing)*spacing), (Math.round(window.innerHeight / spacing)*spacing)+spacing);
        draw();
    }

    // onmouse... event handler property
    onmousedown = (event) => {
        events.md = true;

        // set origin mouse pos. (+dx and dy to account for changes)
        x = event.clientX + dx;  
        y = event.clientY + dy;

        console.log("\noriginal mousedown pos:",x,"x",y)

        console.log(Math.floor(x/50)*50, Math.floor(y/50)*50) //coordinates
        console.log(Math.floor(x/spacing), Math.floor(y/spacing)) //cell x,y

        let cell = [Math.floor(x/50)*50, Math.floor(y/50)*50]

        //add Cell to Map() "memory"
        let a = cell;
        add(a);


        step();
    }

    onmouseup = () => {
        events.md = false;
        
        console.log("change in mouse pos from (0,0)",dx,"x",-dy); //negative dy for opposite movement of cursor in y direction
        console.log("new mouse pos:",x + dx,"x",y + -dy);
        draw();

        document.body.style.cursor = "default";
    }

    onmousemove = (event) => {
        if (events.md) {
            dx = x - event.clientX ; //displacement in x coordinate from origin pos.
            dy = y - event.clientY ; //displacement in y coordinate from origin pos.
            draw();
            // console.log(dx, dy)

            document.body.style.cursor = "grabbing";
        }
    }

    //onkey... event handler property
    onkeydown = (event) => {
        // if (event.ctrlKey) {
        //     events.ctrl = true; 
        // }
    }
 
    onkeyup = () => {
        // events.ctrl = false;
    }
}


//note
// equivalent to writing a "addEventListener() method"
// i.e. EventTarget.addEventListener("eventType", (event) => {...}); ... allows for multiple listeners to be assigned to an element 