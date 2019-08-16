import React from 'react';

import { createStage, leveledDropTime } from '../gameHelpers';

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
  const [player, resetPlayer, movePlayer, drop, stopGame, stopClock] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, rows, level, dropTime, setDropTime, gameOver, resetGameStatus] = useGameStatus(rowsCleared);

  const startGame = () => {
    setStage(createStage());
    resetPlayer();
    resetGameStatus();
  }

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40 || keyCode === 68) {
        setDropTime(leveledDropTime(level));
      }
    }
  }

  const move = ({ keyCode }) => {
    if (!gameOver) {
      movePlayer(keyCode, stage);
    }
  }

  useInterval(() => {
    if (stopGame) {
      resetGameStatus();
    }
    if (stopClock) {
      setDropTime(null);
    }
    drop(stage);
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