const gameBoard = (() => {
  "use strict";

  const gameBoardState = ["", "", "", "", "", "", "", "", ""];

  const updateBoard = function (gameSpace) {
    if (player.players.length < 2) {
      return;
    } else if (player.players[1].name !== "AI Overlord") {
      game.setTurn();
      if (game.getTurn().marker === "X") {
        accessDOM.gameSpaces[gameSpace].classList.remove("text-red-500");
        accessDOM.gameSpaces[gameSpace].classList.add("text-blue-500");
        accessDOM.gameSpaces[gameSpace].textContent = `${
          game.getTurn().marker
        }`;
        gameBoardState.splice(gameSpace, 1, `${game.getTurn().marker}`);
        if (game.checkWinner()) {
          game.continueGame();
        }
      } else if (game.getTurn().marker === "O") {
        accessDOM.gameSpaces[gameSpace].classList.remove("text-blue-500");
        accessDOM.gameSpaces[gameSpace].classList.add("text-red-500");
        accessDOM.gameSpaces[gameSpace].textContent = `${
          game.getTurn().marker
        }`;
        gameBoardState.splice(gameSpace, 1, `${game.getTurn().marker}`);
        if (game.checkWinner()) {
          game.continueGame();
        }
      }
    } else {
      game.setTurn();
      if (game.getTurn().name !== "AI Overlord") {
        accessDOM.gameSpaces[gameSpace].classList.remove("text-red-500");
        accessDOM.gameSpaces[gameSpace].classList.add("text-blue-500");
        accessDOM.gameSpaces[gameSpace].textContent = `${
          game.getTurn().marker
        }`;
        gameBoardState.splice(gameSpace, 1, `${game.getTurn().marker}`);
        if (!game.checkWinner()) {
          setTimeout(game.aiMove, 1000);
        } else {
          game.continueGame();
        }
      }
    }
  };

  const resetBoard = () => {
    gameBoardState.forEach((element, index) => {
      gameBoardState.splice(index, 1, "");
      accessDOM.gameSpaces.forEach((element) => {
        element.textContent = "";
        dialog.close();
      });
    });
    accessDOM.getDomId().xContainer.classList.remove("scale-150");
    accessDOM.getDomId().oContainer.classList.remove("scale-150");
  };

  return {
    gameBoardState: gameBoardState,
    updateBoard: updateBoard,
    resetBoard: resetBoard,
  };
})();

const player = (() => {
  "use strict";

  const _createPlayer = (name, marker, score) => {
    return { name, marker, score };
  };

  const players = [];

  const setPlayers = (first, second) => {
    const playerOne = _createPlayer(first, "X", 0);
    players.push(playerOne);
    const playerTwo = _createPlayer(second, "O", 0);
    players.push(playerTwo);
    accessDOM.displayScore();
  };

  const updateScore = (player) => {
    player.score += 1;
    accessDOM.getDomId().playerOneScore.textContent = `${players[0].name} Score: ${players[0].score}`;
    accessDOM.getDomId().playerTwoScore.textContent = `${players[1].name} Score: ${players[1].score}`;
  };

  return {
    setPlayers: setPlayers,
    players: players,
    updateScore: updateScore,
  };
})();

const game = (() => {
  "use strict";

  let _turn = 0;
  const setTurn = () => {
    const xCount = gameBoard.gameBoardState.filter((v) => v === "X").length;
    const oCount = gameBoard.gameBoardState.filter((v) => v === "O").length;
    if (xCount === oCount) {
      _turn = player.players[0];
      accessDOM.getDomId().oContainer.classList.add("scale-150");
      accessDOM.getDomId().xContainer.classList.remove("scale-150");
    } else if (xCount > oCount) {
      _turn = player.players[1];
      accessDOM.getDomId().xContainer.classList.add("scale-150");
      accessDOM.getDomId().oContainer.classList.remove("scale-150");
    }
  };

  const getTurn = () => {
    return _turn;
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
      player.updateScore(player.players[0]);
      accessDOM.winnerMessage.textContent = `${player.players[0].name} is the winner!`;
      return true;
    } else if (
      compareArray(winCondition.a, oIndices) ||
      compareArray(winCondition.b, oIndices) ||
      compareArray(winCondition.c, oIndices) ||
      compareArray(winCondition.d, oIndices) ||
      compareArray(winCondition.e, oIndices) ||
      compareArray(winCondition.f, oIndices) ||
      compareArray(winCondition.g, oIndices) ||
      compareArray(winCondition.h, oIndices)
    ) {
      player.updateScore(player.players[1]);
      accessDOM.winnerMessage.textContent = `${player.players[1].name} is the winner!`;
      return true;
    } else if (!gameBoard.gameBoardState.includes("")) {
      accessDOM.winnerMessage.textContent = "It was a draw!";
      return true;
    } else {
      return false;
    }
  };

  const continueGame = () => {
    dialog.showModal();
  };

  const aiMove = () => {
    setTurn();
    const randomMove = Math.floor(
      Math.random() * gameBoard.gameBoardState.length,
    );
    if (
      gameBoard.gameBoardState[randomMove] !== "X" &&
      gameBoard.gameBoardState[randomMove] !== "O"
    ) {
      accessDOM.gameSpaces[randomMove].classList.add("text-red-500");
      accessDOM.gameSpaces[randomMove].textContent = `${getTurn().marker}`;
      gameBoard.gameBoardState.splice(randomMove, 1, `${getTurn().marker}`);
      if (game.checkWinner()) {
        game.continueGame();
      }
    } else if (!gameBoard.gameBoardState.includes("")) {
      return;
    } else {
      aiMove();
    }
  };

  return {
    setTurn: setTurn,
    getTurn: getTurn,
    checkWinner: checkWinner,
    continueGame: continueGame,
    aiMove: aiMove,
  };
})();

const accessDOM = (() => {
  "use strict";

  const _getGameSpaceId = function (e) {
    const gameSpaceId = e.target.id;
    if (gameBoard.gameBoardState[gameSpaceId] !== "") {
      return;
    } else {
      gameBoard.updateBoard(gameSpaceId);
    }
  };

  const gameSpaces = document.querySelectorAll("#game-board > div");
  gameSpaces.forEach((space) => {
    space.addEventListener("click", _getGameSpaceId);
  });

  const _choosePlayers = document.getElementById("choose-players");
  const getPlayerNames = () => {
    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("id", "player-names");
    nameDiv.classList.add("text-white", "flex", "flex-col", "items-center");

    // Player One
    const nameOneLabel = document.createElement("label");
    nameOneLabel.setAttribute("for", "playerOneName");
    nameOneLabel.classList.add("flex");
    const nameOnePara = document.createElement("p");
    nameOnePara.classList.add("mr-3");
    nameOnePara.appendChild(document.createTextNode("Player One Name: "));
    nameOneLabel.appendChild(nameOnePara);
    const nameOneInput = document.createElement("input");
    nameOneInput.setAttribute("id", "playerOneName");
    nameOneInput.classList.add("text-black", "mb-3", "px-1", "rounded");
    nameOneLabel.appendChild(nameOneInput);
    nameDiv.appendChild(nameOneLabel);

    // player 2
    const nameTwoLabel = document.createElement("label");
    nameTwoLabel.setAttribute("for", "playerTwoName");
    nameTwoLabel.classList.add("flex");
    const nameTwoPara = document.createElement("p");
    nameTwoPara.classList.add("mr-3");
    nameTwoPara.appendChild(document.createTextNode("Player Two Name: "));
    nameTwoLabel.appendChild(nameTwoPara);
    const nameTwoInput = document.createElement("input");
    nameTwoInput.setAttribute("id", "playerTwoName");
    nameTwoInput.classList.add("text-black", "mb-5", "px-1", "rounded");
    nameTwoLabel.appendChild(nameTwoInput);
    nameDiv.appendChild(nameTwoLabel);

    const nameButton = document.createElement("button");
    nameButton.setAttribute("type", "button");
    nameButton.classList.add("gradient-bg", "py-2", "px-6", "rounded-3xl");
    nameButton.appendChild(document.createTextNode("Next"));
    nameDiv.appendChild(nameButton);
    nameButton.addEventListener("click", () => {
      player.setPlayers(nameOneInput.value, nameTwoInput.value);
    });
    _choosePlayers.replaceWith(nameDiv);
  };

  const getPlayerName = () => {
    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("id", "player-names");
    nameDiv.classList.add("text-white", "flex", "flex-col", "items-center");

    const nameOneLabel = document.createElement("label");
    nameOneLabel.setAttribute("for", "playerOneName");
    nameOneLabel.classList.add("flex");
    const nameOnePara = document.createElement("p");
    nameOnePara.classList.add("mr-3");
    nameOnePara.appendChild(document.createTextNode("Player One Name: "));
    nameOneLabel.appendChild(nameOnePara);
    const nameOneInput = document.createElement("input");
    nameOneInput.setAttribute("id", "playerOneName");
    nameOneInput.classList.add("text-black", "mb-5", "px-1", "rounded");
    nameOneLabel.appendChild(nameOneInput);
    nameDiv.appendChild(nameOneLabel);

    const nameButton = document.createElement("button");
    nameButton.setAttribute("type", "button");
    nameButton.classList.add("gradient-bg", "py-2", "px-6", "rounded-3xl");
    nameButton.appendChild(document.createTextNode("Next"));
    nameDiv.appendChild(nameButton);
    nameButton.addEventListener("click", () => {
      player.setPlayers(nameOneInput.value, "AI Overlord");
    });
    _choosePlayers.replaceWith(nameDiv);
  };

  const _playerVsPlayer = document.getElementById("pvp");
  const _playerVsAi = document.getElementById("pve");
  _playerVsPlayer.addEventListener("click", getPlayerNames);
  _playerVsAi.addEventListener("click", getPlayerName);

  const displayScore = () => {
    // Score container
    const scoreDiv = document.createElement("div");
    scoreDiv.setAttribute("id", "score");
    scoreDiv.classList.add(
      "flex",
      "flex-col",
      "justify-evenly",
      "items-center",
      "text-2xl",
      "text-white",
      "sm:text-3xl",
    );
    document.getElementById("player-names").replaceWith(scoreDiv);
    const score = document.getElementById("score");

    // Marker Container
    const markerContainer = document.createElement("div");
    markerContainer.setAttribute("id", "marker-container");
    markerContainer.classList.add(
      "flex",
      "justify-evenly",
      "mb-2",
      "min-w-[430px]",
      "text-5xl",
    );
    score.appendChild(markerContainer);
    const markerContainerOne = document.createElement("div");
    markerContainerOne.classList.add(
      "w-1/2",
      "flex",
      "justify-center",
      "font-['Permanent_Marker']",
    );
    markerContainer.appendChild(markerContainerOne);
    const markerContainerTwo = document.createElement("div");
    markerContainerTwo.classList.add(
      "w-1/2",
      "flex",
      "justify-center",
      "font-['Permanent_Marker']",
    );
    markerContainer.appendChild(markerContainerTwo);
    const xDiv = document.createElement("div");
    xDiv.setAttribute("id", "X");
    xDiv.classList.add("text-blue-500");
    xDiv.appendChild(document.createTextNode("X"));
    markerContainerOne.appendChild(xDiv);
    const oDiv = document.createElement("div");
    oDiv.setAttribute("id", "O");
    oDiv.classList.add("text-red-500");
    oDiv.appendChild(document.createTextNode("O"));
    markerContainerTwo.appendChild(oDiv);

    // Players Container
    const playersDiv = document.createElement("div");
    playersDiv.setAttribute("id", "players-container");
    playersDiv.classList.add(
      "flex",
      "flex-col",
      "sm:flex-row",
      "items-center",
      "justify-evenly",
    );
    score.appendChild(playersDiv);
    const playerOneDiv = document.createElement("div");
    playerOneDiv.setAttribute("id", "playerOne");
    playersDiv.appendChild(playerOneDiv);
    playerOneDiv.textContent = `${player.players[0].name} Score: ${player.players[0].score}`;
    const vsDiv = document.createElement("div");
    vsDiv.classList.add("gradient-text");
    vsDiv.appendChild(document.createTextNode("VS"));
    playersDiv.appendChild(vsDiv);
    const playerTwoDiv = document.createElement("div");
    playerTwoDiv.setAttribute("id", "playerTwo");
    playersDiv.appendChild(playerTwoDiv);
    playerTwoDiv.textContent = `${player.players[1].name} Score: ${player.players[1].score}`;
  };

  const getDomId = () => {
    const playerOneScore = document.getElementById("playerOne");
    const playerTwoScore = document.getElementById("playerTwo");
    const xContainer = document.getElementById("X");
    const oContainer = document.getElementById("O");
    return { playerOneScore, playerTwoScore, xContainer, oContainer };
  };

  const winnerMessage = document.getElementById("winner-message");
  const _keepPlaying = document.getElementById("continue");
  _keepPlaying.addEventListener("click", gameBoard.resetBoard);

  return {
    displayScore: displayScore,
    gameSpaces: gameSpaces,
    winnerMessage: winnerMessage,
    getDomId: getDomId,
  };
})();
