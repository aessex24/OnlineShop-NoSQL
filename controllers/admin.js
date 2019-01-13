const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
    const editMode = req.query.edit;

    res.render('admin/edit-product', {
        docTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false
    }); // Allows to send a response and attach a body of type any.
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    })
    .then( (result) => {
        console.log('Product was created!!!');
        res.redirect('/admin/products');
    })
    .catch( err => console.log(err.message));    
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
    .then(products => {
        res.render('admin/products', { 
            prods: products,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    })
    .catch( err => console.log(err.message));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    //Product.findByPk(prodId)
    req.user.getProducts({ where: {id: prodId}})
    .then(products => {
        const product = products[0];
        if(!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    .catch(err => console.log(err.message));
};

exports.postEditProduct = (req, res, next) => {
    //const updates = {prodId, title, price, imageUrl, description} = req.body;
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const prodId = req.body.productId;
    Product.update({ title, price, imageUrl, description} , { where: { id: prodId } })
    .then( () => {
        console.log("Product updated");
        res.redirect('/admin/products');
    })
    .catch( err => console.log(err.message));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then( (product) => {
        return product.destroy();
    })
    .then( (result) => {
        console.log(`DESTROYED PRODUCT ${result}`);
        res.redirect('/admin/products');
    })
    .catch( err => console.log(err));
};
