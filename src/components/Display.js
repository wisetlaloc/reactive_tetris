import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay'

const Display = ({ gameOver, label, value }) => (
  <StyledDisplay gameOver={gameOver}>
    <span>{label}</span>
    <span>{value}</span>
  </StyledDisplay>
);

export default Display;