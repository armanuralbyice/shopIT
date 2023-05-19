import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Search = () => {
    const nevigate = useNavigate()
    const [keyword, setKeyword] = useState('')
    const searchHandler = (e) => {
        if (keyword.trim()) {
            nevigate(`/search/${keyword}`)
        } else {
            nevigate('/')
        }
        e.preventDefault();
    }
    return (
        <form onSubmit={searchHandler}>
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Search;