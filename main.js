const gameBoard = (() => {
  const gameBoardState = ["", "", "", "", "", "", "", "", ""];

  const updateBoard = function (gameSpace) {
    if (player.players.length < 2) {
      return;
    } else if (player.players[1].name !== "AI Overlord") {
      game.setTurn();
      console.log(game.getTurn().marker);
      if (game.getTurn().marker === "X") {
        document.getElementById(gameSpace).classList.remove("text-red-500");
        document.getElementById(gameSpace).classList.add("text-blue-500");
        document.getElementById(gameSpace).textContent = `${
          game.getTurn().marker
        }`;
        gameBoardState.splice(gameSpace, 1, `${game.getTurn().marker}`);
        if (game.checkWinner()) {
          game.continueGame();
        }
      } else if (game.getTurn().marker === "O") {
        document.getElementById(gameSpace).classList.remove("text-blue-500");
        document.getElementById(gameSpace).classList.add("text-red-500");
        document.getElementById(gameSpace).textContent = `${
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
        document.getElementById(gameSpace).classList.remove("text-red-500");
        document.getElementById(gameSpace).classList.add("text-blue-500");
        document.getElementById(gameSpace).textContent = `${
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
  const createPlayer = (name, marker, score) => {
    return { name, marker, score };
  };

  const players = [];

  const setPlayersOne = () => {};

  const setPlayersTwo = (first, second) => {
    const playerOne = createPlayer(first, "X", 0);
    players.push(playerOne);
    const playerTwo = createPlayer(second, "O", 0);
    players.push(playerTwo);
    accessDOM.displayScore();
  };

  const updateScore = (player) => {
    player.score += 1;
    document.getElementById(
      "playerOne",
    ).textContent = `${players[0].name} Score: ${players[0].score}`;
    document.getElementById(
      "playerTwo",
    ).textContent = `${players[1].name} Score: ${players[1].score}`;
    console.table(players);
  };

  return {
    setPlayersOne: setPlayersOne,
    setPlayersTwo: setPlayersTwo,
    players: players,
    updateScore: updateScore,
  };
})();

const game = (() => {
  let turn = 0;
  const setTurn = () => {
    const xCount = gameBoard.gameBoardState.filter((v) => v === "X").length;
    const oCount = gameBoard.gameBoardState.filter((v) => v === "O").length;
    if (xCount === oCount) {
      turn = player.players[0];
      accessDOM.getDomId().oContainer.classList.add("scale-150");
      accessDOM.getDomId().xContainer.classList.remove("scale-150");
    } else if (xCount > oCount) {
      turn = player.players[1];
      accessDOM.getDomId().xContainer.classList.add("scale-150");
      accessDOM.getDomId().oContainer.classList.remove("scale-150");
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
      player.updateScore(player.players[0]);
      accessDOM.winnerMessage.textContent = `${player.players[0].name} is the winner!`;
      console.log("Player One is the Winner!");
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
      console.log("Player Two is the Winner!");
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
      document.getElementById(randomMove).classList.add("text-red-500");
      document.getElementById(randomMove).textContent = `${getTurn().marker}`;
      gameBoard.gameBoardState.splice(randomMove, 1, `${getTurn().marker}`);
      if (game.checkWinner()) {
        game.continueGame();
      }
    } else if (!gameBoard.gameBoardState.includes("")) {
      return;
    } else {
      console.log(`else ${randomMove}`);
      aiMove();
    }
    console.log(`AI loc: ${randomMove}`);
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
  const getGameSpaceId = function (e) {
    console.log(e.target.id);
    const gameSpace = e.target.id;
    if (gameBoard.gameBoardState[gameSpace] !== "") {
      return;
    } else {
      gameBoard.updateBoard(gameSpace);
    }
  };

  const gameSpaces = document.querySelectorAll("#game-board > div");
  gameSpaces.forEach((space) => {
    space.addEventListener("click", getGameSpaceId);
  });

  const choosePlayers = document.getElementById("choose-players");
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
      player.setPlayersTwo(nameOneInput.value, nameTwoInput.value);
    });
    choosePlayers.replaceWith(nameDiv);
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
      player.setPlayersTwo(nameOneInput.value, "AI Overlord");
    });
    choosePlayers.replaceWith(nameDiv);
  };

  const playerVsPlayer = document.getElementById("pvp");
  const playerVsAi = document.getElementById("pve");
  console.log(playerVsPlayer);
  playerVsPlayer.addEventListener("click", getPlayerNames);
  playerVsAi.addEventListener("click", getPlayerName);

  const displayScore = () => {
    // Score container
    const scoreDiv = document.createElement("div");
    scoreDiv.setAttribute("id", "score");
    scoreDiv.classList.add("text-2xl", "sm:text-3xl");
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
    const playerOneScore = document.getElementById("playerOne");
    playerOneScore.textContent = `${player.players[0].name} Score: ${player.players[0].score}`;
    const vsDiv = document.createElement("div");
    vsDiv.classList.add("gradient-text");
    vsDiv.appendChild(document.createTextNode("VS"));
    playersDiv.appendChild(vsDiv);
    const playerTwoDiv = document.createElement("div");
    playerTwoDiv.setAttribute("id", "playerTwo");
    playersDiv.appendChild(playerTwoDiv);
    const playerTwoScore = document.getElementById("playerTwo");
    console.log(playerTwoScore);
    playerTwoScore.textContent = `${player.players[1].name} Score: ${player.players[1].score}`;
  };

  const getDomId = () => {
    const xContainer = document.getElementById("X");
    const oContainer = document.getElementById("O");
    return { xContainer, oContainer };
  };

  const winnerMessage = document.getElementById("winner-message");
  const keepPlaying = document.getElementById("continue");
  keepPlaying.addEventListener("click", gameBoard.resetBoard);

  return {
    displayScore: displayScore,
    gameSpaces: gameSpaces,
    winnerMessage: winnerMessage,
    getDomId: getDomId,
  };
})();
