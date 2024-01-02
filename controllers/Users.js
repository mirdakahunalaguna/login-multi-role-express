import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        // 1. Dapatkan daftar pengguna
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        // 2. Kirim respons dengan daftar pengguna
        res.status(200).json(response);
    } catch (error) {
        // 3. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};


export const getUserById = async (req, res) => {
    try {
        // 1. Temukan pengguna berdasarkan ID yang diberikan
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        // 2. Kirim respons dengan data pengguna
        res.status(200).json(response);
    } catch (error) {
        // 3. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};


export const createUser = async (req, res) => {
    const {name, email, password, confPassword, role} = req.body;
    // 1. Validasi kata sandi dan konfirmasi kata sandi
    if (password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    // 2. Hash kata sandi
    const hashPassword = await argon2.hash(password);
    try {
        // 3. Buat pengguna baru
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        // 4. Kirim respons dengan pesan berhasil
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        // 5. Tangani kesalahan server
        res.status(400).json({msg: error.message});
    }
};


export const updateUser = async (req, res) => {
    try {
        // 1. Temukan pengguna berdasarkan ID yang diberikan
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });
        // 2. Jika pengguna tidak ditemukan, kirim respons dengan status 404
        if (!user) return res.status(404).json({msg: "User tidak ditemukan"});
        const {name, email, password, confPassword, role} = req.body;
        // 3. Hash kata sandi jika ada perubahan
        let hashPassword;
        if (password === "" || password === null) {
            hashPassword = user.password;
        } else {
            hashPassword = await argon2.hash(password);
        }
        // 4. Validasi kata sandi dan konfirmasi kata sandi
        if (password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
        // 5. Update pengguna
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });

        // 6. Kirim respons dengan pesan berhasil
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        // 7. Tangani kesalahan server
        res.status(400).json({msg: error.message});
    }
};

export const deleteUser = async (req, res) => {
    try {
        // 1. Temukan pengguna berdasarkan ID yang diberikan
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });
        // 2. Jika pengguna tidak ditemukan, kirim respons dengan status 404
        if (!user) return res.status(404).json({msg: "User tidak ditemukan"});
        // 3. Hapus pengguna
        await User.destroy({
            where: {
                id: user.id
            }
        });
        // 4. Kirim respons dengan pesan berhasil
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        // 5. Tangani kesalahan server
        res.status(400).json({msg: error.message});
    }
};
