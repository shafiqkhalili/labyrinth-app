class maze_cell {
  constructor(x,y) {
    
    this.id = id;
    this.timer1 = '';
    this.ghosts['coordinates'] = [];
    this.ghosts['speed'] = 0.5;
    this.ghosts['location_in_array'] = 0;
    this.outDev = document.getElementById('maze-container');
    this.create_cill();
  }
  // array_value = array_map[y][x], to check if cell has borders
  create_cill(array_value) {
    let maze_container = document.getElementById('maze-container');
    let maze_cell = document.createElement('div');
    let cell_class = 'grid-item';
    if (!array_value.includes('L')) {
      cell_class += ' ' + 'no-left';
    }
    if (!array_value.includes('T')) {
      cell_class += ' ' + 'no-top';
    }
    if (!array_value.includes('R')) {
      cell_class += ' ' + 'no-right';
    }
    if (!array_value.includes('B')) {
      cell_class += ' ' + 'no-bottom';
    }
    maze_cell.setAttribute('id', x + '-' + y)
    maze_cell.className = maze_border;
    maze_container.appendChild(maze_cell);
    // return maze_cell;
  }
}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class maze{
  constructor(map_array) {
    //HTML elements for showing messages on screen
    // this.alerts_html = document.getElementById("maze_alert");
    // this.moves_nr_html = document.getElementById("maze_move_nr");
    // this.lives_nr_html = document.getElementById("maze_lives_nr");

    this.maze_map = map_array;
    this.maze_elem = [];
    this.player_position = {};

    this.create_map();
    this.make_ghosts();
  }
  create_map() {
    let player_div = document.createElement('div');
    let finish_div = document.createElement('div');
    for (y = 0; y < this.maze_map.length; y++) {
      //Loop through row's items
      for (x = 0; x < maze_map[y].length; x++) {
        //Create div element
        this.maze_elem[new Position(x,y)] = new maze_cell(x,y);
        //Set div's borders
        try {
          
          if (map_array[y][x].includes('G')) {
            this.ghosts['coordinates'].push([x, y]);
          }
          //Check if is maze start
          if (map_array[y][x].includes('S')) {
            this.player_position = new Position(x, y);
            player_div.setAttribute('class', 'player_position');
            player_div.setAttribute('id', 'player_position');
            // player_div.setAttribute('data-position',x+'-'+y);
            rowNode.appendChild(player_div);
            this.player_position = [x, y];
          }
          //Check if maze ends
          if (map_array[y][x].includes('F')) {
            finish_div.setAttribute('class', 'finish_position');
            finish_div.setAttribute('id', 'finish_position');
            // finish_div.setAttribute('data-position',x+'-'+y);
            rowNode.appendChild(finish_div);
          }
        }
        catch (error) {
          console.log(error);
        }

      }
    }
  }
  make_ghosts() {
    this.ghost_direction = 'forward';
    this.timer1 = setInterval(() => {
      //Current position of ghost in Position's array
      this.ghost_pos = this.ghosts['location_in_array'];
      this.ghost_array_length = this.ghosts['coordinates'].length - 1;
      //X , Y value based on location
      let ghost_xy_coordinate = ghosts['coordinates'][this.ghost_pos];
      const current_x = parseInt(ghost_xy_coordinate[0]);
      const current_y = parseInt(ghost_xy_coordinate[1]);
      let next_x = next_y = 0;
      const player_x = parseInt(player_position[0]);
      const player_y = parseInt(player_position[1]);
      if (current_x === player_x && current_y === player_y) {
        alert('You lost');
        clearInterval(this.timer1);

      }
      //Check if in array range
      if (this.ghost_direction === 'forward') {
        if (this.ghost_pos < this.ghost_array_length - 1) {
          ghost_pos++;
        }
        else {
          ghost_direction = 'backward';
        }
      }
      //To move zombie in other direction
      else {
        if (ghost_pos > 0) {
          ghost_pos--;
        }
        else {
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

      let new_grid = document.getElementById(next_x + '-' + next_y);
      new_grid.appendChild(ghost_div);


    }, 300 / ghosts['speed']);
  }
}