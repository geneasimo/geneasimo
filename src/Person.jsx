import { padStart } from 'lodash';
import React from 'react';

export default function Person(props) {
  const {
    number,
    firstName,
    lastName,
    isCurrentPerson,
    onClick,
    maxNumber,
  } = props;
  const className = `person${isCurrentPerson ? ' current' : ''}`;
  const paddedNumber = padStart(number, maxNumber.toString().length, '\u00a0');
  return (
    <li key={number} {...{ className, onClick }}>
      {paddedNumber}. {' '}
      <span className="name">{lastName}, {firstName}</span>
    </li>
  );
}
