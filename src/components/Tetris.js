import React from 'react';

import { createStage } from '../gameHelpers';

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
import WaitingArea from './WaitingArea';

const Tetris = () => {
  const [player, resetPlayer, movePlayer, drop, nextPlayer, stopGame] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, rows, level, dropTime, gameOver, resetGameStatus, gameOverStatus] = useGameStatus(rowsCleared);

  const startGame = () => {
    setStage(createStage());
    resetPlayer(true);
    resetGameStatus();
  }

  const move = ({ keyCode }) => {
    if (!gameOver) {
      movePlayer(keyCode, stage);
    }
  }

  useInterval(() => {
    if (stopGame) {
      gameOverStatus();
    }
    drop(stage);
  }, dropTime);

  return (
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {
            gameOver ? (
              <Display gameOver={gameOver} text="Game Over" />
            ) : (
                <WaitingArea nextTetraminos={nextPlayer} />
              )
          }
          <Display text={`Score: ${score}`} />
          <Display text={`Rows: ${rows} `} />
          <Display text={`Level: ${level}`} />
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}

export default Tetris;