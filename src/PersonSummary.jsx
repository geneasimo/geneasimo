import { filter, find, map } from 'lodash';
import React, { Component } from 'react';
import { ControlLabel, Form, FormGroup } from 'react-bootstrap';
import TinyButton from './helpers/TinyButton';
import TinyTextInput from './helpers/TinyTextInput';

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
    this.deletePerson = this.deletePerson.bind(this);
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

  getAncestors(person) {
    const toBinary = int => int.toString(2);
    const binaryNumber = toBinary(person.number);
    return filter(
      this.props.family,
      p => toBinary(p.number).startsWith(binaryNumber),
    );
  }

  getForm(relationship) {
    const isEditingState = `isEditing${relationship}`;
    const isEditing = this.state[isEditingState];
    const onClick = isEditing
      ? () => this.addPerson(relationship)
      : () => this.setState({ [isEditingState]: true });

    const [firstNameInput, lastNameInput] = map(nameParts, namePart => (
      <TinyTextInput
        placeholder={`${namePart} name`}
        inputRef={(input) => { this[`${relationship}${namePart}NameInput`] = input; }}
      />
    ));
    const addButton = <TinyButton {...{ onClick }}>Add</TinyButton>;
    const cancelButton = (
      <TinyButton onClick={() => this.setState({ [isEditingState]: false })}>
        Cancel
      </TinyButton>
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

  deletePerson(person, deleteAncestors = false) {
    const { deletePerson } = this.props;
    deletePerson(person);
    if (deleteAncestors) {
      this.getAncestors(person).forEach(ancestor => (
        deletePerson(ancestor)
      ));
    }
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
        <h3>
          {this.getName(person, false)} {' '}
          <span onMouseLeave={() => this.setState({ isMouseInside: false })}>
            <TinyButton
              onMouseEnter={() => this.setState({ isMouseInside: true })}
              bsStyle="danger"
              onClick={() => this.deletePerson(person)}
            >
              Delete
            </TinyButton> {' '}
            { this.state.isMouseInside &&
              <TinyButton bsStyle="danger" onClick={() => this.deletePerson(person, true)}>
                Delete with ancestors
              </TinyButton>
            }
          </span>
        </h3>
        {parents}
      </div>
    );
  }
}
