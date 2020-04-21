import React from 'react'
import { PropTypes } from 'prop-types'
import { Tooltip } from 'antd'

import ImageUploadModal from '../../imageUpload/ImageUploadModal'
import { getCookie } from '../../authenticate/Cookies'

const baseURL = 'http://localhost:8000'

class MenuItemCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      categoryId: props.categoryId,
      showImageUploadModal: false,
    }
  }

  renderImage = item => {
    const { id } = this.props.match.params
    const { img } = item

    //backend api is a bit buggy, but the workaround is that no orginalname, then no image uploaded yet
    if (img.originalname !== undefined) {
      return (
        <img
          style={{ width: '100%', height: '100px' }}
          src={baseURL + `/restaurants/${id}` + img.relativePath}
        />
      )
    }

    return (
      <img
        style={{ width: '100%', height: '100px' }}
        src={require('../../homepage/SWLogo.png')}
      />
    )
  }

  render() {
    const { item } = this.props
    const { id: restaurantId } = this.props.match.params
    const {
      handleMenuItemEdit,
      onSetCurrentMenuParam,
      onDeleteMenuItem,
    } = this.props

    return (
      <div className="card">
        <ImageUploadModal
          visible={this.state.showImageUploadModal}
          onCancel={() =>
            this.setState({
              showImageUploadModal: false,
            })
          }
          tag="menuItem"
          params={{
            token: getCookie('token'),
            restaurantId,
            menuItemId: item._id,
          }}
        />
        <div
          className="clickable image"
          onClick={() =>
            this.setState({
              showImageUploadModal: true,
            })
          }
        >
          {this.renderImage(item)}
        </div>
        <div className="extra">
          <Tooltip
            placement="topLeft"
            title={`price is ${item.price}`}
            arrowPointAtCenter
          >
            {item.name}
          </Tooltip>
          <Tooltip
            placement="topLeft"
            title="modify the menuItem"
            arrowPointAtCenter
          >
            <span
              className="right"
              onClick={() => {
                onSetCurrentMenuParam(item)
                handleMenuItemEdit()
              }}
            >
              <i className="clickable pencil alternate icon"></i>
            </span>
          </Tooltip>
          <Tooltip
            placement="topLeft"
            title="delete the menuItem"
            arrowPointAtCenter
          >
            <span className="right" onClick={() => onDeleteMenuItem(item._id)}>
              <i className="clickable trash icon"></i>
            </span>
          </Tooltip>
        </div>
      </div>
    )
  }
}

MenuItemCard.prototypes = {
  item: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
}

export default MenuItemCard
