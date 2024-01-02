import User from "../models/UserModel.js"; 

// Middleware untuk memeriksa apakah pengguna telah login
export const verifyUser = async (req, res, next) => {
    try {
        // 1. Periksa apakah ada ID pengguna dalam sesi
        if (!req.session.userId) {
            return res.status(401).json({msg: "Mohon login ke akun Anda!"});
        }
        // 2. Temukan pengguna berdasarkan ID sesi
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        // 3. Jika pengguna tidak ditemukan, kirim respons dengan status 404
        if (!user) return res.status(404).json({msg: "User tidak ditemukan"});
        // 4. Setel ID pengguna dan peran pada objek permintaan (request)
        req.userId = user.id;
        req.role = user.role;
        // 5. Lanjutkan ke middleware atau rute berikutnya
        next();
    } catch (error) {
        // 6. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};
 
// Middleware untuk memeriksa apakah pengguna memiliki peran admin
export const adminOnly = async (req, res, next) => {
    try {
        // 1. Temukan pengguna berdasarkan ID sesi
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        // 2. Jika pengguna tidak ditemukan, kirim respons dengan status 404
        if (!user) return res.status(404).json({msg: "User tidak ditemukan"});
        // 3. Periksa apakah peran pengguna adalah 'admin'
        if (user.role !== "admin") return res.status(403).json({msg: "Akses terlarang"});
        // 4. Lanjutkan ke middleware atau rute berikutnya
        next();
    } catch (error) {
        // 5. Tangani kesalahan server
        res.status(500).json({msg: error.message});
    }
};
