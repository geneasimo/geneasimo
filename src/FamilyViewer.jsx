import { find, min, map, max, orderBy } from 'lodash';
import React, { Component } from 'react';
import { Col, DropdownButton, Grid, MenuItem } from 'react-bootstrap';
import Person from './Person';
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

    this.setMinMaxNumbers();
    this.state = {
      currentPerson: this.findPersonByNumber(this.minNumber),
      sortedBy: SORT_BY_AHNEN,
    };

    this.addPerson = this.addPerson.bind(this);
  }

  setMinMaxNumbers() {
    const numbers = map(this.props.family, p => p.number);
    this.minNumber = min(numbers);
    this.maxNumber = max(numbers);
  }

  findPersonByNumber(number) {
    return find(this.props.family, { number });
  }

  handleClick(number) {
    this.setState({ currentPerson: this.findPersonByNumber(number) });
  }

  addPerson(number, firstName, lastName) {
    this.props.family.push({ ...{ number, firstName, lastName } });
    this.setMinMaxNumbers();
    this.forceUpdate();
  }

  render() {
    const sortedByAhnen = this.state.sortedBy === SORT_BY_AHNEN;
    const fields = sortedByAhnen ? 'number' : ['lastName', 'firstName'];
    const sortedPeople = orderBy(this.props.family, fields, 'asc');

    const people = sortedPeople.map((person) => {
      const isCurrentPerson = person === this.state.currentPerson;
      const onClick = () => this.handleClick(person.number);
      return (
        <Person
          key={person.number}
          {...{ ...person, isCurrentPerson, onClick }}
          maxNumber={this.maxNumber}
        />
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
          <PersonSummary
            person={this.state.currentPerson}
            family={sortedPeople}
            onClick={number => this.handleClick(number)}
            addPerson={this.addPerson}
          />
        </Col>
      </Grid>
    );
  }
}
