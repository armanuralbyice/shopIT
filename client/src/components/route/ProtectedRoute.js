import {useSelector} from 'react-redux';

import React from 'react';
import {Navigate} from 'react-router-dom';

function ProtectedRoute({children}) {
    const {isAuthenticated, loading, user} = useSelector(state => state.auth)
    if (isAuthenticated === false) {
        return <Navigate to="/login" replace/>
    }
    return children
}

export default ProtectedRoute
