import {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {loadUser} from "./action/userActions";
import "./App.css";
import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Details from "./components/product/Details";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Login from "./components/user/Login";
import Profile from "./components/user/Profile";
import Register from "./components/user/Register";
import UpdateProfile from "./components/user/UpdateProfile";
import store from "./store";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";


function App() {

    useEffect(() => {
        store.dispatch(loadUser())
    }, [])
    return (
        <div className="App">
            <Router>
                <Header/>
                <div className="container container-fluid">
                    <Routes>
                        <Route path="/" element={<Home/>} exact/>
                        <Route path="/search/:keyword" element={<Home/>}/>
                        <Route path="/product/:id" element={<Details/>}/>
                        <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/shipping" element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/me" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                        <Route path="/me/update" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>

                    </Routes>
                </div>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;
