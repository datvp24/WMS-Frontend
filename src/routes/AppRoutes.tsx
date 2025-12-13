import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";

//INVENTORY
import InventoryList from "../pages/inventory/InventoryList";
import InventoryHistory from "../pages/inventory/InventoryHistory";
import InventoryAdjustForm from "../pages/inventory/InventoryAdjustForm";

// WAREHOUSE
import WarehouseList from "../pages/warehouse/WarehouseList";
import WarehouseCreate from "../pages/warehouse/WarehouseCreate"; // bạn sẽ tạo sau
import WarehouseEdit from "../pages/warehouse/WarehouseEdit";     // bạn sẽ tạo sau

// LOCATION
import LocationList from "../pages/location/LocationList";
import LocationCreate from "../pages/location/LocationCreate"; // tạo sau
import LocationEdit from "../pages/location/LocationEdit";     // tạo sau

//PRODUCT
import ProductList from "../pages/product/ProductList";
import ProductForm from "../pages/product/ProductForm";

//CUSTOMER
import CustomerForm from "../pages/customer/CustomerForm";
import CustomerList from "../pages/customer/CustomerList";

//SUPPLIER
import SupplierForm from "../pages/supplier/SupplierForm";
import SupplierList from "../pages/supplier/SupplierList";

//UNIT
import UnitList from "../pages/unit/UnitList";
import UnitForm from "../pages/unit/UnitForm";

//CATEGORY
import CategoryCreate from "../pages/category/CategoryCreate";
import CategoryEdit from "../pages/category/CategoryEdit";
import CategoryList from "../pages/category/CategoryList";

//USER
import UserList from "../pages/user/UserList";
import UpdateUser from "../pages/user/UpdateUser";
import CreateUser from "../pages/user/CreateUser";
// ROLES
import RoleList from "../pages/roles/RoleList";
import RoleCreate from "../pages/roles/RoleCreate";
import RoleEdit from "../pages/roles/RoleEdit";
import RolePermissionAssign from "../pages/roles/RolePermissionAssign";

// PERMISSIONS
import PermissionList from "../pages/permissions/PermissionList";
import PermissionCreate from "../pages/permissions/PermissionCreate";
import PermissionEdit from "../pages/permissions/PermissionEdit";

// AUTH MGMT
import AssignRole from "../pages/auth/AssignRole";
import AssignPermission from "../pages/auth/AssignPermission";

// MASTER DATA
import BrandList from "../pages/brands/BrandList";
import BrandCreate from "../pages/brands/BrandCreate";
import BrandEdit from "../pages/brands/BrandEdit";


//PURCHASE
import PurchaseList from "../pages/purchase/PurchaseList";
import PurchaseForm from "../pages/purchase/PurchaseForm";
import GRList from "../pages/purchase/GoodsReceiptList";
import GRCreate from "../pages/purchase/GoodsReceiptCreate";

// TODO: Categories, Units, Suppliers, Customers, Products

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Private layout */}
            <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>

                {/* ROLES */}
                <Route path="roles" element={<RoleList />} />
                <Route path="roles/create" element={<RoleCreate />} />
                <Route path="roles/edit/:id" element={<RoleEdit />} />
                <Route path="roles/assign-permission/:id" element={<RolePermissionAssign />} />

                {/* PERMISSIONS */}
                <Route path="permissions" element={<PermissionList />} />
                <Route path="permissions/create" element={<PermissionCreate />} />
                <Route path="permissions/edit/:id" element={<PermissionEdit />} />

                {/* AUTH */}
                <Route path="auth/assign-role" element={<AssignRole />} />
                <Route path="auth/assign-permission" element={<AssignPermission />} />

                {/* MASTER DATA → BRANDS */}
                <Route path="master/brands" element={<BrandList />} />
                <Route path="master/brands/create" element={<BrandCreate />} />
                <Route path="master/brands/edit/:id" element={<BrandEdit />} />

                {/* USER  */}
                <Route path="users" element={<UserList />} />
                <Route path="users/edit/:id" element={<UpdateUser />} />
                <Route path="users/create" element={<CreateUser />} />

                {/* CATEGORY */}
                <Route path="category" element={<CategoryList />} />
                <Route path="category/edit/:id" element={<CategoryEdit />} />
                <Route path="category/create" element={<CategoryCreate />} />

                {/* UNIT */}
                <Route path="unit" element={<UnitList />} />
                <Route path="unit/edit/:id" element={<UnitForm />} />
                <Route path="unit/create" element={<UnitForm />} />

                {/* SUPPLIER */}
                <Route path="supplier" element={<SupplierList />} />
                <Route path="supplier/edit/:id" element={<SupplierForm mode="edit" />} />
                <Route path="supplier/create" element={<SupplierForm mode="create" />} />

                {/* CUSTOMER */}
                <Route path="customer" element={<CustomerList />} />
                <Route path="customer/edit/:id" element={<CustomerForm mode="edit" />} />
                <Route path="customer/create" element={<CustomerForm mode="create" />} />

                {/* PRODUCT */}
                <Route path="/product" element={<ProductList />} />
                <Route path="/product/create" element={<ProductForm />} />
                <Route path="/product/edit/:id" element={<ProductForm />} />  

                {/* INVENTORY */}
                <Route path="inventory" element={<InventoryList />} />
                <Route path="inventory/adjust" element={<InventoryAdjustForm />} />
                <Route path="inventory/:productId/history" element={<InventoryHistory />} />
                <Route path="inventory/history" element={<InventoryHistory />} />


                {/* === WAREHOUSE MODULE === */}
                <Route path="warehouse" element={<WarehouseList />} />
                <Route path="warehouse/create" element={<WarehouseCreate />} />
                <Route path="warehouse/edit/:id" element={<WarehouseEdit />} />

                {/* Nested Locations */}
                <Route path="warehouse/:warehouseId?/locations" element={<LocationList />} />
                <Route path="warehouse/:warehouseId?/locations/create" element={<LocationCreate />} />
                <Route path="warehouse/:warehouseId?/locations/edit/:id" element={<LocationEdit />} />

                {/* PURCHASE */}
                <Route path="purchase" element={<PurchaseList />}></Route>
                <Route path="purchase/form" element={<PurchaseForm />}></Route>
                <Route path="goodsreceipt" element={<GRList />}></Route>
                <Route path="goodsreceipt/form" element={<GRCreate />}></Route>
                
            </Route>

            {/* fallback */}
            <Route path="*" element={<Login />} />
        </Routes>
    );
}
