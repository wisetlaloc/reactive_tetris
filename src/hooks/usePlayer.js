import { useState, useCallback } from 'react';

import { TETROMINOS, randomTetromino, rotatedTetromino } from '../tetraminos';
import { STAGE_WIDTH, checkCollision, KEYCODES } from '../gameHelpers';

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });
  const [nextPlayer, setNextPlayer] = useState(randomTetromino().shape);
  const [stopGame, setStopGame] = useState(false);

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }))
  }

  const resetPlayer = useCallback((newGameFlag) => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: nextPlayer,
      collided: false,
    });
    setNextPlayer(randomTetromino().shape);
    if (newGameFlag) {
      setStopGame(false);
    }
  }, [nextPlayer])

  const movePlayer = (keyCode, stage) => {
    if (keyCode === KEYCODES.left) {
      moveX(-1, stage);
    } else if (keyCode === KEYCODES.right) {
      moveX(1, stage);
    } else if (keyCode === KEYCODES.down) {
      dropPlayer(stage);
    } else if (keyCode === KEYCODES.d) {
      hardDropPlayer(stage);
    } else if (keyCode === KEYCODES.x || keyCode === KEYCODES.up) {
      rotatePlayer(stage, -1);
    } else if (keyCode === KEYCODES.z || keyCode === KEYCODES.control) {
      rotatePlayer(stage, 1);
    }
  }

  const moveX = (dir, stage) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  }

  const dropPlayer = (stage) => {
    drop(stage);
  }

  const drop = (stage) => {
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setStopGame(true);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }

  const hardDropPlayer = (stage) => {
    hardDrop(stage);
  }

  const hardDrop = (stage) => {
    let dropLimit = 0;
    while (!checkCollision(player, stage, { x: 0, y: dropLimit + 1 })) {
      dropLimit += 1;
    }
    updatePlayerPos({ x: 0, y: dropLimit, collided: false });
  }

  const rotatePlayer = (stage, dir) => {
    const dupPlayer = JSON.parse(JSON.stringify(player));
    dupPlayer.tetromino = rotatedTetromino(dupPlayer.tetromino, dir);

    const pos = dupPlayer.pos.x;
    let offset = 1;
    while (checkCollision(dupPlayer, stage, { x: 0, y: 0 })) {
      dupPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > dupPlayer.tetromino[0].length) {
        rotatedTetromino(dupPlayer.tetromino, -dir);
        dupPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(dupPlayer);
  }

  return [player, resetPlayer, movePlayer, drop, nextPlayer, stopGame];
}
