import React from 'react'
import { Layout, Menu } from 'antd'
import 'antd/dist/antd.css'

import { ContentType } from './Constant'
import './default.css'

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
        <Header>
          <h1>Hi, Manager! How do you feel today?</h1>
        </Header>
        <Layout>
          <Sider>
            <Menu>
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
            </Menu>
          </Sider>
          <Content>
            <div>{this.renderContent()}</div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Manager
