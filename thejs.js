const btnEl = document.getElementById("btn");
var board;

const hmPlayer = "o";
const comp = "x";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cell = document.querySelectorAll(".cell");
// console.log(cell);
startgame();

function startgame() {
  board = Array.from(Array(9).keys());
  // console.log(board);
  for (let i = 0; i < cell.length; i++) {
    cell[i].innerHTML = "";
    cell[i].addEventListener("click", turnclick);
    for (let i = 0; i < board.length; i++) {
      document.getElementById(board[i]).style.backgroundColor =
        "rgb(80, 80, 80)";
    }
    // cell[i].addEventListener("dblclick", turndblclick);
  }
}
function turnclick(box) {
  let endgame = turn(box.target.id, hmPlayer);

  if (tiegame() && !endgame) {
    setTimeout(() => {
      turn(emptyspot(), comp);
    }, 300);
  } else {
    tiegame();
  }
}

function emptyspot(params) {
  return minimax(board, comp).index;
}
function bestspot(params) {
  let freespot = board.filter((e) => typeof e === "number");

  return freespot;
}
function tiegame() {
  if (bestspot().length == 0) {
    alert("its a tie game");
    for (let i = 0; i < cell.length; i++) {
      cell[i].removeEventListener("click", turnclick);
    }

    return false;
  }
  return true;
}
function turn(el, player) {
  board[el] = player;

  document.getElementById(el).innerHTML = player;
  let gameWon = check(board, player);

  if (gameWon) {
    alert("palyer " + gameWon.player + " won!");

    for (let i = 0; i < cell.length; i++) {
      cell[i].removeEventListener("click", turnclick);
    }
    return true;
  }
}

function check(board, player) {
  let moves = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let won = null;

  for (let [index, win] of winCombos.entries()) {
    if (win.every((elemt) => moves.indexOf(elemt) > -1)) {
      won = { index: index, player: player };
      for (let i = 0; i < win.length; i++) {
        document.getElementById(win[i]).style.backgroundColor = "red";
      }
      break;
    }
  }
  return won;
}
btnEl.addEventListener("click", (cell) => {
  startgame();
});
function minimax(board, player) {
  var availableSpot = bestspot(board);

  if (check(board, hmPlayer)) {
    return { score: -10 };
  } else if (check(board, comp)) {
    return { score: 10 };
  } else if (availableSpot.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (let i = 0; i < availableSpot.length; i++) {
    var move = {};
    move.index = board[availableSpot[i]];
    board[availableSpot[i]] = player;

    if (player == comp) {
      var result = minimax(board, hmPlayer);
      move.score = result.score;
    } else {
      var result = minimax(board, comp);
      move.score = result.score;
    }

    board[availableSpot[i]] = move.index;

    moves.push(move);
  }

  var bestmove;
  if (player === comp) {
    var bestscore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestscore) {
        bestscore = moves[i].score;
        bestmove = i;
      }
    }
  } else {
    var bestscore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestscore) {
        bestscore = moves[i].score;
        bestmove = i;
      }
    }
  }
  return moves[bestmove];
}
