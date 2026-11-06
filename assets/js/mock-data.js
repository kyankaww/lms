/*
|--------------------------------------------------------------------------
| DATA DEMO PKBM & LPK
|--------------------------------------------------------------------------
| Semua data di bawah ini merupakan data fiktif.
| Jangan gunakan informasi pribadi siswa sungguhan.
*/

window.DEMO_SEED = {
    version: 3,

    programs: [
        {
            id: "prog-paket-a",
            name: "Paket A",
            category: "PKBM",
            level: "Setara SD",
            description:
                "Program pendidikan kesetaraan untuk jenjang dasar.",
            registrationFee: 100000,
            tuitionFee: 600000,
            active: true
        },

        {
            id: "prog-paket-b",
            name: "Paket B",
            category: "PKBM",
            level: "Setara SMP",
            description:
                "Program pendidikan kesetaraan untuk jenjang menengah pertama.",
            registrationFee: 100000,
            tuitionFee: 750000,
            active: true
        },

        {
            id: "prog-paket-c",
            name: "Paket C",
            category: "PKBM",
            level: "Setara SMA",
            description:
                "Program pendidikan kesetaraan untuk jenjang menengah atas.",
            registrationFee: 100000,
            tuitionFee: 900000,
            active: true
        },

        {
            id: "prog-komputer",
            name: "Komputer Dasar",
            category: "LPK",
            level: "Pelatihan",
            description:
                "Pengenalan komputer, dokumen, dan keterampilan digital dasar.",
            registrationFee: 50000,
            tuitionFee: 500000,
            active: true
        },

        {
            id: "prog-desain",
            name: "Desain Grafis Dasar",
            category: "LPK",
            level: "Pelatihan",
            description:
                "Dasar desain visual dan penggunaan aplikasi desain.",
            registrationFee: 50000,
            tuitionFee: 600000,
            active: true
        }
    ],

    registrations: [
        {
            id: "reg-demo-001",
            email: "peserta@example.test",
            name: "Peserta Demo",
            programId: "prog-paket-c",
            programName: "Paket C",
            category: "PKBM",
            note: "Ingin mengikuti kelas sore.",
            status: "Menunggu verifikasi",
            paymentStatus: "Belum dibayar",
            registrationFee: 100000,
            tuitionFee: 900000,
            totalAmount: 1000000,
            createdAt: "2026-10-20T09:30:00.000Z",
            statusHistory: []
        },

        {
            id: "reg-demo-002",
            email: "peserta@example.test",
            name: "Peserta Demo",
            programId: "prog-komputer",
            programName: "Komputer Dasar",
            category: "LPK",
            note: "Sudah pernah mengikuti pelatihan dasar.",
            status: "Diterima",
            paymentStatus: "Lunas",
            registrationFee: 50000,
            tuitionFee: 500000,
            totalAmount: 550000,
            paymentProof: "bukti-transfer-demo.jpg",
            paymentSubmittedAt: "2026-09-16T08:15:00.000Z",
            studentId: "student-demo-002",
            createdAt: "2026-09-15T10:00:00.000Z",
            statusHistory: [
                {
                    type: "verification",
                    from: "Menunggu verifikasi",
                    to: "Diterima",
                    changedAt: "2026-09-17T02:20:00.000Z"
                },
                {
                    type: "payment",
                    from: "Menunggu konfirmasi",
                    to: "Lunas",
                    changedAt: "2026-09-17T02:25:00.000Z"
                }
            ]
        }
    ],

    students: [
        {
            id: "student-demo-001",
            studentNumber: "STD-0001",
            fullName: "Siswa Demo",
            name: "Siswa Demo",
            email: "student@example.test",
            nik: "3201010101010001",
            familyCardNumber: "3201010101010002",
            birthPlace: "Bandung",
            birthDate: "2004-02-12",
            gender: "Laki-laki",
            religion: "Islam",
            phone: "081234567801",
            address: "Jl. Pendidikan No. 1, Bandung",
            educationLevel: "SMP / MTs",
            graduationYear: "2022",
            schoolName: "SMP Negeri 1 Bandung",
            documents: {
                ktp: "ktp-siswa-demo.jpg",
                kk: "kk-siswa-demo.jpg",
                diploma: "ijazah-siswa-demo.pdf",
                photo: "foto-siswa-demo.jpg"
            },
            programId: "prog-paket-c",
            classId: "class-demo-001",
            status: "active",
            createdAt: "2026-08-10T07:45:00.000Z"
        },

        {
            id: "student-demo-002",
            studentNumber: "STD-0002",
            fullName: "Peserta Demo",
            name: "Peserta Demo",
            email: "peserta@example.test",
            nik: "3201010101010011",
            familyCardNumber: "3201010101010012",
            birthPlace: "Cimahi",
            birthDate: "2005-06-08",
            gender: "Perempuan",
            religion: "Islam",
            phone: "081234567802",
            address: "Jl. Keterampilan No. 8, Cimahi",
            educationLevel: "SMA / MA",
            graduationYear: "2023",
            schoolName: "SMA Negeri 2 Cimahi",
            documents: {
                ktp: "ktp-peserta-demo.jpg",
                kk: "kk-peserta-demo.jpg",
                diploma: "ijazah-peserta-demo.pdf",
                photo: "foto-peserta-demo.jpg"
            },
            programId: "prog-komputer",
            classId: "class-demo-002",
            registrationId: "reg-demo-002",
            status: "active",
            createdAt: "2026-09-17T02:20:00.000Z"
        }
    ],

    teachers: [
        {
            id: "teacher-demo-001",
            teacherNumber: "TCH-0001",
            fullName: "Rina Kartika",
            name: "Rina Kartika",
            nip: "198804122015032001",
            familyCardNumber: "3201010101010021",
            birthPlace: "Bandung",
            birthDate: "1988-04-12",
            gender: "Perempuan",
            religion: "Islam",
            phone: "081234567811",
            address: "Jl. Guru No. 4, Bandung",
            educationLevel: "S1",
            graduationYear: "2010",
            schoolName: "Universitas Pendidikan Indonesia",
            documents: {},
            status: "active",
            createdAt: "2026-07-01T08:00:00.000Z"
        },

        {
            id: "teacher-demo-002",
            teacherNumber: "TCH-0002",
            fullName: "Andi Pratama",
            name: "Andi Pratama",
            nip: "199101182016041002",
            familyCardNumber: "3201010101010022",
            birthPlace: "Garut",
            birthDate: "1991-01-18",
            gender: "Laki-laki",
            religion: "Islam",
            phone: "081234567812",
            address: "Jl. Teknologi No. 12, Bandung",
            educationLevel: "S1",
            graduationYear: "2013",
            schoolName: "Institut Teknologi Bandung",
            documents: {},
            status: "active",
            createdAt: "2026-07-05T08:00:00.000Z"
        }
    ],

    classes: [
        {
            id: "class-demo-001",
            name: "Kelas C - Pagi",
            programId: "prog-paket-c",
            academicYear: "2026/2027",
            teacherName: "Rina Kartika",
            active: true,
            createdAt: "2026-07-10T08:00:00.000Z"
        },

        {
            id: "class-demo-002",
            name: "Komputer Dasar - Reguler",
            programId: "prog-komputer",
            academicYear: "2026/2027",
            teacherName: "Andi Pratama",
            active: true,
            createdAt: "2026-07-12T08:00:00.000Z"
        }
    ],

    subjects: [
        {
            id: "subj-demo-001",
            code: "BIN",
            name: "Bahasa Indonesia",
            programId: "prog-paket-c",
            description: "Membaca, menulis, dan memahami teks.",
            active: true
        },

        {
            id: "subj-demo-002",
            code: "MAT",
            name: "Matematika",
            programId: "prog-paket-c",
            description: "Dasar-dasar matematika untuk pendidikan kesetaraan.",
            active: true
        },

        {
            id: "subj-demo-003",
            code: "KOM",
            name: "Komputer Dasar",
            programId: "prog-komputer",
            description: "Pengenalan perangkat keras, perangkat lunak, dan internet.",
            active: true
        },

        {
            id: "subj-demo-004",
            code: "DSN",
            name: "Dasar Desain",
            programId: "prog-desain",
            description: "Prinsip dasar desain visual dan komposisi.",
            active: true
        }
    ],

    profiles: [
        {
            email: "peserta@example.test",
            namaLengkap: "Peserta Demo",
            nik: "3201010101010011",
            noKK: "3201010101010012",
            tempatLahir: "Cimahi",
            tanggalLahir: "2005-06-08",
            jenisKelamin: "Perempuan",
            agama: "Islam",
            noHP: "081234567802",
            alamat: "Jl. Keterampilan No. 8, Cimahi",
            pendidikanTerakhir: "SMA / Sederajat",
            tahunLulus: "2023",
            namaSekolah: "SMA Negeri 2 Cimahi",
            documents: {
                ktp: "ktp-peserta-demo.jpg",
                kk: "kk-peserta-demo.jpg",
                ijazah: "ijazah-peserta-demo.pdf",
                foto: "foto-peserta-demo.jpg"
            },
            complete: true,
            updatedAt: "2026-09-14T09:00:00.000Z"
        }
    ],

    schedules: [
        {
            id: "schedule-demo-001",
            classId: "class-demo-001",
            subjectId: "subj-demo-001",
            teacherName: "Rina Kartika",
            day: "Senin",
            startTime: "08:00",
            endTime: "10:00",
            room: "Ruang A1",
            active: true,
            createdAt: "2026-09-20T08:00:00.000Z"
        },

        {
            id: "schedule-demo-002",
            classId: "class-demo-001",
            subjectId: "subj-demo-002",
            teacherName: "Rina Kartika",
            day: "Rabu",
            startTime: "08:00",
            endTime: "10:00",
            room: "Ruang A1",
            active: true,
            createdAt: "2026-09-20T08:05:00.000Z"
        },

        {
            id: "schedule-demo-003",
            classId: "class-demo-002",
            subjectId: "subj-demo-003",
            teacherName: "Andi Pratama",
            day: "Selasa",
            startTime: "13:00",
            endTime: "15:30",
            room: "Lab Komputer",
            active: true,
            createdAt: "2026-09-21T08:00:00.000Z"
        },

        {
            id: "schedule-demo-004",
            classId: "class-demo-002",
            subjectId: "subj-demo-004",
            teacherName: "Andi Pratama",
            day: "Kamis",
            startTime: "13:00",
            endTime: "15:00",
            room: "Lab Komputer",
            active: true,
            createdAt: "2026-09-21T08:05:00.000Z"
        }
    ],

    attendance: [
        {
            id: "att-demo-001",
            classId: "class-demo-001",
            studentId: "student-demo-001",
            date: "2026-11-02",
            status: "Hadir",
            note: "",
            recordedAt: "2026-11-02T08:10:00.000Z"
        },

        {
            id: "att-demo-002",
            classId: "class-demo-002",
            studentId: "student-demo-002",
            date: "2026-11-03",
            status: "Hadir",
            note: "",
            recordedAt: "2026-11-03T13:10:00.000Z"
        },

        {
            id: "att-demo-003",
            classId: "class-demo-001",
            studentId: "student-demo-001",
            date: "2026-11-04",
            status: "Izin",
            note: "Mengikuti kegiatan keluarga.",
            recordedAt: "2026-11-04T08:05:00.000Z"
        },

        {
            id: "att-demo-004",
            classId: "class-demo-002",
            studentId: "student-demo-002",
            date: "2026-11-05",
            status: "Hadir",
            note: "",
            recordedAt: "2026-11-05T13:05:00.000Z"
        }
    ],

    users: [
        {
            id: "user-demo-001",
            name: "Admin Demo",
            email: "admin@pkbm.test",
            role: "Admin",
            status: "active",
            createdAt: "2026-07-01T08:00:00.000Z"
        },

        {
            id: "user-demo-002",
            name: "Peserta Demo",
            email: "peserta@example.test",
            role: "Peserta",
            status: "active",
            createdAt: "2026-09-14T09:00:00.000Z"
        },

        {
            id: "user-demo-003",
            name: "Siswa Demo",
            email: "student@example.test",
            role: "Peserta",
            status: "active",
            createdAt: "2026-08-10T07:45:00.000Z"
        },

        {
            id: "user-demo-004",
            name: "Peserta Nonaktif",
            email: "nonaktif@example.test",
            role: "Peserta",
            status: "inactive",
            createdAt: "2026-06-12T10:00:00.000Z"
        }
    ],

    payments: [
        {
            id: "pay-reg-demo-001",
            registrationId: "reg-demo-001",
            email: "peserta@example.test",
            name: "Peserta Demo",
            programId: "prog-paket-c",
            programName: "Paket C",
            registrationFee: 100000,
            tuitionFee: 900000,
            amount: 1000000,
            status: "Belum dibayar",
            proof: "",
            submittedAt: "",
            rejectionReason: "",
            createdAt: "2026-10-20T09:30:00.000Z",
            updatedAt: "2026-10-20T09:30:00.000Z"
        },

        {
            id: "pay-reg-demo-002",
            registrationId: "reg-demo-002",
            email: "peserta@example.test",
            name: "Peserta Demo",
            programId: "prog-komputer",
            programName: "Komputer Dasar",
            registrationFee: 50000,
            tuitionFee: 500000,
            amount: 550000,
            status: "Lunas",
            proof: "bukti-transfer-demo.jpg",
            submittedAt: "2026-09-16T08:15:00.000Z",
            rejectionReason: "",
            createdAt: "2026-09-15T10:00:00.000Z",
            updatedAt: "2026-09-17T02:25:00.000Z"
        }
    ],

    announcements: [
        {
            id: "ann-demo-001",
            title: "Pendaftaran Semester Baru Dibuka",
            body:
                "Pendaftaran peserta didik untuk semester baru sudah dibuka. Silakan lengkapi data diri dan pilih program yang sesuai melalui portal peserta.",
            createdAt: "2026-10-28",
            updatedAt: "2026-10-28T08:00:00.000Z",
            active: true
        },

        {
            id: "ann-demo-002",
            title: "Jadwal Pelatihan Komputer Dasar",
            body:
                "Kelas Komputer Dasar reguler dimulai setiap hari Selasa pukul 13.00 di Lab Komputer. Peserta diharapkan hadir tepat waktu.",
            createdAt: "2026-10-30",
            updatedAt: "2026-10-30T09:30:00.000Z",
            active: true
        },

        {
            id: "ann-demo-003",
            title: "Pengumuman Internal (Arsip)",
            body:
                "Contoh pengumuman yang sudah tidak dipublikasikan. Admin dapat mengaktifkan kembali kapan saja.",
            createdAt: "2026-09-01",
            updatedAt: "2026-09-01T07:00:00.000Z",
            active: false
        }
    ],

    websiteContent: {
        siteName: "PKBM & LPK",

        tagline: "Pendidikan Kesetaraan & Pelatihan Kerja",

        heroTitle: "Belajar dan berkembang,",

        heroAccent: "tanpa batas.",

        heroDescription:
            "Layanan pendidikan kesetaraan dan pelatihan keterampilan untuk membantu setiap peserta meraih kesempatan yang lebih baik.",

        aboutTitle: "Pendidikan yang lebih mudah dijangkau.",

        aboutDescription:
            "PKBM menyediakan jalur pendidikan kesetaraan, sedangkan LPK berfokus pada peningkatan keterampilan untuk dunia kerja. Melalui platform ini, calon peserta dapat melihat program, melakukan pendaftaran, dan memantau status secara mandiri.",

        contactAddress: "Jl. Pendidikan No. 10, Bandung",

        contactPhone: "0812-3456-7890",

        contactEmail: "info@pkbm-lpk.test",

        contactHours: "Senin–Sabtu, 08.00–17.00",

        footerNote:
            "Platform informasi pendidikan kesetaraan dan pelatihan kerja."
    }
};
