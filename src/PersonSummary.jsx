import { find, map } from 'lodash';
import React, { Component } from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';

const initialState = {
  isEditingFather: false,
  isEditingMother: false,
};

const nameParts = ['First', 'Last'];

export default class PersonSummary extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.addPerson = this.addPerson.bind(this);
  }

  componentWillReceiveProps() {
    this.setState(initialState);
  }

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

  getForm(relationship) {
    const isEditingState = `isEditing${relationship}`;
    const isEditing = this.state[isEditingState];
    const onClick = isEditing
      ? () => this.addPerson(relationship)
      : () => this.setState({ [isEditingState]: true });

    const [firstNameInput, lastNameInput] = map(nameParts, namePart => (
      <FormControl
        type="text"
        placeholder={`${namePart} name`}
        inputRef={(input) => { this[`${relationship}${namePart}NameInput`] = input; }}
        className="input-xs"
      />
    ));
    const addButton = <Button {...{ onClick }} bsSize="xsmall">Add</Button>;
    const cancelButton = (
      <Button onClick={() => this.setState({ [isEditingState]: false })} bsSize="xsmall">
        Cancel
      </Button>
    );

    return (
      <Form inline>
        <FormGroup>
          <ControlLabel className="relationship">{relationship}:</ControlLabel> {' '}
          {isEditing && firstNameInput}
        </FormGroup> {' '}
        {isEditing && lastNameInput} {' '}
        {addButton} {' '}
        {isEditing && cancelButton}
      </Form>
    );
  }

  addPerson(relationship) {
    const [firstName, lastName] = map(nameParts, namePart => (
      this[`${relationship}${namePart}NameInput`].value
    ));
    const offset = relationship === 'Mother';
    const number = (this.props.person.number * 2) + offset;
    this.props.addPerson(number, firstName, lastName);
  }

  render() {
    const { family, person } = this.props;
    const parents = map(['Father', 'Mother'], (relationship) => {
      const offset = relationship === 'Mother';
      const parent = find(family, { number: (person.number * 2) + offset });

      const className = `parent${parent ? ` no-form ${relationship}` : ''}`;
      return (
        <div key={relationship} className={className}>
          {parent
            ? <span className={relationship}>{relationship}: {this.getName(parent)}</span>
            : this.getForm(relationship)
          }
        </div>
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
