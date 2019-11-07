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
})
var ghosts = new Array();
var timer1 = '';
ghosts['coordinates'] = [];
ghosts['speed'] = 0.5;
ghosts['location_in_array'] = 0;

ghosts['prev_dir'] = 'forware';
ghosts['prev_xy'] = '';
ghosts['try_nr'] = 0;
// ghosts[1]['position']['init'] = [9, 2];
// ghosts[1]['position']['current'] = [9, 2];
// ghosts[1]['speed'] = 2;
// ghosts[2]['position']['init'] = [6, 4];
// ghosts[2]['position']['current'] = [6, 4];
// ghosts[2]['speed'] = 3;
var player_position = [0, 0];

function make_maze() {

    let outDev = document.getElementById('maze-container');
    //Loop through each row
    let xp = 1;
    for (y = 0; y < array_map.length; y++) {

        //Loop through row's items
        for (x = 0; x < array_map[y].length; x++) {
            //Create div element
            let rowNode = document.createElement('div');
            let maze_border = 'grid-item';
            let player_div = document.createElement('div');
            let finish_div = document.createElement('div');
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
                if (array_map[y][x].includes('G')) {
                    ghosts['coordinates'].push([x, y]);
                }
                //Check if is maze start
                if (array_map[y][x].includes('S')) {
                    player_div.setAttribute('class', 'player_position');
                    player_div.setAttribute('id', 'player_position');
                    // player_div.setAttribute('data-position',x+'-'+y);
                    rowNode.appendChild(player_div);
                    player_position = [x, y];
                }
                //Check if maze ends
                if (array_map[y][x].includes('F')) {
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
    make_ghosts();
}
function move_player(direction) {
    console.log('direction:' + direction);

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
            clearInterval(timer1);
            alert('Game finished');
        }
        else {
            let new_grid = document.getElementById(new_position[0] + '-' + new_position[1]);
            let player_div = document.createElement('div');
            player_div.setAttribute('class', 'player_position');
            player_div.setAttribute('id', 'player_position');
            // player_div.setAttribute('data-position',x+'-'+y);
            new_grid.appendChild(player_div);
        }
        player_position = [x, y];
    }
    console.log(' position:' + player_position);
}
var make_ghosts = function make_ghosts() {
    let ghost_direction = 'forward';
    timer1 = setInterval(() => {
        //Current position of ghost in Position's array
        let ghost_pos = ghosts['location_in_array'];
        const ghost_array_length = ghosts['coordinates'].length-1;
        //X , Y value based on location
        let ghost_xy_coordinate = ghosts['coordinates'][ghost_pos];
        const current_x = parseInt(ghost_xy_coordinate[0]);
        const current_y = parseInt(ghost_xy_coordinate[1]);
        let next_x = next_y = 0;
        const player_x = parseInt(player_position[0]);
        const player_y = parseInt(player_position[1]);
        if (current_x === player_x && current_y === player_y) {
            alert('You lost');
            clearInterval(timer1);
           
        }
        //Check if in array range
        if (ghost_direction === 'forward') {
            if (ghost_pos < ghost_array_length-1) {
                ghost_pos++;
            }
            else{
                ghost_direction = 'backward';
            }
        }
        //To move zombie in other direction
        else {
            if (ghost_pos > 0) {
                ghost_pos--;
            }
            else{
                ghost_direction = 'forward';
            }
            ghosts['location_in_array'] = ghost_pos;
        }
        ghost_xy_coordinate = ghosts['coordinates'][ghost_pos];
        next_x = parseInt(ghost_xy_coordinate[0]);
        next_y = parseInt(ghost_xy_coordinate[1]);
        ghosts['location_in_array'] = ghost_pos;
        //Find current position of ghost in maze
        let current_grid = document.getElementById(current_x + '-' + current_y);
        current_grid.innerHTML = '';
        let ghost_div = document.createElement('div');
        ghost_div.setAttribute('class', 'ghosts_position');
        ghost_div.setAttribute('id', 'ghosts_position');

        //Create new ghost position

        let new_grid = document.getElementById(next_x+ '-' + next_y);
        new_grid.appendChild(ghost_div);
        // ghosts['try_nr']++;
        // ghosts['position'] = [x, y];
        // let direction_arr = ['L', 'T', 'R', 'B'];
        /*
        let dir_found = true;
        do {
            let random_dir = direction_arr[Math.floor(Math.random() * direction_arr.length)];
            let prev_dir = ghosts['prev_dir'];
            let oposit_dir = '';
            //Find next direction in array
            if (prev_dir != '') {
                switch (prev_dir) {
                    case 'L':
                        oposit_dir = 'R';
                        break;
                    case 'T':
                        oposit_dir = 'B';
                        break;
                    case 'R':
                        oposit_dir = 'L';
                        break;
                    case 'B':
                        oposit_dir = 'T';
                        break;
                }
            }
            else {
                prev_dir = random_dir;
                if (ghosts['try_nr'] < 5 && ghosts['try_nr'] != 0) {
                    prev_dir = ghosts['prev_move'];
                }
            }

            switch (prev_dir) {
                case 'L':
                    //If x position is not out of array boundary
                    //If not in left side
                    if (!array_map[y][x].includes('L')) {
                        x = (x > 0) ? x - 1 : x;
                        ghosts['prev_move'] = 'L';
                    }
                    else if (oposit_dir != '') {

                    } else {

                    }
                    break;
                case 'T':
                    if (!array_map[y][x].includes('T')) {
                        //If not in first line
                        y = y > 0 ? y - 1 : y;
                        ghosts['prev_move'] = 'T';
                    }
                    break;
                case 'R':
                    if (!array_map[y][x].includes('R')) {
                        //if not in right side, so that not exceed array boundary
                        x = x < array_map[x].length ? x + 1 : x;
                        ghosts['prev_move'] = 'R';
                    }
                    break;
                case 'B':
                    if (!array_map[y][x].includes('B')) {
                        y = y < array_map.length ? y + 1 : y;
                        ghosts['prev_move'] = 'B';
                    }
                    break;
            }
            let new_position = [x, y];
        } while (dir_found);
        */

    }, 300 / ghosts['speed']);
}

var array_map = [
    ['LTB', 'TR', 'LT', 'TR', 'SLB', 'TB', 'TR', 'LT', 'TB', 'TR'],
    ['LTG', 'B', 'RB', 'LR', 'LT', 'TB', 'RB', 'LR', 'LT', 'BR'],
    ['LG', 'TBG', 'TRG', 'LR', 'LB', 'T', 'TB', 'BR', 'LB', 'TRB'],
    ['LR', 'LT', 'RG', 'LB', 'TR', 'LB', 'TR', 'LT', 'TB', 'TR'],
    ['LR', 'LR', 'LBG', 'TRG', 'LB', 'TB', 'RB', 'LRB', 'LT', 'RB'],
    ['LR', 'LR', 'LTR', 'LR', 'LT', 'TR', 'LTR', 'LT', 'RB', 'LTR'],
    ['LR', 'LR', 'L', 'RB', 'LRB', 'LR', 'L', 'RB', 'LTR', 'LR'],
    ['LR', 'LR', 'LB', 'TB', 'TR', 'L', '', 'TB', 'RB', 'LR'],
    ['LR', 'LRB', 'LT', 'TR', 'LB', 'RB', 'LR', 'LTB', 'T', 'R'],
    ['LB', 'TB', 'RB', 'LB', 'TB', 'FTR', 'LB', 'TB', 'RB', 'LRB'],
]