    issues faced:
        1. the first issue that arose was devising a solution for an infinite canvas, this is the thought process on how I decided to use a cartesian-coordinate-system:
        
        for a n*n conway game of life, a 2d matrix of n*n can be used to manage game-state of cells, where in the n*n matrix, 0 can represent dead cells, while 1 can represent alive cells. 
        n*n can be determined by viewport x / individual grid size = # cells spanning x, viewport y / individual grid size = # cells spanning y. however, this solution provides a fixed grid, and does not allow an infinite grid. 
        prior to the cartesian-coordinate-system method, a similar approach was to the original 2d matrix solution which was thought of, using a 2d matrix and tracking the cell's location. if the cell is within the edges of the 2d array, an additional row or column will be fitted to await a possible new cell (a dynamic 2d array?). this however did not work as,
            1. for pre-existing cells, when a new row or column is appended to the existing 2d array, the original positions of the pre-existing cells will shift.
            2. if cells are within all 4 walls, updating the 2d array will be impossible.
            3. corners will not exist. provided, a 2d array is of rows and columns, if a cell were to "glider gun (like the gosper glider gun)" into either 1 of 4 corners, updating for corners will require an additional rows and columns to it's respective side, allocating null into the empty array indices will take up additional memory.

        while creating the solution for the infinite canvas, a problem I faced was understanding how to infinitely span the canvas, originally using the ctx.translate(dx,dy) method to horizontally-vertically translate the canvas, the intuition of using this built-in method was based on mousedown movement. i.e. however much the mouse had horizontally-vertically translated on screen, the canvas (ctx) would reflect that. however, this came with it's own set of problems. 
            1. row-column lines would not span to the edges of the canvas. (as it was not the grid which was moving, but rather the entire canvas element).
            2. the cartesian-coordinate-system of origin (0,0) would not follow the canvas translations.

        the solution to this was to track the change in mouse movement from the viewport origin (0,0) and change the viewport to a new viewport coordinates. 

        2. implementation of the logic

        when checking the adjacent cells, at first, I implemented an iterative approach. however, this caused inconsistencies with checking the alive adjacent cells's adjacent cells (to check for potential alive cells) as when the condition is met, it would add or delete a new cell to the grid. the proceeding cells to be checked would be essentially checking a "new step" version of grid, this problem also occured depending on the appending order of the cells. i.e. next step pattern is determined by how the cells are ordered in grid. the solution used was to seperate counting alive neighbors and differentiate current live cells and next live cells into it's own set().

    what I am proud of:
        quick note about html:
        in a browser, (0,0) is the topleft corner of the viewport (intial viewport).

        panning right (dragging left) provides +x
        panning left (dragging right) provides -x

        panning down (dragging up) provides +y
        panning up (dragging down) provides -y 
        note: in the console, the y values are negated to make it make sense to visual panning.

        1. developing the cartesian-coordinate-system and infinite canvas, how it works is based on mouse movement and viewport origin (0,0).
        the illusion of the canvas panning and infinite canvas is the result from change in mouse position, and change in where the lines are drawn. more in-depth in the "rendering" part.

        onmousedown:
            x = event.clientX + dx;
            y = event.clientY + dy;

            event.client ... constants, the intial mouse position (x,y), relative to the client viewport position. 
            + dx or dy to keep onmousedown (init) coordinates align with changes of viewport from origin (0,0).

        without tracking x or y, next onmousedown will result in the coordinates jumping back to original viewport dimension coordinates, i.e.
        changes from panning (mouse) in x or y directions will not affect the changes in viewport origin (0,0), meaning the canvas will not move and the coordinate system will not work.

        onmousemove: 
            dx = x - event.clientX;
            dy = y - event.clientY;

            x or y initial mouse position.
            event.client ... tracks the mouse position (x,y) of client viewport and is updated as mouse moves. 

            dx or dy is the changes of viewport position from viewport origin (0,0).

        2. rendering
            

    definitions:
        client viewport: the region of the screen with coordinates spanning the dimensions of the window.
        relative viewport coordinates: the new coordinates which span the viewport after panning (i.e. coordinates relative to new viewport position).
