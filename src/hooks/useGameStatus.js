import { useState, useEffect, useCallback } from 'react';

import { leveledDropTime } from '../gameHelpers';

export const useGameStatus = (rowsCleared) => {
  const INITIAL_GAME_STATUS = {
    score: 0, rows: 0, level: 1, gameOver: false
  }
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(INITIAL_GAME_STATUS.gameOver);
  const [score, setScore] = useState(INITIAL_GAME_STATUS.score);
  const [rows, setRows] = useState(INITIAL_GAME_STATUS.rows);
  const [level, setLevel] = useState(INITIAL_GAME_STATUS.level);

  const calcScore = useCallback(() => {
    if (rowsCleared > 0) {
      const linePoints = [40, 100, 300, 1200];
      setScore(prev => prev + linePoints[rowsCleared - 1] * level);
      console.log("calc score");
      setRows(prev => prev + rowsCleared);
      if (rows > level * 10) {
        setLevel(prev => prev + 1);
        setDropTime(leveledDropTime(level));
      }
    }
  }, [level, rows, rowsCleared]);

  const resetGameStatus = () => {
    setGameOver(INITIAL_GAME_STATUS.gameOver);
    setScore(INITIAL_GAME_STATUS.score);
    console.log('reset');
    setRows(INITIAL_GAME_STATUS.rows);
    setLevel(INITIAL_GAME_STATUS.level);
    setDropTime(leveledDropTime(level));
  }

  const gameOverStatus = () => {
    setGameOver(true);
    setDropTime(null);
  }

  useEffect(() => {
    calcScore();
  }, [calcScore, rowsCleared, score]);

  return [score, rows, level, dropTime, gameOver, resetGameStatus, gameOverStatus];
}