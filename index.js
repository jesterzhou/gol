onload = () => { //await onload page event.

    let spacing = 50; //cell grid 25 x 25
    let lines = "#eee"; //grid grey.
    let cell_color = "#ccc"; //cell colour grey.

    let events = { //state of events.
        md : false, //mouse key down event.
        ctrl : false, //ctrl key down event.
    }

    //manage objects
    let grid = new Map(); // add objects of cell to array (render from this map)

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
        size((Math.round(window.innerWidth / spacing)*spacing), Math.round(window.innerHeight / spacing)*spacing);
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

        if (dx >= 0 && dy >= 0) { // +dx, +dy
            ctx.fillRect(50-Math.abs(dx),50-Math.abs(dy), spacing, spacing)
        }

        if (dx <= 0 && dy <= 0) { // -dx, -dy
            ctx.fillRect(50+Math.abs(dx),50+Math.abs(dy), spacing, spacing)
        } 

        if (dx <= 0 && dy >= 0) { // -dx, +dy
            ctx.fillRect(50+Math.abs(dx),50-Math.abs(dy), spacing, spacing)
        }

        if (dx >= 0 && dy <= 0) { // +dx, -dy
            ctx.fillRect(50-Math.abs(dx), 50+Math.abs(dy), spacing, spacing)
        }

        ctx.stroke(); //render lines
        ctx.closePath(); //stop drawing lines
        ctx.restore(); //restore previous state.

    }

    init()

    class Cell {
        //state of cell (0) (1), neighbor count
        constructor(_cell) {
            //convert cell x,y to coord. x,y
            this._x = (_cell[0] * spacing); //cell # of x.
            this._y = (_cell[1] * spacing); //cell # of y.

            this.state = false;
            this.adjacent = null;
        }

        //mutator method

        /**
         * @param {boolean} i
         */
        set sta(i) {
            this.state = i;
        }


        //accessor method

        //self is a keyword (cannot use as method identifier)
        //cell is id, will return element cell. (cannot use as method identifier)
        
        get c() {
            return [this._x, this._y];
        }

    }

    // a b c
    // d z e
    // f g h
    function add(cell) { //check adjacent cell (1) relative to this cell. (if conditions right, add to cell array)
        let z = cell.c;

        let a = [z[0]-spacing, z[1]-spacing];
        let b = [z[0]+0, z[1]-spacing];
        let c = [z[0]+spacing, z[1]-spacing];
        
        let d = [z[0]-spacing, z[1]+0];
        let e = [z[0]+spacing, z[1]+0];

        let f = [z[0]-spacing, z[1]+spacing];
        let g = [z[0]+0, z[1]+spacing];
        let h = [z[0]+spacing, z[1]+spacing];

        //adjacent cells
        let local = [a,b,c,d,e,f,g,h];

        grid.forEach((c) => {
            local.forEach((l) => {
                if (c._x == l[0] && c._y == l[1]) {
                    console.log("@")
                }
            });                
        });

    }

    let xz = new Cell([0,0])
    grid.set(0,xz)

    // onresize event handler property
    onresize = () => {
        size((Math.round(window.innerWidth / spacing)*spacing), Math.round(window.innerHeight / spacing)*spacing);
        draw();
    }

    // onmouse... event handler property
    onmousedown = (event) => {
        events.md = true;

        // set origin mouse pos. (+dx and dy to account for changes)
        x = event.clientX + dx;  
        y = event.clientY + dy;

        console.log("\noriginal mousedown pos:",x,"x",y)

        // console.log(Math.ceil(x*spacing) / spacing)
        let cell = [Math.floor(x/spacing), Math.floor(y/spacing)];
        console.log(Math.floor(x/50)*50, Math.floor(y/50)*50)
        
        let a = new Cell(cell);
        add(a);



    }

    onmouseup = () => {
        events.md = false;
        
        console.log("change in mouse pos from (0,0)",dx,"x",-dy); //negative dy for opposite movement of cursor in y direction
        console.log("new mouse pos:",x + dx,"x",y + -dy);
        draw();

    }

    onmousemove = (event) => {
        if (events.md) {
            dx = x - event.clientX ; //displacement in x coordinate from origin pos.
            dy = y - event.clientY ; //displacement in y coordinate from origin pos.
            draw();
            // console.log(dx, dy)
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