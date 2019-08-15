import { useState, useCallback } from 'react';

import { TETROMINOS, randomTetromino } from '../tetraminos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const rotate = (matrix, dir) => {
    const transposedTetromino = matrix.map((_, index) =>
      matrix.map(col => col[index]),
    );
    if (dir > 0) return transposedTetromino.reverse();

    return transposedTetromino.map(row => row.reverse());
  }

  const playerRotate = (stage, dir) => {
    const dupPlayer = JSON.parse(JSON.stringify(player));
    dupPlayer.tetromino = rotate(dupPlayer.tetromino, dir);

    const pos = dupPlayer.pos.x;
    let offset = 1;
    while (checkCollision(dupPlayer, stage, { x: 0, y: 0 })) {
      dupPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > dupPlayer.tetromino[0].length) {
        rotate(dupPlayer.tetromino, -dir);
        dupPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(dupPlayer);
  }

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }))
  }

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    })
  }, [])

  return [player, updatePlayerPos, resetPlayer, playerRotate];
}
