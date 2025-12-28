# UAS Pemrograman API Next.js - Manajemen Buku

Proyek ini adalah aplikasi REST API berbasis **Next.js** yang mengimplementasikan autentikasi **JWT (JSON Web Token)**, **Middleware** untuk otorisasi berbasis peran (Role-Based Access Control), dan menggunakan database cloud **Neon (PostgreSQL)**.

## 🚀 Fitur Utama

1.  **Autentikasi JWT**: Login aman menggunakan `jose` untuk generate dan verifikasi token.
2.  **Middleware Security**: 
    * Membatasi akses rute private (Books & Users).
    * **Role-Based Access Control (RBAC)**: Rute `/api/users` hanya dapat diakses oleh user dengan role `Admin`.
3.  **Database Cloud**: Terintegrasi dengan **Neon PostgreSQL** menggunakan **Prisma ORM**.
4.  **Deployment**: Berjalan di platform **Vercel**.

## 🛠️ Teknologi yang Digunakan

* **Framework**: Next.js 14/15
* **Database**: Neon PostgreSQL
* **ORM**: Prisma
* **Auth**: Jose (JWT) & Bcryptjs (Password Hashing)
* **Deployment**: Vercel

## 📋 Struktur API Endpoints

### Public Routes
| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Login untuk mendapatkan Bearer Token |
| POST | `/api/auth/register` | Mendaftarkan akun user baru |

### Protected Routes (Membutuhkan Token)
| Method | Endpoint | Role | Keterangan |
| :--- | :--- | :--- | :--- |
| GET | `/api/books` | User/Admin | Mendapatkan semua daftar buku |
| POST | `/api/books` | User/Admin | Menambahkan data buku baru |
| GET | `/api/users` | Admin Only | Melihat daftar user (Hanya Admin) |

## ⚙️ Konfigurasi Environment Variables (.env)

Pastikan variabel berikut telah diatur di Vercel Dashboard agar aplikasi berjalan normal:

```env
DATABASE_URL="postgres://..."
JWT_SECRET="isi_secret_anda"
DISABLE_AUTH_MIDDLEWARE="false"