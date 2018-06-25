const colours = ['red', 'green', 'magenta', 'cyan'];
const START = 0;
const VICTORY = 100;
const tile_constant =  (window.screen && window.screen.width) < 600 ? 30: 50; //tiles are 50 x 50 pixels size
const tile_constant_half = tile_constant / 2;

//Player constructor
const Player = function (name, color) {
    this.name = name;
    this.position = 0;
    this.color = color;

    this.getPosition = () => {
        return this.position;
    };

    this.getColor = () => {
        return this.color;
    };

    this.setPosition = (position) => {
        this.position = parseInt(position, 10);
    };

    this.resetPosition = () => {
        this.position = START;
    };

    this.setName = (name) => {
        this.name = name;
    };

    this.setColor = (color) => {
        this.color = color;
    };

    this.getName = (name) => {
        return this.name;
    };
};

//SnakeOrLadder constructor
const SnakeOrLadder = function (head, tail) {
    this.type = (head > tail) ? "snake" : "ladder";
    this.head = head;
    this.tail = tail;
};

//Game Constructor
const Game = new function () {

    //create the snake board
    this.drawGameBoard = () => {
        let board = document.getElementById("board");
        for (let i = 0; i < 10; i++) {
            let column = document.createElement('div');
            let classNames = "flex-row board-row";
            if (i % 2 !== 0) {
                classNames = "flex-rr board-row";
            }
            column.setAttribute("class", classNames);
            column.setAttribute("id", "row-" + i);

            for (let j = 0; j < 10; j++) {
                let tile_no = (i * 10 + j);
                tile_no++;
                let tile = document.createElement('div');
                let val = document.createTextNode(tile_no);
                tile.setAttribute("class", "flex-row flex-center full-flex board-tile");
                tile.setAttribute("id", "tile-" + tile_no);
                tile.setAttribute("value", tile_no);
                tile.appendChild(val);
                column.appendChild(tile);
            }
            board.appendChild(column);
        }
    };

    //create a list of snake and ladders. Draw snake and ladders on the canvas 
    this.drawSnakesAndLadders = () => {
        let snakes_and_ladders = [
            { head: 1, tail: 38 },
            { head: 4, tail: 14 },
            { head: 9, tail: 31 },
            { head: 24, tail: 7 },
            { head: 21, tail: 42 },
            { head: 28, tail: 84 },
            { head: 51, tail: 67 },
            { head: 54, tail: 34 },
            { head: 35, tail: 57 },
            { head: 62, tail: 17 },
            { head: 77, tail: 60 },
            { head: 64, tail: 96 },
            { head: 71, tail: 91 },
            { head: 80, tail: 10 }, 
            { head: 87, tail: 24 },
            { head: 93, tail: 73 },
            { head: 95, tail: 49 },
            { head: 98,tail:  79 }
        ];

        let canvas = document.getElementById("board-canvas");
        let canvas_rect = canvas.getBoundingClientRect();

        canvas.width = canvas_rect.width;
        canvas.height = canvas_rect.height;

        let canvas_ctx = canvas.getContext("2d");
        canvas_ctx.translate(0.5, 0.5);

        snakes_and_ladders.forEach((s_o_l) => {
            s_o_l = this.addSnakeOrLadder(s_o_l.head, s_o_l.tail);

            ladder = (s_o_l.type === 'ladder');

            let head_x_offset = s_o_l.head % 10;
            let head_y_offset = Math.floor(s_o_l.head / 10);
            let head_type = head_y_offset % 2 == 0 ? 'left' : 'right';
            let head_x = head_type == 'left' ? head_x_offset : 10 - head_x_offset;
            let head_y = 10 - head_y_offset; 

            let tail_x_offset = s_o_l.tail % 10;
            let tail_y_offset = Math.floor(s_o_l.tail / 10);
            let tail_type = tail_y_offset % 2 == 0 ? 'left' : 'right';
            let tail_x = tail_type == 'left' ? tail_x_offset : 10 - tail_x_offset;
            let tail_y = 10 - tail_y_offset;

            let start_point = {
                x: (head_x * tile_constant),
                y: (head_y * tile_constant)
            };
            let end_point = {
                x: (tail_x * tile_constant),
                y: (tail_y * tile_constant)
            };

            if (head_type === 'left' && tail_type === 'left') {
                if (ladder) {
                    start_point.x -= tile_constant_half;
                    start_point.y -= tile_constant_half;

                    end_point.x -= tile_constant_half;
                    end_point.y -= tile_constant_half;
                } else { 
                    start_point.x -= tile_constant_half;
                    
                    end_point.x -= tile_constant_half;
                    end_point.y -= tile_constant_half;
                }
            } else if (head_type === 'left' && tail_type === 'right') {
                if (ladder) {
                    start_point.x -= tile_constant_half;
                    start_point.y -= tile_constant_half;

                    end_point.x += tile_constant_half;
                } else { 
                    if ((tail_x - head_x) < 5) {
                        end_point.x += tile_constant_half;
                        end_point.y -= tile_constant_half;
                    } 
                    if ((tail_x - head_x) >= 5 && (tail_y - head_y) >= 5) {
                        start_point.x += tile_constant_half;
                        start_point.y -= tile_constant_half;
                    }
                    
                    end_point.y += tile_constant_half;
                }
            } else if (head_type === 'right' && tail_type === 'left') {
                if (ladder) {
                    start_point.x += tile_constant_half;
                    start_point.y -= tile_constant_half;

                    end_point.y -= tile_constant_half;
                } else {
                    start_point.x += tile_constant_half;
                }
            } else { 
                if (ladder) {
                    start_point.x += tile_constant_half;
                    start_point.y -= tile_constant_half;

                    end_point.x += tile_constant_half;
                    end_point.y -= tile_constant_half;
                } else {
                    start_point.x += tile_constant_half;
                    start_point.y -= tile_constant_half;

                    end_point.x += tile_constant_half;
                    end_point.y -= tile_constant_half;
                }
            }

            // console.log(s_o_l.head, s_o_l.tail, head_type, tail_type);

            //marking the head with a circle
            canvas_ctx.fillStyle = s_o_l.type === "snake" ? "#661a00" : "#cccc00";;
            canvas_ctx.beginPath();
            canvas_ctx.arc(start_point.x, start_point.y, 5, 0, 2 * Math.PI);
            canvas_ctx.fill();
            
            //drawing the line
            canvas_ctx.beginPath();
            canvas_ctx.moveTo(start_point.x, start_point.y);
            canvas_ctx.lineTo(end_point.x, end_point.y);
            canvas_ctx.strokeStyle = s_o_l.type === "snake" ? "#661a00" : "#cccc00";
            canvas_ctx.lineWidth = 5;
            canvas_ctx.stroke();
        });
    };

    //create 2 new players and set current_player. Called in init() method
    this.setPlayers = () => {
        this.addPlayer();
        this.addPlayer();
        this.current_player = 0;
        this.setPlayersTable();
    };

    //create and update player table with player details list. 
    //Called in setPlayers() in init and  whenever addPlayer() is called.
    this.setPlayersTable = () => {
        let tableList = this.getListWithHeader();

        this.players.forEach((player, index) => {
            let tr = document.createElement('tr');
            tr.setAttribute("id", "tr-" + index );
            let td1 = document.createElement('td');
            let textNode1 = document.createTextNode(" ");
            td1.style.cssText = `background-color: ${colours[index]}`;
            td1.appendChild(textNode1);

            let td2 = document.createElement('td');
            let textNode2 = document.createTextNode(player.getName());
            td2.appendChild(textNode2);

            let td3 = document.createElement('td');
            let textNode3 = document.createTextNode(player.getPosition());
            td3.appendChild(textNode3);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tableList.appendChild(tr);
        });
    };

    //create player list header to be added to player table
    this.getListWithHeader = () => {
        let list = document.getElementById("playerList");
        list.innerHTML = "";

        let th = document.createElement('tr');
        th.setAttribute("id", "th-head");
        let td1 = document.createElement('td');
        td1.innerHTML = "#";

        let td2 = document.createElement('td');
        td2.innerHTML = "Player";

        let td3 = document.createElement('td');
        td3.innerHTML = "Position";

        th.appendChild(td1);
        th.appendChild(td2);
        th.appendChild(td3);
        list.appendChild(th);

        return list;
    }

    //adds snake/ladder to the game instance
    this.addSnakeOrLadder = (head, tail) => {
        let item = new SnakeOrLadder(head, tail);
        this.snakes_and_ladders.push(item);
        return item;
    };

    //adds player to the game instance
    this.addPlayer = (name) => {
        let player_name = name || "Player " + (this.players.length + 1);
        let player = new Player(player_name);
        this.players.push(player);
        this.setPlayersTable();
        this.setMessage(player_name + " added!");
        if (this.players.length === 4) {
            document.getElementById("addPlayerBtn").classList.add('is-hidden');
        }
        setTimeout(() => {
            this.setMessage("Press Start button to begin!");
        }, 700);
    };

    //generate a random number between 0 and 7 and initiate player move
    this.rollDice = () => {
        let current_player = this.players[this.current_player];
        let steps = Math.ceil(Math.random() * 6);
        this.setMessage(current_player.getName() + " got " + steps);
        document.getElementById('diceValue').innerHTML = steps;

        //calculate next postion and move the player to new position
        let next_position = current_player.getPosition() + steps;
        this.movePlayer(current_player, next_position);

    };

    //move user coin on the board
    this.moveCoin = (position) => {
        let coin = document.getElementById("coin-" + this.current_player);
        coin.classList.remove('is-hidden');
        let pos = document.getElementById("tile-" + position).getBoundingClientRect();
        coin.style.top = pos.top + 10;
        coin.style.left = pos.left + 10;
    };

    //set player position to position paraqm. check if landed on snake or ladder and moves again
    this.movePlayer = (player, next_position) => {
        let rollDiceBtn = document.getElementById("diceBtn");
        rollDiceBtn.setAttribute("disabled", "disabled");
        setTimeout(() => {
            if (next_position <= VICTORY) {
                this.setMessage("Moving " + player.getName() + " to position " + next_position);
                player.setPosition(next_position);
                this.setPlayersTable();
                this.moveCoin(next_position);

                //loop through snakes_and_ladders to find if current position is ladder/snake
                let snakes_and_ladders = this.snakes_and_ladders;
                let len = snakes_and_ladders.length;
                for (let i = 0; i < len; i++) {
                    let s_o_l = this.snakes_and_ladders[i];
                    if (next_position == s_o_l.head) {
                        setTimeout(() => {
                            this.setMessage(player.getName() + " landed on " + s_o_l.type);
                            this.movePlayer(player, s_o_l.tail);
                        }, 500);
                        return;
                    }
                };
            } else { 
                this.setMessage("Cant move " + player.getName() + " as it out of bounds!");
            }

            //check if game won, if not update the turn here
            if (this.gameOver()) {
                this.setMessage(player.getName() + " won!!!!");
                setTimeout(() => {
                    this.resetGame();
                }, 500);
            } else {
                this.updateTurn();
            }
            rollDiceBtn.removeAttribute("disabled");
        }, 700);
    };

     //check if current player has reached victory
    this.startGame = () => {
        document.getElementById('addPlayerBtn').classList.add('is-hidden');
        document.getElementById('startGameBtn').classList.add('is-hidden');
        document.getElementById('dice').classList.remove('is-hidden');

        let board = document.getElementById("coinsList");
        this.players.forEach((player, index) => {
            setTimeout(() => { 
                let playerDiv = document.createElement('div');
                let classNames = "coin is-absolute img-circular flex-row flex-center is-hidden";
                // playerDiv.setAttribute("class", classNames);
                playerDiv.className = classNames;
                playerDiv.setAttribute("id", "coin-" + index);
                playerDiv.style.cssText = `background: ${colours[index]}; color: white;`
                let text = document.createTextNode(index + 1);
                playerDiv.appendChild(text);
                board.appendChild(playerDiv);
            });
        });
        
        this.setMessage(this.players[this.current_player].getName() + "'s turn. Roll dice.");
    };

    //check if current player has reached victory
    this.gameOver = () => {
        return this.players[this.current_player].getPosition() === VICTORY;
    };

    //change player turn and set current_player accordingly
    this.updateTurn = () => {
        this.current_player = ++this.current_player % this.players.length;
        setTimeout(() => {
            this.setMessage(this.players[this.current_player].getName() + "'s turn. Roll dice.");
        }, 800);
    };

    //set the current_message to be displayed
    this.setMessage = (message) => {
        this.current_message = message;
        document.getElementById("message").innerHTML = this.current_message;
    };

    //reset game to initial state
    this.resetGame = () => {
        let prompt = confirm("Reset the game?");
        if (prompt) {
            this.init();
        }
    };

    //Initialize Game Instance
    this.init = () => {
        document.getElementById('board').innerHTML = `<canvas id="board-canvas" class="is-absolute"></canvas>`;
        this.game_started = false;
        this.players = [];
        this.current_player = undefined;
        this.snakes_and_ladders = [];
        document.getElementById("dice").classList.add('is-hidden');
        document.getElementById("startGameBtn").classList.remove('is-hidden');
        document.getElementById("addPlayerBtn").classList.remove('is-hidden');
        this.drawGameBoard();
        this.drawSnakesAndLadders();
        this.setPlayers();
        this.setMessage("Press Start button to begin!");
    };

}();