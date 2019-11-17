//Add event lister to move Player with W,A,S,D keys
document.addEventListener("keydown", function (event) {
  let key_dir = "";
  switch (event.keyCode) {
    //Left
    case 65:
      key_dir = "L";
      break;
      // TOP
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
//Page elements to show and hide on click event
//New game / continue buttons
var game_buttons = document.getElementById("new-game");
//Maze section
var play_maze = document.getElementById("play-maze");
// var game_level = document.getElementById("maze-level");
var btn_continue = document.getElementById("btn-continue");

//On clicking continue button after game puse
function continue_game_func() {
  btn_continue.style.display = "none";
  game_buttons.style.display = "none";
  play_maze.style.display = "grid"
  timer.resume();
}

/**
 * On clicking new game button, changing map
*/
function new_game_func(map_nr) {
  //Reset timers
  if (timer !== '' && timer.pause() !== 'undefined') {
    reset();
  }
  game_buttons.style.display = "none";
  // game_level.style.display = "none";
  play_maze.style.display = "grid"
  //Maze div
  let outDev = document.getElementById("maze-container");
  outDev.innerHTML = "";
  //Reset maze map and get new map array form different file
  var script_div = document.getElementById('scriptLinkPlaceholder');
  var oldScript = document.getElementById("scriptLink").src;
  script_div.innerHTML = "";
  let newScript = document.createElement("script");
  newScript.src = "js/map" + map_nr + ".js";
  newScript.id = "scriptLink";
  newScript.type = "text/javascript";
  newScript.onerror = function() {
    alert("Error loading " + this.src); // Error loading https://example.com/404.js
  };
  script_div.appendChild(newScript);
  array_map = eval(array_map);
  //Redraw map
  make_maze();
}
/**
 * On clicking pause button
 */
function pause_game_func() {
  btn_continue.style.display = "inline";
  game_buttons.style.display = "grid"
  play_maze.style.display = "none";
  timer.pause();
}
/**
 * To stop game, resets all
 */
function stop_game_func() {
  btn_continue.style.display = "none";
  game_buttons.style.display = "grid"
  play_maze.style.display = "none";
  reset();
}
/**
 * To show HTML section for game level(Not implemented)
 */
function game_level_func() {
  btn_continue.style.display = "none";
  game_buttons.style.display = "none";
  // game_level.style.display = "inline"
  // game_level.closest(".gamel-level").style.display = "block";
}
/**
 * Reseting timers
 */
function reset() {
  clearInterval(ghostH);
  clearInterval(ghostG);
  if (timer !== '') {
    timer.stop();
  }

  remained_lives = 3;
}
/**
 * Array to keep ghost relatd data
 * Used in timers
 */
var ghosts = {
  H: {
    coordinates: [],
    location_in_array: 0,
    ghost_direction: "forward"
  },
  G: {
    coordinates: [],
    location_in_array: 0,
    ghost_direction: "forward"
  }
};
var timer = "";
ghosts_timer = [];
var ghostH = "";
var ghostG = "";
var remained_lives = 3;
/**
 * Att 0 to show correct time format
 * @param {string} val 
 */
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
/**
 * Timer to show total time in game
 * Runs each second
 */
var maze_timer = function () {
  let timerId;
  let seconds = (minutes = totalSeconds = 0);

  this.pause = function () {
    window.clearInterval(timerId);
  };

  this.resume = function () {
    start = Date.now();
    window.clearInterval(timerId);
    timerId = window.setInterval(() => {
      ++totalSeconds;
      let time_span = document.getElementById("elapsed-time");
      seconds = pad(totalSeconds % 60);
      minutes = pad(parseInt(totalSeconds / 60));
      time_span.innerHTML = minutes + ":" + seconds;
    }, 1000);
  };
  this.stop = function () {
    window.clearInterval(timerId);
    seconds = minutes = 0;
  };
  this.resume();
};
var init_position = [];
var player_position = [0, 0];
/**
 * Drawing maze map
 */
function make_maze() {
  //Starting coundup timer
  timer = new maze_timer();
  ghosts.G['coordinates'] = [];
  ghosts.H['coordinates'] = [];

  let outDev = document.getElementById("maze-container");
  outDev.innerHTML = "";
  try {
    for (y = 0; y < array_map.length; y++) {
      //Loop through row's items
      for (x = 0; x < array_map[y].length; x++) {
        //Create div element
        let rowNode = document.createElement("div");
        let maze_border = "grid-item";
        //Remove borders if not included in current array position
        try {
          if (!array_map[y][x].includes("L")) {
            maze_border += " " + "no-left";
          }
          if (!array_map[y][x].includes("T")) {
            maze_border += " " + "no-top";
          }
          if (!array_map[y][x].includes("R")) {
            maze_border += " " + "no-right";
          }
          if (!array_map[y][x].includes("B")) {
            maze_border += " " + "no-bottom";
          }
          //G stands for our first Ghost element
          //Push ghost position to array declared in pages top
          if (array_map[y][x].includes('G')) {
            ghosts.G['coordinates'].push([x, y]);
          }
          //H stands for the second ghost element
          if (array_map[y][x].includes('H')) {
            ghosts.H['coordinates'].push([x, y]);
          }
          //Check if current position is maze start
          //Create player
          if (array_map[y][x].includes("S")) {
            let player_div = document.createElement("div");
            player_div.innerHTML = "&#128378;";
            player_div.setAttribute("class", "player_position");
            player_div.setAttribute("id", "player_position");
            // player_div.setAttribute('data-position',x+'-'+y);
            rowNode.appendChild(player_div);
            player_position = [x, y];
            if (init_position.length === 0) {
              init_position = [x, y];
            }

          }
          //Check if current position is maze end
          if (array_map[y][x].includes("F")) {
            let finish_div = document.createElement("div");
            finish_div.innerHTML = "&#128682;";
            finish_div.setAttribute("class", "finish_position");
            finish_div.setAttribute("id", "finish_position");
            // finish_div.setAttribute('data-position',x+'-'+y);
            rowNode.appendChild(finish_div);
          }
        } catch (error) {
          console.log(error);
        }
        rowNode.setAttribute("id", x + "-" + y);
        rowNode.className = maze_border;
        outDev.appendChild(rowNode);
      }
    }
  } catch (error) {
    console.log(error);
  }
  //
  ghost_timer();
}
/**
 * Move player/hero in four direction
 * If not at the edge of map
 * or if not blocked by walls
 */
function move_player(direction) {
  //Retreiv player position saved in player_position global variable
  let x = parseInt(player_position[0]);
  let y = parseInt(player_position[1]);
   //If x,y position is not out of array boundary 
   //and direction has no border, move player to new direction
  switch (direction) {
    case "L":
      //If not in left side and moving left
      if (!array_map[y][x].includes("L")) {
        x = x > 0 ? x - 1 : x;
      }
      break;
    case "T":
      if (!array_map[y][x].includes("T")) {
        //If not in first line and moving up
        y = y > 0 ? y - 1 : y;
      }
      break;
    case "R":
      if (!array_map[y][x].includes("R")) {
        //if not in right side, so that not exceed array boundary
        x = x < array_map[x].length ? x + 1 : x;
      }
      break;
    case "B":
      if (!array_map[y][x].includes("B")) {
        y = y < array_map.length ? y + 1 : y;
      }
      break;
  }
  //Update position array
  let new_position = [x, y];

  //If position changed, redraw player in maz map
  if (JSON.stringify(player_position) !== JSON.stringify(new_position)) {
    let current_grid = document.getElementById(
      player_position[0] + "-" + player_position[1]
    );
    current_grid.innerHTML = "";
    player_position = [x, y];
    //If we are at maze finish line
    if (array_map[y][x].includes("F")) {
      current_grid.innerHTML = "";
      alert("Game finished");
      //Reset maze
      reset();
      make_maze();
    } else {
      //Redraw player
      let new_grid = document.getElementById(
        new_position[0] + "-" + new_position[1]
      );
      let player_div = document.createElement("div");
      player_div.innerHTML = "&#128378;";
      player_div.setAttribute("class", "player_position");
      if (direction === "L") {
        player_div.classList.add("dir_left");
      }
      player_div.setAttribute("id", "player_position");
      // player_div.setAttribute('data-position',x+'-'+y);
      new_grid.appendChild(player_div);
    }

  }
}
/**
 * Keep ghosts on move, using global ghosts array
 */
function ghost_timer() {
  ghostH = setInterval(() => {
    make_ghosts(ghosts.H);
  }, 1000);
  ghostG = setInterval(() => {
    make_ghosts(ghosts.G);
  }, 1000);

}
/**
 * Redraw ghosts
 * @param {*} ghost 
 */
function make_ghosts(ghost) {
  //Current position of ghost in Position's array
  let ghost_pos = ghost["location_in_array"];
  const ghost_array_length = ghost["coordinates"].length - 1;
  //X , Y value based on location
  let ghost_xy_coordinate = ghost["coordinates"][ghost_pos];
  //Ghost position
  const current_x = parseInt(ghost_xy_coordinate[0]);
  const current_y = parseInt(ghost_xy_coordinate[1]);
  let next_x = (next_y = 0);
  //Player position
  const player_x = parseInt(player_position[0]);
  const player_y = parseInt(player_position[1]);
  //If player and ghost in same maze cell
  if (current_x === player_x && current_y === player_y) {
    //If at leaste one lives remained
    if (remained_lives < 1) {
      alert("You lost!");
      reset();
      player_position = [0, 0];
      make_maze();
    }
    else {
      //Reset player position 
      timer.pause();
      remained_lives--;
      if (confirm("You have " + remained_lives + " chances! Click OK to continue?")) {
        let current_grid = document.getElementById(
          player_position[0] + "-" + player_position[1]
        );
        current_grid.innerHTML = "";
        let new_grid = document.getElementById(
          init_position[0] + "-" + init_position[1]
        );
        let player_div = document.createElement("div");
        player_div.innerHTML = "&#128378;";
        player_div.setAttribute("class", "player_position");

        player_div.setAttribute("id", "player_position");
        // player_div.setAttribute('data-position',x+'-'+y);
        new_grid.appendChild(player_div);
        player_position = init_position;
        timer.resume();
      }
      else {
        alert("You quit");
        reset();
        player_position = [0, 0];
        make_maze();
      }
    }
  }
  //To keep ghost moving forwar and bakward
  if (ghost["ghost_direction"] === "forward") {
    if (ghost_pos < ghost_array_length) {
      ghost_pos++;
    } else {
      ghost["ghost_direction"] = "backward";
      if (ghost_pos > 0) {
        ghost_pos--;
      }
    }
  }
  //To move zombie in other direction
  else {
    if (ghost_pos > 0) {
      ghost_pos--;
    } else {
      ghost["ghost_direction"] = "forward";
      if (ghost_pos < ghost_array_length) {
        ghost_pos++;
      }
    }
    ghost["location_in_array"] = ghost_pos;
  }
  
  ghost_xy_coordinate = ghost["coordinates"][ghost_pos];
  next_x = parseInt(ghost_xy_coordinate[0]);
  next_y = parseInt(ghost_xy_coordinate[1]);
  ghost["location_in_array"] = ghost_pos;
  console.log(next_y);
  //Find current position of ghost in maze
  let current_grid = document.getElementById(current_x + "-" + current_y);
  current_grid.innerHTML = "";
  let ghost_div = document.createElement("div");
  ghost_div.innerHTML = "&#128123;";
  ghost_div.setAttribute("class", "ghosts_position");
  ghost_div.setAttribute("id", "ghosts_position");
  //Create new ghost position
  let new_grid = document.getElementById(next_x + "-" + next_y);
  new_grid.appendChild(ghost_div);
}