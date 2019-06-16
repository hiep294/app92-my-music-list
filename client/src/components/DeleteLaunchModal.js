import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import trashIcon from '../icons/trash.png'

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }


  render() {
    return (
      <>
        <img src={trashIcon} alt="" onClick={this.toggle} />
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Removing Confirmation</ModalHeader>
          <ModalBody>
            <h4>Are you sure to remove this one?</h4>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {
              this.toggle()
              this.props.onDelete()
            }}>Sure</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default ModalExample;