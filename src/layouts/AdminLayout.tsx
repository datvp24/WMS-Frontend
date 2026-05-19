import { Layout, Menu, Button } from "antd";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/global.css";
import { DashboardOutlined } from "@ant-design/icons";
import type{ InventoryChange } from "../types/iinventory";
import {
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  AppstoreOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  useInventoryChangeContext,
} from "../context/InventoryChangeContext";

import InventoryChangeBell from "../features/InventoryChangeBell";
import { useInventoryChangesWS } from "../hooks/useInventoryChanges";

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const siderWidth = 240;
  const siderCollapsedWidth = 80;

  // ✅ Poll toàn bộ inventory mỗi 30s
 
const {
  changes,
  unreadCount,
  isPolling,
  markAllRead,
  clearChanges,
} = useInventoryChangeContext();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={siderWidth}
        theme="dark"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflowY: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          WMS
        </div>

        <div style={{ height: `calc(100vh - 60px)`, overflowY: "auto" }}>
          <Menu theme="dark" mode="inline" style={{ borderRight: 0 }}>
            <Menu.Item key="/" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>

            <Menu.SubMenu key="users" icon={<UserOutlined />} title="USERS">
              <Menu.Item key="users-list">
                <Link to="users">User List</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="roles" icon={<TeamOutlined />} title="ROLES">
              <Menu.Item key="roles-list">
                <Link to="/roles">Role List</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="warehouse" icon={<HomeOutlined />} title="WAREHOUSE">
              <Menu.Item key="warehouse-list">
                <Link to="/warehouse">Warehouses</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="transfer" icon={<SwapOutlined />} title="TRANSFER">
              <Menu.Item key="transfer-list">
                <Link to="/transfer">Transfer List</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="location" icon={<EnvironmentOutlined />} title="LOCATION">
              <Menu.Item key="location-list">
                <Link to="/warehouse/locations">Locations</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="inventory" icon={<DatabaseOutlined />} title="INVENTORY">
              <Menu.Item key="inventory-list">
                <Link to="/inventory">Inventory List</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="permissions" icon={<LockOutlined />} title="PERMISSIONS">
              <Menu.Item key="permissions-list">
                <Link to="/permissions">Permission List</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="master" icon={<AppstoreOutlined />} title="MASTER DATA">
              <Menu.Item key="master-brands">
                <Link to="/master/brands">Brands</Link>
              </Menu.Item>
              <Menu.Item key="master-categories">
                <Link to="category">Categories</Link>
              </Menu.Item>
              <Menu.Item key="master-units">
                <Link to="unit">Units</Link>
              </Menu.Item>
              <Menu.Item key="master-suppliers">
                <Link to="supplier">Suppliers</Link>
              </Menu.Item>
              <Menu.Item key="master-customers">
                <Link to="customer">Customers</Link>
              </Menu.Item>
              <Menu.Item key="master-products">
                <Link to="product">Products</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="purchase" icon={<ShoppingCartOutlined />} title="NHẬP HÀNG">
              <Menu.Item key="gr-list">
                <Link to="/goodsreceipt">DANH SÁCH ĐƠN NHẬP</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="sales" icon={<FileTextOutlined />} title="XUẤT HÀNG">
              <Menu.Item key="sales-goods-issue-list">
                <Link to="/sales/goods-issue">DANH SÁCH ĐƠN XUẤT</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </Sider>

      {/* Main layout */}
      <Layout
        style={{
          marginLeft: collapsed ? siderCollapsedWidth : siderWidth,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // ✅ space-between để bell nằm phải
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          {/* Trái: toggle + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "▶" : "◀"}
            </Button>
            <h3 style={{ margin: 0 }}>Warehouse Management System</h3>
          </div>

          {/* Phải: Bell notification */}
          <InventoryChangeBell
            changes={changes}
            unreadCount={unreadCount}
            isPolling={isPolling}
            onMarkAllRead={markAllRead}
            onClear={clearChanges}
            onNavigateToInventory={() => navigate("/inventory")}
          />
        </Header>

        <Content
          style={{
            padding: 24,
            background: "#F0F2F5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}