import React from 'react'
import { Layout, Menu } from 'antd'

import './Default.css'
import { ContentType } from '../services/Constant'

const { Header, Content, Sider } = Layout
const { DASHBOARD, STAFFS, MENUS, ORDERS } = ContentType

class Manager extends React.Component {
  state = {
    displayIndex: DASHBOARD,
  }

  renderContent = () => {
    if (this.state.displayIndex === DASHBOARD) {
      return <div>Report</div>
    }
    if (this.state.displayIndex === STAFFS) {
      return <div>staff</div>
    }
    if (this.state.displayIndex === MENUS) {
      return <div>menu</div>
    }
    if (this.state.displayIndex === ORDERS) {
      return <div>order</div>
    }
  }

  render() {
    return (
      <Layout>
        <Header className="ui pink small message header">
          <h1>Hi, Manager! How do you feel today?</h1>
        </Header>
        <Layout>
          <Sider>
            <Menu style={{ height: '100vh' }}>
              <Menu.Item
                onClick={() => this.setState({ displayIndex: DASHBOARD })}
              >
                <i class="chart pie icon"></i>
                Dashboard
              </Menu.Item>
              <Menu.Item
                onClick={() => this.setState({ displayIndex: STAFFS })}
              >
                <i class="users icon"></i>
                Staff
              </Menu.Item>
              <Menu.Item onClick={() => this.setState({ displayIndex: MENUS })}>
                <i class="list icon"></i>
                Menu
              </Menu.Item>
              <Menu.Item
                onClick={() => this.setState({ displayIndex: ORDERS })}
              >
                <i class="hand pointer icon"></i>
                Order
              </Menu.Item>
            </Menu>
          </Sider>
          <Content className="site-layout content" style={{ height: '100vh' }}>
            <div className="ui container">{this.renderContent()}</div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Manager
