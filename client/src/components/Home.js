import React, {Fragment, useEffect, useState} from "react";
import {useAlert} from "react-alert";
import Pagination from 'react-js-pagination';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getAllProducts} from "../action/productActions";
import MetaData from "../components/layout/MetaData";
import Loader from "./layout/Loader";
import Product from "./product/Product";

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch();
    const alert = useAlert();
    const {loading, products, error, productsCount, resPerPage} = useSelector((state) => state.products);
    const {keyword} = useParams()
    useEffect(() => {
        dispatch(getAllProducts(keyword, currentPage));
        if (error) {
            return alert.error(error);
        }
    }, [dispatch, error, alert, currentPage, keyword]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    return (
        <Fragment>
            {loading ? (
                <Loader/>
            ) : (
                <Fragment>
                    <h1 id="products_heading">Latest Products</h1>
                    <MetaData title={"Buy Best Products Online"}/>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products &&
                                products.map((product) => (
                                    <Product key={product._id} product={product}/>
                                ))}
                        </div>
                    </section>
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText={'next'}
                            prevPageText={'prev'}
                            firstPageText={'first'}
                            lastPageText={'last'}
                            itemClass='page-item'
                            linkClass='page-link'
                        />
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
