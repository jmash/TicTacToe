'use strict'

/**
 * Initializes a tic-tac-toe board. 
 * @constructor 
 */
var Board = function(){
    this.grid = [[null, null, null],
                 [null, null, null],
                 [null, null, null]];
    this.playerFlag = 1; // 1 for X, 2 for O
    this.victoryFlag = 0;
    this.changeFlag = 0;
    this.endGame = false;
};

/**
 * Marks a cell in the Board grid with an X at the
 * given x and y coordinates.
 *
 * @method markX
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 */
Board.prototype.markX = function(x, y) {
   if (this.endGame === true) { return false; }
   if (this.grid[x][y] === null) {
       this.grid[x][y] = 'X';
       this.changeFlag = true;
       return true;
   } else {
       return false;
   }
};

/**
 * Marks a cell in the Board grid with an O at the
 * given x and y coordinates.
 *
 * @method markO
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 */
Board.prototype.markO = function(x, y) {
   if (this.endGame === true) { return false; }
   if (this.grid[x][y] === null) {
       this.grid[x][y] = 'O';
       this.changeFlag = true;
       return true;
   } else {
       return false;
   }
};

/**
 * Method to invoke for the click event on the
 * Board cells. Gets the id from the event target
 * (which are the x and y coordinates separated
 * by '_') and splits it into components. The
 * components are used to look up the position in
 * the board grid and apply the appropriate mark.
 *
 * @method click
 */
Board.prototype.playerClick = function(e) {
    var id = [];
    var idStr = e.getAttribute("id");
    id = idStr.split("_");       
    for (var i = 0; i < id.length; i++) {
        id[i] = parseInt(id[i]);
    }
    if (this.playerFlag === 1) { 
        if (this.markX(id[0], id[1])) {
            this.playerFlag = 2;
        }
    } else {
        if (this.markO(id[0], id[1])) {
            this.playerFlag = 1;
        }
    }
    this.update();
    $(e.firstChild).css("font-size", "5px");
    $(e.firstChild).animate({fontSize:"50px"}, 500, 'easeOutBounce');
};

/**
 * Renders the entire board onto the screen.
 * Currently only targets a DOM element with the
 * id of "board".
 *
 * @method render
 */
Board.prototype.render = function() {
    var board = document.getElementById("board");
    board.setAttribute("align", "center");
    var header = document.createElement("thead");
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.setAttribute("colspan", "3");
    board.appendChild(header);
    header.appendChild(tr);
    tr.appendChild(th);
    th.innerHTML = "Tic Tac Toe";
    var tbody = document.createElement("tbody");
    board.appendChild(tbody);
    for (var i = 0; i <= 2; i++) {
        var tr = document.createElement("tr");
        tr.setAttribute("id", "r_" + i);
        tbody.appendChild(tr); 
        for(var j = 0; j <= 2; j++) {
            var td = document.createElement("td"); 
            td.setAttribute("id", i + "_" + j);
            td.onclick = (function(obj) {
                return function() {
                    obj.playerClick(this);
                } 
            })(this);
            var row = document.getElementById("r_" + i);
            row.appendChild(td); 
        }
    } 
    var tfoot = document.createElement("tfoot"); 
    var tr = document.createElement("tr");
    var tdMessages = document.createElement("td");
    tdMessages.setAttribute("id", "messages");
    tdMessages.setAttribute("colspan", "3");
    board.appendChild(tfoot);
    tfoot.appendChild(tr);
    tr.appendChild(tdMessages);
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.setAttribute("colspan", "3");
    var reset = document.createElement("input");
    reset.setAttribute("type", "button"); 
    reset.setAttribute("value", "Reset");
    reset.onclick = (function(obj) {
        return function() {
            obj.reset();
        }
    })(this);
    tfoot.appendChild(tr);
    tr.appendChild(td);
    td.appendChild(reset);
};

/**
 * Runs through each cell and check it against the Board grid.
 * If the grid cell contains an X or an O, update the 
 * screen to display the appropriate letter.   
 *
 * @method update
 */

Board.prototype.update = function() {
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (this.grid[i][j] === 'X') {
                cell.innerHTML = '<p>X</p>';
            }
            if (this.grid[i][j] === 'O') {
                cell.innerHTML = '<p>O</p>';
            }
            if (this.grid[i][j] === null) {
                cell.innerHTML = '';
            }
        }
    }
    
    this.checkVictory();
    return 0;
};


/**
 * Checks all victory conditions (horizontal, vertical, both
 * diagonals).
 *
 * @method checkVictory
 */

Board.prototype.checkVictory = function() {
    // a check of victory conditions should be run on every
    // update as well
    function allO(el) { return el === 'O'; }
    function allX(el) { return el === 'X'; }
    function setFlag(L) {
        if (L.every(allX)) { return 1; } 
        if (L.every(allO)) { return 2; } 
        return 0;
    }
    
    // check all horizontals
    for (var i = 0; i <= 2; i++) {
        if(setFlag(this.grid[i])) { this.victoryFlag = setFlag(this.grid[i]); break; }
    }
    if (this.printVictory()) { return true; }
    // check all verticals
    for (var i = 0; i <= 2; i++) {
        var verts = [];
        for (var j = 0; j <= 2; j++) {
            verts.push(this.grid[j][i]);    
        }
        if(setFlag(verts)) { this.victoryFlag = setFlag(verts); break; }
    }
    if (this.printVictory()) { return true; }
    // check forward diagonal
    var forwardD = [];
    for (var i = 0; i <= 2; i++) {
        forwardD.push(this.grid[i][2-i]);
    }
    this.victoryFlag = setFlag(forwardD);
    if (this.printVictory()) { return true; }
    // check backward diagonal
    var backwardD = [];
    for (var i = 0; i <= 2; i++) {
        backwardD.push(this.grid[i][i]);
    }
    this.victoryFlag = setFlag(backwardD);
    if (this.printVictory()) { return true; }
    // check draw condition (all cells are full and victory flag set to 0)
    var nullFlag = false;
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            if (this.grid[i][j] !== 'X' && this.grid[i][j] !== 'O') { nullFlag = true; break; }
        }
        if (nullFlag === true) break;
    }
    if (nullFlag === false && this.victoryFlag === 0) {
       this.victoryFlag = 3;
    }
    if (this.printVictory()) { return true; }
};

/**
 * Once a victory condition has been realized,
 * print a congratulatory message for the winner,
 * or declare a draw.
 *
 * @method printVictory
 */
Board.prototype.printVictory = function() {
    var message = document.getElementById("messages");
    if (this.victoryFlag === 0) { message.innerHTML = "Game in Progress"; } 
    if (this.victoryFlag === 1) { message.innerHTML = "X is the Winner!"; this.endGame = true; return true; }
    if (this.victoryFlag === 2) { message.innerHTML = "O is the Winner!"; this.endGame = true; return true; }
    if (this.victoryFlag === 3) { message.innerHTML = "The Game is a Draw!"; this.endGame = true; return true; }
    return false;
}

/**
 * Resets all constructor variables back to initial settings.
 *
 * @method reset
 */

Board.prototype.reset = function() { 
    this.grid = [[null, null, null],
                 [null, null, null],
                 [null, null, null]];
    this.playerFlag = 1;
    this.victoryFlag = 0;
    this.changeFlag = false;
    this.endGame = false;
    this.update();
}
