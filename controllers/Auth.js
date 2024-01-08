import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    // 1. Temukan pengguna berdasarkan alamat email yang diberikan
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    // 2. Jika pengguna tidak ditemukan, kirim respons dengan status 404
    if (!user) return res.status(404).json({msg: "User tidak ditemukan"});
    // 3. Verifikasi kata sandi menggunakan argon2
    const match = await argon2.verify(user.password, req.body.password);
    // 4. Jika kata sandi tidak cocok, kirim respons dengan status 400
    if (!match) return res.status(400).json({msg: "Wrong Password"});
    // 5. Atur sesi untuk pengguna yang berhasil login
    req.session.userId = user.uuid;
    // 6. Kirim respons dengan informasi pengguna yang berhasil login
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, name, email, role,msg: "berhasil login"});
};

export const Me = async (req, res) => {
    // 1. Periksa apakah sesi pengguna sudah ada
    if (!req.session.userId) {
        return res.status(401).json({msg: "Mohon login ke akun Anda!"});
    }
    // 2. Temukan informasi pengguna berdasarkan ID sesi
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    });
    // 3. Jika pengguna tidak ditemukan, kirim respons dengan status 404
    if (!user) return res.status(404).json({msg: "User tidak ditemukan"});
    // 4. Kirim respons dengan informasi pengguna
    res.status(200).json(user);
};


export const logOut = (req, res) => {
    // 1. Hancurkan sesi untuk logout
    req.session.destroy((err) => {
        if (err) return res.status(400).json({msg: "Tidak dapat logout"});
        // 2. Kirim respons setelah logout berhasil
        res.status(200).json({msg: "Anda telah logout"});
    });
};
