import productModel from "../models/product.model.js";
import { uploadImage } from "../services/imagekit.service.js";
import mongoose from 'mongoose';


const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            priceAmount,
            priceCurrency = 'INR'
        } = req.body;

        if (!title || priceAmount === undefined || priceAmount === null) {
            return res.status(400).json({
                message: 'Title, Price are required',
                success: false
            });
        }

        const seller = req.user.id;

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency
        };

        //upload images to imagekit
        const images = await Promise.all(
            (req.files || []).map(file =>
                uploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folder: '/Product-Images'
                })

            )
        );


        const product = await productModel.create({
            title,
            description,
            price,
            seller,
            images
        });


        return res.status(201).json({
            message: 'Product created',
            success: true,
            data: product,
        });

    } catch (error) {
        console.error("🚀 ~ createProduct ~ error:", error);

        return res.status(500).json({
            message: 'Failed to create product',
            success: false,
            error: error.message
        });
    }
};


const getProducts = async (req, res) => {
    try {
        const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query

        const filter = {}

        if (q) {
            filter.$text = { $search: q }
        }

        if (minprice) {
            filter['price.amount'] = { ...filter['price.amount'], $gte: Number(minprice) }
        }

        if (maxprice) {
            filter['price.amount'] = { ...filter['price.amount'], $gte: Number(maxprice) }
        }

        const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit), 20))

        return res.status(200).json({ data: products })

    } catch (error) {
        console.error("🚀 ~ getProducts ~ error:", error)
    }
}

const getProductById = async (req, res) => {
    try {

        const { id } = req.params

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        return res.status(200).json({ data: product, success: true })

    } catch (error) {
        console.error("🚀 ~ getProductById ~ error:", error)
    }
}

const updateProduct = async (req, res) => {
    try {

        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product id",
                success: false
            })
        }

        const product = await productModel.findOne({
            _id: id,
            seller: req.user.id
        })

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        const allowedUpdates = ['title', 'description', 'price'];
        for (const key of Object.keys(req.body)) {
            if (allowedUpdates.includes(key)) {
                if (key === 'price' && typeof req.body.price === 'object') {
                    if (req.body.price.amount !== undefined) {
                        product.price.amount = Number(req.body.price.amount);
                    }
                    if (req.body.price.currency !== undefined) {
                        product.price.currency = req.body.price.currency;
                    }
                } else {
                    product[key] = req.body[key];
                }

            }
        }

        await product.save();

        return res.status(200).json({ message: 'Product updated', product, success: true });

    } catch (error) {
        console.error("🚀 ~ updateProduct ~ error:", error)
    }
}

const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product id' });
        }

        const product = await productModel.findOne({
            _id: id,
        })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Forbidden: you can only delete your own products'
            })
        }

        // await product.remove()
        await product.deleteOne();
        return res.status(200).json({ message: 'Product deleted', product, success: true });

    } catch (error) {
        console.error("🚀 ~ deleteProduct ~ error:", error)
    }
}

const getProductBySeller = async (req, res) => {
    try {

        const seller = req.user

        const { skip = 0, limit = 20 } = req.query;

        const products = await productModel.find({ seller: seller.id }).skip(skip).limit(Math.min(limit, 20));

        return res.status(200).json({ data: products });

    } catch (error) {
        console.error("🚀 ~ getProductBySeller ~ error:", error)
    }
}

export default { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductBySeller };
