import React from 'react'
import { Modal, List, Button, message } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import { getSingleRestaurant } from '../../apis/actions/restaurants'
import { getCookie } from '../../authenticate/Cookies'
import { acceptInvitation } from '../../apis/actions/invitation'

class PendingInvitationModal extends React.Component {
  state = {
    restaurant: null,
    // name: '',
  }

  // onSetState = data => {
  //   this.setState({
  //     restaurant: data,
  //   })
  // }

  handleAcceptInvitation = async params => {
    await acceptInvitation(getCookie('token'), params)
  }

  renderInvitations = ({ restaurant, role }) => {
    //no permission, because it is still in pending, so the user has nothing to do with it yet
    // await getSingleRestaurant(getCookie('token'), restaurant, this.onSetState)
    // if (this.state.restaurant !== null) {
    //   this.setState({
    //     name: this.state.restaurant.name,
    //   })
    // }

    return (
      <List.Item key={restaurant}>
        <List.Item.Meta title={role} description={`From ${restaurant}`} />
        <Button
          onClick={() => this.handleAcceptInvitation({ restaurant, role })}
        >
          Accept
        </Button>
      </List.Item>
    )
  }

  renderPendingJobsList = () => {
    const { pendingJobs } = this.props
    if (pendingJobs.length > 0) {
      return (
        <List
          dataSource={pendingJobs}
          renderItem={this.renderInvitations}
        ></List>
      )
    }
    return <div>No Invitations</div>
  }

  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal visible={visible} onCancel={onCancel} footer={null}>
        <div className="scroller-container">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => message.info("You've loaded all", 1)}
            hasMore={false}
            useWindow={false}
          >
            {this.renderPendingJobsList()}
          </InfiniteScroll>
        </div>
      </Modal>
    )
  }
}

export default PendingInvitationModal
