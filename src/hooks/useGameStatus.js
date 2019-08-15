import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = rowsCleared => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);

  const calcScore = useCallback(() => {
    if (rowsCleared > 0) {
      const linePoints = [40, 100, 300, 1200];
      setScore(prev => prev + linePoints[rowsCleared - 1] * level);
      setRows(prev => prev + rowsCleared);
    }
  }, [level, rowsCleared]);

  useEffect(() => {
    calcScore();
  }, [calcScore, rowsCleared, score]);

  return [score, setScore, rows, setRows, level, setLevel];
}