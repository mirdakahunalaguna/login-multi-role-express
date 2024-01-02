import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Definisikan model untuk entitas "User"
const Users = db.define('users', {
    // UUID yang dihasilkan secara otomatis untuk mengidentifikasi pengguna
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Nama pengguna dengan batasan panjang antara 3 dan 100 karakter
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    // Alamat email pengguna dengan validasi format email
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    // Kata sandi pengguna
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Peran atau peran pengguna (misalnya: 'admin', 'user')
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    // Konfigurasi untuk membekukan nama tabel menjadi "users"
    freezeTableName: true
});

// Ekspor model "Users" untuk digunakan di tempat lain
export default Users;
