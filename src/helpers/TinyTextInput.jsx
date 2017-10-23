import React from 'react';
import { FormControl } from 'react-bootstrap';

export default function TinyTextInput(props) {
  return (
    <FormControl {...props} type="text" className="input-xs" />
  );
}
