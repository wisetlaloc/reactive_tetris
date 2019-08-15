import React, { useState } from 'react';

import { createStage, checkCollision, leveledDropTime } from '../gameHelpers';

// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris'

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  }

  const startGame = () => {
    setStage(createStage());
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(1);
    setDropTime(leveledDropTime(level));
  }

  const drop = () => {
    if (rows > level * 10) {
      setLevel(prev => prev + 1);
      setDropTime(leveledDropTime(level));
    }
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40 || keyCode === 68) {
        setDropTime(leveledDropTime(level));
      }
    }
  }

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  }

  const hardDrop = () => {
    let dropLimit = 0;
    while (!checkCollision(player, stage, { x: 0, y: dropLimit + 1 })) {
      dropLimit += 1;
    }
    updatePlayerPos({ x: 0, y: dropLimit, collided: false });
  }

  const hardDropPlayer = () => {
    setDropTime(null);
    hardDrop();
  }

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 68) {
        hardDropPlayer();
      } else if (keyCode === 38 || keyCode === 88) {
        playerRotate(stage, -1);
      } else if (keyCode === 17 || keyCode === 90) {
        playerRotate(stage, 1);
      }
    }
  }

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {
            gameOver ? (
              <Display gameOver={gameOver} text="Game Over" />
            ) : (
                <div>
                  <Display text={`Score: ${score}`} />
                  <Display text={`Rows: ${rows} `} />
                  <Display text={`Level: ${level}`} />
                </div>
              )
          }
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}

export default Tetris;