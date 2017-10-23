import React from 'react';
import { Button } from 'react-bootstrap';

export default function TinyButton(props) {
  return (
    <Button {...props} bsSize="xsmall">
      {props.children}
    </Button>
  );
}
