import React, { useState } from 'react';
import WordList from '../components/word-list';
import { useAppState } from '../stores';
import Settings from '../components/Settings';
import MinimalNavbarWrapper from '../components/MinimalNavbarWrapper';

export default function () {
  return (
    <MinimalNavbarWrapper>
      <Settings />
    </MinimalNavbarWrapper>
  );
}
