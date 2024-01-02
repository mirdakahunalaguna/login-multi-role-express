import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

// Definisikan model untuk entitas "Product"
const Products = db.define('product', {
    // UUID yang dihasilkan secara otomatis untuk mengidentifikasi produk
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Nama produk dengan batasan panjang antara 3 dan 100 karakter
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]//jumlah karakter batas bawah dan atas
        }
    },
    // Harga produk
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Kunci asing yang menghubungkan produk dengan pengguna yang membuatnya
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    // Konfigurasi untuk membekukan nama tabel menjadi "product"
    freezeTableName: true
});

// Hubungan antara "User" dan "Product"
Users.hasMany(Products);
Products.belongsTo(Users, { foreignKey: 'userId' });

// Ekspor model "Products" untuk digunakan di tempat lain
export default Products;
