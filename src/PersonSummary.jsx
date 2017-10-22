import { find, map } from 'lodash';
import React, { Component } from 'react';

export default class PersonSummary extends Component {
  getName(person, enableOnClick = true) {
    const onClick = enableOnClick
      ? () => this.props.onClick(person.number)
      : () => {};
    const className = enableOnClick ? 'name' : '';

    return (
      <span className={className} onClick={onClick}>
        {person.lastName}, {person.firstName}
      </span>
    );
  }

  render() {
    const { family, person } = this.props;
    const parents = map(['Father', 'Mother'], (relationship) => {
      const offset = relationship === 'Mother';
      const parent = find(family, { number: (person.number * 2) + offset });
      return (
        parent &&
        <p key={relationship}>
          {relationship}: {this.getName(parent)}
        </p>
      );
    });

    return (
      <div className="person-summary">
        <h3>{this.getName(person, false)}</h3>
        {parents}
      </div>
    );
  }
}
