import { filter, find, isEqual, min, map, max, orderBy, padStart, startsWith } from 'lodash';
import React, { Component } from 'react';
import { Col, DropdownButton, Grid, MenuItem } from 'react-bootstrap';
import PersonSummary from './PersonSummary';

const SORT_BY_ALPHA = 'alpha';
const SORT_BY_AHNEN = 'ahnen';
const sortOptions = {
  [SORT_BY_AHNEN]: 'by ahnentafel',
  [SORT_BY_ALPHA]: 'alphabetically',
};

export default class FamilyViewer extends Component {
  constructor(props) {
    super(props);

    const { minNumber, maxNumber } = this.getMinMaxNumbers(props.family);
    this.state = {
      family: props.family,
      sortedBy: SORT_BY_AHNEN,
      currentPerson: this.findPersonByNumber(props.family, minNumber),
      maxNumber,
    };

    this.addPerson = this.addPerson.bind(this);
    this.deletePerson = this.deletePerson.bind(this);
  }

  onFamilyChange() {
    const { family } = this.state;
    const { minNumber, maxNumber } = this.getMinMaxNumbers(family);
    this.setState({
      currentPerson: this.findPersonByNumber(family, minNumber),
      maxNumber,
    });
  }

  getMinMaxNumbers(family) {
    const numbers = map(family, p => p.number);
    return {
      minNumber: min(numbers),
      maxNumber: max(numbers),
    };
  }

  findPersonByNumber(family, number) {
    return find(family, { number });
  }

  handleClick(number) {
    this.setState({
      currentPerson: this.findPersonByNumber(this.state.family, number),
    });
  }

  addPerson(number, firstName, lastName) {
    const { family } = this.state;
    family.push({ ...{ number, firstName, lastName } });
    this.onFamilyChange();
  }

  deletePerson(person, deleteAncestors = false) {
    const { family } = this.state;
    const toBinary = int => int.toString(2);
    const binaryNumber = toBinary(person.number);

    const condition = deleteAncestors ? startsWith : isEqual;
    const ancestors = filter(family, p => condition(toBinary(p.number), binaryNumber));
    ancestors.forEach((ancestor) => {
      family.splice(family.indexOf(ancestor), 1);
    });
    this.onFamilyChange();
  }

  render() {
    const sortedByAhnen = this.state.sortedBy === SORT_BY_AHNEN;
    const fields = sortedByAhnen ? 'number' : ['lastName', 'firstName'];
    const sortedPeople = orderBy(this.state.family, fields, 'asc');

    const people = sortedPeople.map((person) => {
      const isCurrentPerson = person === this.state.currentPerson;
      const onClick = () => this.handleClick(person.number);
      const className = `person${isCurrentPerson ? ' current' : ''}`;
      const paddedNumber = padStart(person.number, this.state.maxNumber.toString().length, '\u00a0');
      return (
        <li key={person.number} {...{ className, onClick }}>
          {paddedNumber}. {' '}
          <span className="name">{person.lastName}, {person.firstName}</span>
        </li>
      );
    });

    return (
      <Grid fluid>
        <Col md={3}>
          <DropdownButton
            title={`Sort ${sortOptions[this.state.sortedBy]}`}
            id="sort-dropdown"
            onSelect={sortedBy => this.setState({ sortedBy })}
            bsSize="small"
          >
            {map(sortOptions, (text, sortedBy) => (
              <MenuItem key={sortedBy} eventKey={sortedBy}>{text}</MenuItem>
            ))}
          </DropdownButton>
          <ol className="family-tree">{people}</ol>
        </Col>
        <Col md={9}>
          {this.state.currentPerson &&
            <PersonSummary
              person={this.state.currentPerson}
              family={this.state.family}
              onClick={number => this.handleClick(number)}
              addPerson={this.addPerson}
            />
          }
        </Col>
      </Grid>
    );
  }
}
