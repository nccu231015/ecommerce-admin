import React from 'react';
import './AddProduct.css';
import upload_area from '../../Assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = React.useState(false);
    const [productDetails, setProductDetails] = React.useState({
        name: '',
        image: '',        
        category: 'women',
        new_price: '',
        old_price: '',
        description: '',
        categories: '',
        tags: '',
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        console.log(productDetails);
        let responseData;
        let product = {...productDetails};

        // 處理 categories 和 tags，將字符串轉換為數組
        if (product.categories) {
            product.categories = product.categories.split(',').map(item => item.trim()).filter(item => item);
        }
        
        if (product.tags) {
            product.tags = product.tags.split(',').map(item => item.trim()).filter(item => item);
        }

        let formData = new FormData();
        formData.append('product', image);

        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/upload`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        })
        .then((resp) => resp.json())
        .then((data) => {
            responseData = data;
        });

        if (responseData.success) {
            product.image = responseData.imageUrl;
            console.log("Sending product data:", product);
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/addproduct`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            })
            .then((resp) => resp.json()).then((data) => {
                data.success?alert("Product added successfully"):alert("Failed")
            })
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here'/>
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here'/>
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here'/>
                </div>           
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Description</p>
                <textarea value={productDetails.description} onChange={changeHandler} name='description' placeholder='Enter product description' rows='4' className='description-textarea'></textarea>
            </div>
            <div className="addproduct-itemfield">
                <p>Categories (comma separated)</p>
                <input value={productDetails.categories} onChange={changeHandler} type="text" name='categories' placeholder='e.g. Women, T-Shirt, Crop Top'/>
            </div>
            <div className="addproduct-itemfield">
                <p>Tags (comma separated)</p>
                <input value={productDetails.tags} onChange={changeHandler} type="text" name='tags' placeholder='e.g. Modern, Latest'/>
            </div>
            <div className="addproduct-upload">
                <label htmlFor="file-input">
                    <div className="upload-box">
                        <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                        <p>上傳產品圖片</p>
                    </div>
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
        </div>
    );
};

export default AddProduct;