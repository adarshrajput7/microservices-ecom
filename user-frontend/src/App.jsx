import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./components/Home"
import Profile from "./components/Profile"
import Footwear from "./components/products-pages/Footwear"
import Clothing from "./components/products-pages/Clothing"
import Mobiles from "./components/products-pages/Mobiles"
import ActiveLifestyle from "./components/products-pages/ActiveLifestyle"
import ProductDashboard from "./components/products/ProductDashboard"
import SideBarr from "./components/SideBarr"
import Products from "./components/Products"
import ProductsView from "./components/products/ProductsView"
import Filters from "./components/products-pages/Filters"
// import Men from "./components/products-pages/Men"
import ProductCatalog from "./components/ProductCatalog"
import Women from "./components/products-pages/Women"
import Cart from "./components/cart/Cart"
// import Women from "./components/products/Women"
import { CartProvider } from "./components/cart/CartContext";
import Orders from "./components/cart/Orders"
import Footer from "./components/Footer"
import Search from "./components/Search"

const App = () => {
  const routes = [
    { path: "/", element: <><Navbar transparent  />  <Search /> <Home /><Footer/> </> },
    { path: "/register", element: <><Navbar /> <Search /> <Register /><Footer/></> },
    { path: "/login", element: <><Navbar /> <Search /> <Login /><Footer/></> },
    { path: "/profile", element: <><Navbar /> <Search /> <Profile /><Footer/></> },
    { path: "/products", element: <><Navbar /> <Search /> <SideBarr /><Footer/></> },
    { path: "/pro", element: <><Navbar /> <Products /></> },
    { path: '/view/:id', element: <><Navbar /><Search /> <ProductsView /><Footer/></> },
    { path: '/collections-all-men', element: <><Navbar /><Search /><Filters /><Footer/></> },
    { path: '/collections-all-women', element: <><Navbar /><Search /><Filters /><Footer/></> },
    { path: '/collections-footwear', element: <><Navbar /><Search /><Filters /><Footer/></> },
    { path: '/collections-clothing', element: <><Navbar /><Search /><Filters /><Footer/></> },
    { path: '/collections-lifestyle', element: <><Navbar /><Search /><Filters /><Footer/></> },
    { path: '/collections-mobiles', element: <><Navbar /><Search /><Filters /><Footer/></> },
    { path: '/collections', element: <><Navbar /><Search /><Filters /><Footer/></> },
    { path: '/women', element: <><Navbar /><SideBarr /></> },
    { path: '/coll', element: <><Navbar /><ProductCatalog /></> },
    { path: '/coll-women', element: <><Navbar /><Women /></> },
    { path: '/cart', element: <><Navbar /><Cart /><Footer/></> },
    { path: '/cart/order', element: <><Navbar /><Orders /><Footer/></> },
    {
      path: "/dash",
      element: (
        <>
          <Navbar />
          <ProductDashboard />
        </>
      ),
      children: [
        { path: "footwear", element: <Footwear /> },
        { path: "clothing", element: <Clothing /> },
        { path: "mobiles", element: <Mobiles /> },
        { path: "activelifestyle", element: <ActiveLifestyle /> },
      ]
    }
  ]

  // 🔁 Recursive function jo children ko bhi render karega
  const renderRoutes = (routes) =>
    routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ))

  return (
    <div>
      <CartProvider>
      <Routes>
        {renderRoutes(routes)}
        </Routes>
        </CartProvider>
    </div>
  )
}

export default App


