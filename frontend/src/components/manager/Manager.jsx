import React from 'react'
import { Layout, Menu } from 'antd'
import 'antd/dist/antd.css'

import './default.css'
import { ContentType } from './Constant'
import { getCookie } from '../authenticate/Cookies'
import Dashboard from './dashBoard/dashBoard'
import StaffManagement from './staff/StaffManagement'
import Unauthorized from '../Unauthorized'
import { getSingleRestaurant } from '../apis/actions/restaurants'
import { handleAuthority } from '../services'
import Spinner from '../Spinner'
import MenuBuilder from './menuBuilder/MenuBuilder'

const { Header, Content, Sider } = Layout
const { DASHBOARD, STAFFS, MENUS, QRCODE } = ContentType

class Manager extends React.Component {
  state = {
    displayIndex: DASHBOARD,
    authorized: false,
    isLoading: true,
  }

  //request authority
  componentDidMount = () => {
    const { id } = this.props.match.params

    getSingleRestaurant(getCookie('token'), id, data => {
      //finish loading
      this.setState({
        isLoading: false,
      })

      handleAuthority(data, 'manager', () => {
        this.setState({
          authorized: true,
        })
      })
    })
  }

  renderContent = () => {
    if (this.state.displayIndex === DASHBOARD) {
      return <Dashboard {...this.props} />
    }
    if (this.state.displayIndex === STAFFS) {
      const { id } = this.props.match.params
      return <StaffManagement restaurantId={id} />
    }
    if (this.state.displayIndex === MENUS) {
      return <MenuBuilder {...this.props} />
    }
    if (this.state.displayIndex === QRCODE) {
      return <div>code</div>
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />
    }
    if (!this.state.isLoading && !this.state.authorized) {
      return <Unauthorized />
    }
    return (
      <Layout>
        <Header className="header">
          <h1>Hi, Manager! How do you feel today?</h1>
        </Header>
        <Layout>
          <Sider>
            <Menu className="sider-menu">
              <Menu.Item
                onClick={() => this.setState({ displayIndex: DASHBOARD })}
              >
                <i className="chart pie icon"></i>
                Dashboard
              </Menu.Item>
              <Menu.Item
                onClick={() => this.setState({ displayIndex: STAFFS })}
              >
                <i className="users icon"></i>
                Staff
              </Menu.Item>
              <Menu.Item onClick={() => this.setState({ displayIndex: MENUS })}>
                <i className="list icon"></i>
                Menu
              </Menu.Item>
              <Menu.Item
                onClick={() => this.setState({ displayIndex: QRCODE })}
              >
                <i className="qrcode icon"></i>
                QRCode
              </Menu.Item>
            </Menu>
          </Sider>
          <Content className="content">
            <div className="container">{this.renderContent()}</div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Manager
