import React from 'react';
import ReactDOM from 'react-dom';
import FamilyViewer from './FamilyViewer';
import Schwarzenegger from './data/Schwarzenegger';

import './geneasimo.css';

ReactDOM.render(
  React.createElement(FamilyViewer, { family: Schwarzenegger }),
  document.getElementById('root'),
);
