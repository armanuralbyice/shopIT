import React, {Fragment} from 'react';
import {useAlert} from "react-alert";
import {useDispatch, useSelector} from "react-redux";
import {Link} from 'react-router-dom';
import {logout} from '../../action/userActions';
import Search from './Search';

const Header = () => {
    const dispatch = useDispatch()
    const {cartItems} = useSelector(state => state.cart)
    const alert = useAlert()
    const {user, loading} = useSelector(
        (state) => state.auth
    );
    const logoutHandler = () => {
        dispatch(logout())
        alert.success('Logout Successfully')
    }
    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <a className='text-white' style={{'textDecoration': 'none'}} href="/">ShopIT</a>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Search/>
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <Link to='/cart' style={{textDecoration: 'none', paddingRight: '15px'}}>
                        <span id="cart" className="ml-3">Cart</span>
                        <span className="ml-1" id="cart_count">{cartItems.length}</span>
                    </Link>
                    {
                        user ? (
                            <div className='ml-4 dropdown d-inline'>
                                <Link to='#!' className='btn dropdown-toggle text-white mr-3' type='button'
                                      id='dropDownMenuButton' data-toggle='dropdown' aria-haspopup='true'
                                      aria-expanded='false'>
                                    <figure className='avatar avatar-nav' style={{padding: '5px 0 20px 0'}}>
                                        <h5>{user && user.name}</h5>
                                    </figure>
                                </Link>
                                <div className='dropdown-menu' aria-labelledby='dropDownMenuButton'>
                                    {
                                        user && user.role !== 'admin' ? (
                                            <Link className='dropdown-item' to='/orders/me'>Orders</Link>
                                        ) : (
                                            <Link className='dropdown-item' to='/deshboard'>Deshboard</Link>
                                        )
                                    }
                                    <Link className='dropdown-item' to='/me'>Profile</Link>
                                    <Link className='dropdown-item text-danger' to='/' onClick={logoutHandler}>
                                        logout
                                    </Link>
                                </div>
                            </div>
                        ) : !loading && <Link to='/login' className="btn" id="login_btn">Login</Link>
                    }

                </div>
            </nav>
        </Fragment>
    );
};

export default Header;