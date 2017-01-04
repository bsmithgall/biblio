import React from 'react'

import NewWorkForm from './newWorkForm.component'

export default class NewWork extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this)
    this.state = {
      checked: false
    }
  }

  onChange() {
    this.setState({checked: !this.state.checked})
  }

  render() {
    const modalId = 'modal-' + this.props.shelfNumber

    return (
      <div className="modal">
        <label htmlFor={modalId}>
          <div className="modal-trigger" onClick={this.onChange}>Add new work</div>
        </label>
        <input
          className="modal-state"
          checked={this.state.checked}
          id={this.props.modal}
          type="checkbox"
        />
        <div className="modal-fade-screen">
          <div className="modal-inner">
            <div
              className="modal-close"
              htmlFor={this.props.modal}
              onClick={this.onChange}
            >
            </div>
            <NewWorkForm
              shelfNumber={this.props.shelfNumber}
              addWork={this.props.addWork}
              closeModal={this.onChange}
            />
          </div>
        </div>
      </div>
    )
  }
}
