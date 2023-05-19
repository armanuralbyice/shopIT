import React, {Fragment, useEffect, useState} from 'react';
import {useAlert} from 'react-alert';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {clearError, getProductById} from '../../action/productActions';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import {addCartItems} from "../../action/cartActions";

const Details = () => {
    const [quantity, setQuantity] = useState(1)
    const {id} = useParams();
    const dispatch = useDispatch()
    const alert = useAlert()
    const {loading, product, error} = useSelector((state) => state.productDetails)
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError())
        }
        dispatch(getProductById(id))
    }, [dispatch, alert, error, id])
    const increseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1
        setQuantity(qty)
    }
    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber <= 1) return;
        const qty = count.valueAsNumber - 1
        setQuantity(qty)
    }
    const addToCart = () => {
        dispatch(addCartItems(id, quantity))
        alert.success('Product Added')
    }
    return (
        <Fragment>
            {
                loading ? <Loader/> : (
                    <Fragment>
                        <MetaData title={product.name}/>
                        <div className="container container-fluid">
                            <div className="row f-flex justify-content-around">
                                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                                    {
                                        product.images && product.images.map(image => {
                                            return <img key={image.public_id} src={image.url} alt={product.title}
                                                        height="500" width="500"/>
                                        })
                                    }

                                </div>

                                <div className="col-12 col-lg-5 mt-5">
                                    <h3>{product.name}</h3>
                                    <p id="product_id">Product # {product._id}</p>


                                    <div className="rating-outer">
                                        <div className="rating-inner"></div>
                                    </div>
                                    <span id="no_of_reviews">(5 Reviews)</span>


                                    <p id="product_price">$ {product.price}</p>
                                    <div className="stockCounter d-inline">
                                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                                        <input type="number" className="form-control count d-inline" value={quantity}
                                               readOnly/>

                                        <span className="btn btn-primary plus" onClick={increseQty}>+</span>
                                    </div>
                                    <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4"
                                            disabled={product.stock === 0} onClick={addToCart}>Add to Cart
                                    </button>


                                    <p>Status: <span id="stock_status"
                                                     className={product.stock > 0 ? 'greenColor' : 'redColor'}>{product.stock > 0 ? 'In Stock' : 'Out of stock'}</span>
                                    </p>


                                    <h4 className="mt-2">Description:</h4>
                                    <p>{product.description}</p>

                                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

                                    <button id="review_btn" type="button" className="btn btn-primary mt-4"
                                            data-toggle="modal" data-target="#ratingModal">
                                        Submit Your Review
                                    </button>

                                    <div className="row mt-2 mb-5">
                                        <div className="rating w-50">

                                            <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog"
                                                 aria-labelledby="ratingModalLabel" aria-hidden="true">
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="ratingModalLabel">Submit
                                                                Review</h5>
                                                            <button type="button" className="close" data-dismiss="modal"
                                                                    aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">

                                                            <ul className="stars">
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                            </ul>

                                                            <textarea name="review" id="review"
                                                                      className="form-control mt-3">

                                        </textarea>

                                                            <button
                                                                className="btn my-3 float-right review-btn px-4 text-white"
                                                                data-dismiss="modal" aria-label="Close">Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </Fragment>
                )
            }
        </Fragment>
    );
};

export default Details;