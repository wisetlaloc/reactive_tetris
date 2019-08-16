import React from 'react';
import { StyledWaitingArea } from './styles/StyledWaitingArea';

import NextTetraminos from './NextTetraminos';

const WaitingArea = ({ nextTetraminos }) => (
  <StyledWaitingArea>
    <NextTetraminos next={nextTetraminos} />
  </StyledWaitingArea>
);

export default WaitingArea;