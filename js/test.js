document.addEventListener("keydown", function (event) {
    let key_dir = '';
    switch (event.keyCode) {
        //Left
        case 65:
            key_dir = "L";
            break;
        case 87:
            key_dir = "T";
            break;
        case 68:
            key_dir = "R";
            break;
        case 83:
            key_dir = "B";
            break;
    }
    move_player(key_dir);
    event.preventDefault();
});
var ghosts = {
    H: { coordinates: [[0, 1],[0, 2],[1, 2],[2, 2],[2, 3],[2, 4],[3, 4]], speed: 0.5, location_in_array: 0, ghost_direction: 'forward' },
    G: { coordinates: [[4, 2],[5, 2],[6, 2],[7, 2]], speed: 0.5, location_in_array: 0, ghost_direction: 'forward' }
};
ghosts_timer = [];
var ghostH = '';
var ghostG = '';
// ghost['G']['coordinates'] = [];
// ghost['G']['speed'] = 0.5;
// ghost['G']['location_in_array'] = 0;

// ghost['G']['coordinates'] = [];
// ghost['G']['speed'] = 0.5;
// ghost['G']['location_in_array'] = 0;

var player_position = [0, 0];

function make_maze() {

    let outDev = document.getElementById('maze-container');
    outDev.innerHTML = '';
    for (y = 0; y < array_map.length; y++) {

        //Loop through row's items
        for (x = 0; x < array_map[y].length; x++) {
            //Create div element
            let rowNode = document.createElement('div');
            let maze_border = 'grid-item';
            //Set div's borders
            try {

                if (!array_map[y][x].includes('L')) {
                    maze_border += ' ' + 'no-left';
                }
                if (!array_map[y][x].includes('T')) {
                    maze_border += ' ' + 'no-top';
                }
                if (!array_map[y][x].includes('R')) {
                    maze_border += ' ' + 'no-right';
                }
                if (!array_map[y][x].includes('B')) {
                    maze_border += ' ' + 'no-bottom';
                }
                // if (array_map[y][x].includes('G')) {
                //     ghosts.G['coordinates'].push([x, y]);
                // }
                // if (array_map[y][x].includes('H')) {
                //     ghosts.H['coordinates'].push([x, y]);
                // }
                //Check if is maze start
                if (array_map[y][x].includes('S')) {

                    let player_div = document.createElement('div');
                    player_div.innerHTML = '&#128378;';
                    player_div.setAttribute('class', 'player_position');
                    player_div.setAttribute('id', 'player_position');
                    // player_div.setAttribute('data-position',x+'-'+y);
                    rowNode.appendChild(player_div);
                    player_position = [x, y];
                }
                //Check if maze ends
                if (array_map[y][x].includes('F')) {
                    let finish_div = document.createElement('div');
                    finish_div.innerHTML = '&#128682;';
                    finish_div.setAttribute('class', 'finish_position');
                    finish_div.setAttribute('id', 'finish_position');
                    // finish_div.setAttribute('data-position',x+'-'+y);
                    rowNode.appendChild(finish_div);
                }
            } catch (error) {

                console.log(error);
            }
            rowNode.setAttribute('id', x + '-' + y)
            rowNode.className = maze_border;
            outDev.appendChild(rowNode);
        }
    }
    ghost_timer();
}
function move_player(direction) {
    // let current_position = position_data.split('-').map(octet => parseInt(octet));
    let x = parseInt(player_position[0]);
    let y = parseInt(player_position[1]);
    switch (direction) {
        case 'L':
            //If x position is not out of array boundary
            //If not in left side
            if (!array_map[y][x].includes('L')) {
                x = (x > 0) ? x - 1 : x;
            }
            break;
        case 'T':
            if (!array_map[y][x].includes('T')) {
                //If not in first line
                y = y > 0 ? y - 1 : y;
            }
            break;
        case 'R':
            if (!array_map[y][x].includes('R')) {
                //if not in right side, so that not exceed array boundary
                x = x < array_map[x].length ? x + 1 : x;
            }
            break;
        case 'B':
            if (!array_map[y][x].includes('B')) {
                y = y < array_map.length ? y + 1 : y
            }
            break;
    }
    let new_position = [x, y];

    //If position changed 
    if (JSON.stringify(player_position) !== JSON.stringify(new_position)) {

        let current_grid = document.getElementById(player_position[0] + '-' + player_position[1]);
        current_grid.innerHTML = '';
        if (array_map[y][x].includes('F')) {
            current_grid.innerHTML = '';
            clearInterval(ghostH);
            clearInterval(ghostG);
            player_position = [0, 0];
            alert('Game finished');
            make_maze();
        }
        else {
            let new_grid = document.getElementById(new_position[0] + '-' + new_position[1]);
            let player_div = document.createElement('div');
            player_div.innerHTML = '&#128378;';
            player_div.setAttribute('class', 'player_position');
            if (direction === 'L') {
                player_div.classList.add('dir_left');
            }
            player_div.setAttribute('id', 'player_position');
            // player_div.setAttribute('data-position',x+'-'+y);
            new_grid.appendChild(player_div);
        }
        player_position = [x, y];
    }
}
function ghost_timer() {
    ghostH = setInterval(() => {
        make_ghosts(ghosts.H);

    }, 300 / ghosts.H['speed']);
    ghostG = setInterval(() => {
        make_ghosts(ghosts.G);

    }, 300 / ghosts.G['speed']);
}
function make_ghosts(ghost) {
    
    //Current position of ghost in Position's array
    let ghost_pos = ghost['location_in_array'];
    const ghost_array_length = ghost['coordinates'].length - 1;
    //X , Y value based on location
    let ghost_xy_coordinate = ghost['coordinates'][ghost_pos];
    console.log(ghost['coordinates']);
    console.log(ghost_pos);
    const current_x = parseInt(ghost_xy_coordinate[0]);
    const current_y = parseInt(ghost_xy_coordinate[1]);
    let next_x = next_y = 0;
    const player_x = parseInt(player_position[0]);
    const player_y = parseInt(player_position[1]);
    if (current_x === player_x && current_y === player_y) {
        alert('You lost');
        clearInterval(ghostH);
        clearInterval(ghostG);
        player_position = [0, 0];
        make_maze();
    }
    //Check if in array range
    if (ghost['ghost_direction'] === 'forward') {
        if (ghost_pos < ghost_array_length) {
            ghost_pos++;
        }
        else {
            ghost['ghost_direction'] = 'backward';
            if (ghost_pos > 0) {
                ghost_pos--;
            }
        }
    }
    //To move zombie in other direction
    else {
        if (ghost_pos > 0) {
            ghost_pos--;
        }
        else {
            ghost['ghost_direction'] = 'forward';
            if (ghost_pos < ghost_array_length) {
                ghost_pos++;
            }
        }
        ghost['location_in_array'] = ghost_pos;
    }
    ghost_xy_coordinate = ghost['coordinates'][ghost_pos];
    next_x = parseInt(ghost_xy_coordinate[0]);
    next_y = parseInt(ghost_xy_coordinate[1]);
    ghost['location_in_array'] = ghost_pos;
    //Find current position of ghost in maze
    let current_grid = document.getElementById(current_x + '-' + current_y);
    current_grid.innerHTML = '';
    let ghost_div = document.createElement('div');
    ghost_div.innerHTML = '&#128123;';
    ghost_div.setAttribute('class', 'ghosts_position');
    ghost_div.setAttribute('id', 'ghosts_position');
    //Create new ghost position
    let new_grid = document.getElementById(next_x + '-' + next_y);
    new_grid.appendChild(ghost_div);
}

var array_map = [
    ['LTB', 'TR', 'LT', 'TR', 'SLB', 'TB', 'TR', 'LT', 'TB', 'TR'],
    ['LTG', 'B', 'RB', 'LR', 'LT', 'TB', 'RB', 'LR', 'LT', 'BR'],
    ['LG', 'TBG', 'TRG', 'LR', 'LBH', 'TH', 'TBH', 'BRH', 'LB', 'TRB'],
    ['LR', 'LT', 'RG', 'LB', 'TR', 'LB', 'TR', 'LT', 'TB', 'TR'],
    ['LR', 'LR', 'LBG', 'TRG', 'LB', 'TB', 'RB', 'LRB', 'LT', 'RB'],
    ['LR', 'LR', 'LTR', 'LR', 'LT', 'TR', 'LTR', 'LT', 'RB', 'LTR'],
    ['LR', 'LR', 'L', 'RB', 'LRB', 'LR', 'L', 'RB', 'LTR', 'LR'],
    ['LR', 'LR', 'LB', 'TB', 'TR', 'L', '', 'TB', 'RB', 'LR'],
    ['LR', 'LRB', 'LT', 'TR', 'LB', 'RB', 'LR', 'LTB', 'T', 'R'],
    ['LB', 'TB', 'RB', 'LB', 'TB', 'FTR', 'LB', 'TB', 'RB', 'LRB'],
]