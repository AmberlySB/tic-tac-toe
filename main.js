const gameBoard = (() => {
  const gameBoardState = ["", "", "", "", "", "", "", "", ""];
  const updateBoard = function (gameSpace) {
    if (player.players.length < 2) {
      return;
    } else {
      game.setTurn();
      console.log(game.getTurn().marker);
      document.getElementById(gameSpace).textContent = `${
        game.getTurn().marker
      }`;
      gameBoardState.splice(gameSpace, 1, `${game.getTurn().marker}`);
      game.checkWinner();
    }
  };

  return {
    gameBoardState: gameBoardState,
    updateBoard: updateBoard,
  };
})();

const player = (() => {
  const createPlayer = (name, marker) => {
    const sayHello = () => console.log(`${name} has ${marker}`);
    return { name, marker, sayHello };
  };

  const players = [];
  const setPlayersOne = () => {};
  const setPlayersTwo = () => {
    const playerOne = createPlayer("Player One", "X");
    players.push(playerOne);
    const playerTwo = createPlayer("Player Two", "O");
    players.push(playerTwo);
    playerOne.sayHello();
    playerTwo.sayHello();
    console.log(`${players[0].name} vs ${players[1].name}`);
  };

  return {
    setPlayersOne: setPlayersOne,
    setPlayersTwo: setPlayersTwo,
    players: players,
  };
})();

const game = (() => {
  let turn = 0;
  const setTurn = () => {
    const xCount = gameBoard.gameBoardState.filter((v) => v === "X").length;
    const oCount = gameBoard.gameBoardState.filter((v) => v === "O").length;
    if (xCount === oCount) {
      turn = player.players[0];
    } else if (xCount > oCount) {
      turn = player.players[1];
    }
  };

  const getTurn = () => {
    return turn;
  };

  const checkWinner = () => {
    const winCondition = {
      a: [0, 1, 2],
      b: [3, 4, 5],
      c: [6, 7, 8],
      d: [0, 3, 6],
      e: [1, 4, 7],
      f: [2, 5, 8],
      g: [0, 4, 8],
      h: [2, 4, 6],
    };
    const xIndices = [];
    const oIndices = [];
    let x = gameBoard.gameBoardState.indexOf("X");
    while (x !== -1) {
      xIndices.push(x);
      x = gameBoard.gameBoardState.indexOf("X", x + 1);
    }

    let o = gameBoard.gameBoardState.indexOf("O");
    while (o !== -1) {
      oIndices.push(o);
      o = gameBoard.gameBoardState.indexOf("O", o + 1);
    }

    const compareArray = (arr1, arr2) => {
      return arr1.every((element) => arr2.includes(element));
    };

    if (
      compareArray(winCondition.a, xIndices) ||
      compareArray(winCondition.b, xIndices) ||
      compareArray(winCondition.c, xIndices) ||
      compareArray(winCondition.d, xIndices) ||
      compareArray(winCondition.e, xIndices) ||
      compareArray(winCondition.f, xIndices) ||
      compareArray(winCondition.g, xIndices) ||
      compareArray(winCondition.h, xIndices)
    ) {
      console.log("Player One is the Winner!");
    }
    if (
      compareArray(winCondition.a, oIndices) ||
      compareArray(winCondition.b, oIndices) ||
      compareArray(winCondition.c, oIndices) ||
      compareArray(winCondition.d, oIndices) ||
      compareArray(winCondition.e, oIndices) ||
      compareArray(winCondition.f, oIndices) ||
      compareArray(winCondition.g, oIndices) ||
      compareArray(winCondition.h, oIndices)
    ) {
      console.log("Player Two is the Winner!");
    }
  };

  return {
    setTurn: setTurn,
    getTurn: getTurn,
    checkWinner: checkWinner,
  };
})();

const accessDOM = (() => {
  const getGameSpaceId = function (e) {
    console.log(e.target.id);
    const gameSpace = e.target.id;
    if (gameBoard.gameBoardState[gameSpace] != "") {
      return;
    } else {
      gameBoard.updateBoard(gameSpace);
    }
  };

  const gameSpaces = document.querySelectorAll("#game-board > div");
  gameSpaces.forEach((space) => {
    space.addEventListener("click", getGameSpaceId);
  });

  const playerVsPlayer = document.getElementById("pvp");
  const playerVsAi = document.getElementById("pve");
  console.log(playerVsPlayer);
  playerVsPlayer.addEventListener("click", player.setPlayersTwo);
  playerVsAi.addEventListener("click", player.setPlayersOne);
})();
