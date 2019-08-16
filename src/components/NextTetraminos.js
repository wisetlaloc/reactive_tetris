import React from 'react';
//import { StyledNextTetraminos } from './styles/StyledStage';

import Cell from './Cell';
import { StyledNextTetrominos } from './styles/StyledNextTetrominos';

const NextTetraminos = ({ next }) => (
  <StyledNextTetrominos width={next[0].length} height={next.length} >
    {next.map(row => row.map((cell, x) => <Cell key={x} type={cell} />))}
  </StyledNextTetrominos>
);

export default NextTetraminos;