const gameBoard = (() => {
  const gameBoardState = ["", "", "", "", "", "", "", "", ""];
  const updateBoard = function (gameSpace) {
    game.setTurn();
    console.log(game.getTurn().marker);
    document.getElementById(gameSpace).textContent = `${game.getTurn().marker}`;
    gameBoardState.splice(gameSpace, 1, `${game.getTurn().marker}`);
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

  return {
    setTurn: setTurn,
    getTurn: getTurn,
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
