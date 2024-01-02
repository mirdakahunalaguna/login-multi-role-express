import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProducts = async (req, res) => {
    try {
        let response;
        // 1. Jika peran pengguna adalah "admin"
        if (req.role === "admin") {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            // 2. Jika peran pengguna bukan "admin"
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        // 3. Kirim respons dengan data produk
        res.status(200).json(response);
    } catch (error) {
        // 4. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};


export const getProductById = async (req, res) => {
    try {
        // 1. Temukan produk berdasarkan ID yang diberikan
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        // 2. Jika produk tidak ditemukan, kirim respons dengan status 404
        if (!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        // 3. Jika peran pengguna adalah "admin"
        if (req.role === "admin") {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            // 4. Jika peran pengguna bukan "admin"
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }

        // 5. Kirim respons dengan data produk
        res.status(200).json(response);
    } catch (error) {
        // 6. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};


export const createProduct = async (req, res) => {
    const {name, price} = req.body;
    try {
        // 1. Buat produk baru
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        });
        // 2. Kirim respons dengan pesan berhasil
        res.status(201).json({msg: "Product Created Successfully"});
    } catch (error) {
        // 3. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};

export const updateProduct = async (req, res) => {
    try {
        // 1. Temukan produk berdasarkan ID yang diberikan
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        // 2. Jika produk tidak ditemukan, kirim respons dengan status 404
        if (!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, price} = req.body;
        // 3. Jika peran pengguna adalah "admin"
        if (req.role === "admin") {
            await Product.update({name, price}, {
                where: {
                    id: product.id
                }
            });
        } else {
            // 4. Jika peran pengguna bukan "admin" dan bukan pemilik produk
            if (req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang"});
            // 5. Update produk jika pengguna adalah pemilik produk
            await Product.update({name, price}, {
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                }
            });
        }

        // 6. Kirim respons dengan pesan berhasil
        res.status(200).json({msg: "Product updated successfully"});
    } catch (error) {
        // 7. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};


export const deleteProduct = async (req, res) => {
    try {
        // 1. Temukan produk berdasarkan ID yang diberikan
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        // 2. Jika produk tidak ditemukan, kirim respons dengan status 404
        if (!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        // 3. Hapus produk berdasarkan peran pengguna
        if (req.role === "admin") {
            await Product.destroy({
                where: {
                    id: product.id
                }
            });
        } else {
            // 4. Jika peran pengguna bukan "admin" dan bukan pemilik produk
            if (req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang"});
            // 5. Hapus produk jika pengguna adalah pemilik produk
            await Product.destroy({
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}]
                }
            });
        }
        // 6. Kirim respons dengan pesan berhasil
        res.status(200).json({msg: "Product deleted successfully"});
    } catch (error) {
        // 7. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};
