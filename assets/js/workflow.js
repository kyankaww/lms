/*
|--------------------------------------------------------------------------
| ALUR DATA & RELASI SISTEM (WORKFLOW)
|--------------------------------------------------------------------------
| Menghubungkan semua data antara User (portal /pages) dan Admin (/pages/admin):
| - Pendaftaran <-> Profil <-> Siswa <-> Kelas <-> Jadwal <-> Absensi <-> Pembayaran
| - Konten & Pengumuman yang dibuat Admin langsung tersedia untuk User
*/

(function () {
    "use strict";

    function normalizeEmail(value) {
        return String(value || "").trim().toLowerCase();
    }

    function nowIso() {
        return new Date().toISOString();
    }

    function numberOrZero(value) {
        var number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }

    function normalizeGender(value) {
        if (value === "L" || value === "Laki-laki") {
            return "Laki-laki";
        }
        if (value === "P" || value === "Perempuan") {
            return "Perempuan";
        }
        return value || "";
    }

    function getProgram(allData, programId) {
        return (allData.programs || []).find(function (program) {
            return program.id === programId;
        }) || null;
    }

    function getProfile(allData, email) {
        var normalized = normalizeEmail(email);
        return (allData.profiles || []).find(function (profile) {
            return normalizeEmail(profile.email) === normalized;
        }) || null;
    }

    function getRegistrationAmount(registration, program) {
        var registrationFee = numberOrZero(registration.registrationFee);
        var tuitionFee = numberOrZero(registration.tuitionFee);

        if (
            registrationFee > 0 ||
            tuitionFee > 0 ||
            Number(registration.totalAmount) >= 0
        ) {
            if (Number.isFinite(Number(registration.totalAmount))) {
                return Number(registration.totalAmount);
            }
            return registrationFee + tuitionFee;
        }

        return (
            numberOrZero(program && program.registrationFee) +
            numberOrZero(program && program.tuitionFee)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PEMBAYARAN
    |--------------------------------------------------------------------------
    */

    function ensurePaymentRecord(allData, registration) {
        if (!registration) {
            return null;
        }

        if (!Array.isArray(allData.payments)) {
            allData.payments = [];
        }

        var program = getProgram(allData, registration.programId);
        var paymentId = "pay-" + registration.id;

        var payment = allData.payments.find(function (item) {
            return item.registrationId === registration.id;
        });

        var amount = getRegistrationAmount(registration, program);

        if (!payment) {
            payment = {
                id: paymentId,
                registrationId: registration.id,
                createdAt: registration.createdAt || nowIso()
            };
            allData.payments.push(payment);
        }

        payment.email = normalizeEmail(registration.email);
        payment.name = registration.name || "";
        payment.programId = registration.programId || "";
        payment.programName = registration.programName || (program ? program.name : "");
        payment.category = registration.category || (program ? program.category : "");
        payment.registrationFee = numberOrZero(registration.registrationFee || (program && program.registrationFee));
        payment.tuitionFee = numberOrZero(registration.tuitionFee || (program && program.tuitionFee));
        payment.amount = amount;
        payment.status = registration.paymentStatus || "Belum dibayar";
        payment.proof = registration.paymentProof || "";
        payment.submittedAt = registration.paymentSubmittedAt || "";
        payment.rejectionReason = registration.paymentRejectionReason || "";
        payment.updatedAt = nowIso();

        return payment;
    }

    function setPaymentStatus(allData, registrationId, status, meta) {
        meta = meta || {};

        var registration = (allData.registrations || []).find(function (item) {
            return item.id === registrationId;
        });

        if (!registration) {
            return null;
        }

        var previousStatus = registration.paymentStatus || "Belum dibayar";

        if (previousStatus !== status) {
            if (!Array.isArray(registration.statusHistory)) {
                registration.statusHistory = [];
            }

            registration.statusHistory.push({
                type: "payment",
                from: previousStatus,
                to: status,
                changedAt: nowIso(),
                note: meta.note || ""
            });
        }

        registration.paymentStatus = status;

        if (meta.proof !== undefined) {
            registration.paymentProof = meta.proof;
        }

        if (meta.submittedAt !== undefined) {
            registration.paymentSubmittedAt = meta.submittedAt;
        }

        if (status === "Lunas") {
            registration.paymentRejectionReason = "";
        } else if (meta.reason) {
            registration.paymentRejectionReason = meta.reason;
        }

        ensurePaymentRecord(allData, registration);

        return registration;
    }

    function submitPaymentProof(allData, registrationId, fileName) {
        var submittedAt = nowIso();

        return setPaymentStatus(allData, registrationId, "Menunggu konfirmasi", {
            proof: fileName,
            submittedAt: submittedAt,
            note: "Bukti pembayaran diunggah peserta."
        });
    }

    /*
    |--------------------------------------------------------------------------
    | SISWA & KELAS
    |--------------------------------------------------------------------------
    */

    function generateStudentNumber(allData) {
        var used = {};

        (allData.students || []).forEach(function (student) {
            if (student.studentNumber) {
                used[student.studentNumber] = true;
            }
        });

        var sequence = (allData.students || []).length + 1;
        var number = "STD-" + String(sequence).padStart(4, "0");

        while (used[number]) {
            sequence += 1;
            number = "STD-" + String(sequence).padStart(4, "0");
        }

        return number;
    }

    function ensureStudentFromRegistration(allData, registration, classId) {
        if (!registration || !registration.email) {
            return null;
        }

        if (!Array.isArray(allData.students)) {
            allData.students = [];
        }

        var email = normalizeEmail(registration.email);

        var existing = allData.students.find(function (student) {
            return (
                normalizeEmail(student.email) === email &&
                student.programId === registration.programId
            );
        });

        var profile = getProfile(allData, email) || {};

        if (existing) {
            existing.registrationId = registration.id;
            existing.programId = existing.programId || registration.programId;
            existing.name = existing.name || registration.name || "";
            existing.fullName = existing.fullName || existing.name;
            existing.status = existing.status || "active";
            if (classId) {
                existing.classId = classId;
            }

            registration.studentId = existing.id;
            return existing;
        }

        var fullName =
            profile.namaLengkap ||
            registration.name ||
            "Peserta Baru";

        var student = {
            id: "student-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            studentNumber: generateStudentNumber(allData),
            fullName: fullName,
            name: fullName,
            email: email,
            nik: profile.nik || "",
            familyCardNumber: profile.noKK || "",
            birthPlace: profile.tempatLahir || "",
            birthDate: profile.tanggalLahir || "",
            gender: normalizeGender(profile.jenisKelamin),
            religion: profile.agama || "",
            phone: profile.noHP || "",
            address: profile.alamat || "",
            educationLevel: profile.pendidikanTerakhir || "",
            graduationYear: profile.tahunLulus || "",
            schoolName: profile.namaSekolah || "",
            documents: profile.documents || {},
            programId: registration.programId || "",
            classId: classId || "",
            registrationId: registration.id,
            status: "active",
            createdAt: nowIso()
        };

        allData.students.push(student);
        registration.studentId = student.id;

        return student;
    }

    function acceptRegistration(allData, registration, classId) {
        var student = ensureStudentFromRegistration(allData, registration, classId);
        var payment = ensurePaymentRecord(allData, registration);

        return {
            student: student,
            payment: payment
        };
    }

    /*
    |--------------------------------------------------------------------------
    | PENGAMBILAN DATA AKADEMIK UNTUK USER (PORTAL SISWA)
    |--------------------------------------------------------------------------
    */

    function getStudentByEmail(allData, email) {
        var normalized = normalizeEmail(email);
        if (!normalized) return null;

        var students = allData.students || [];
        return students.find(function (s) {
            return normalizeEmail(s.email) === normalized && s.status === "active";
        }) || students.find(function (s) {
            return normalizeEmail(s.email) === normalized;
        }) || null;
    }

    function getClassById(allData, classId) {
        if (!classId) return null;
        return (allData.classes || []).find(function (c) {
            return c.id === classId;
        }) || null;
    }

    function getSchedulesForStudent(allData, student) {
        if (!student) return [];

        var schedules = allData.schedules || [];
        var subjects = allData.subjects || [];
        var teachers = allData.teachers || [];
        var classes = allData.classes || [];

        return schedules
            .filter(function (sch) {
                if (student.classId && sch.classId === student.classId) {
                    return true;
                }
                // Jika siswa belum punya classId, cocokkan berdasarkan program
                if (!student.classId && student.programId) {
                    var cls = classes.find(function (c) { return c.id === sch.classId; });
                    return cls && cls.programId === student.programId;
                }
                return false;
            })
            .map(function (sch) {
                var subj = subjects.find(function (s) { return s.id === sch.subjectId; });
                var cls = classes.find(function (c) { return c.id === sch.classId; });
                var tch = teachers.find(function (t) { return t.id === sch.teacherId; });

                return {
                    id: sch.id,
                    day: sch.day || "Senin",
                    startTime: sch.startTime || "",
                    endTime: sch.endTime || "",
                    subjectName: subj ? subj.name : (sch.subjectName || "Mata Pelajaran"),
                    className: cls ? cls.name : (sch.className || "-"),
                    teacherName: tch ? tch.name : (sch.teacherName || "-"),
                    room: sch.room || sch.location || "Ruang Kelas",
                    deliveryMethod: sch.deliveryMethod || "OFFLINE"
                };
            });
    }

    function getAttendanceForStudent(allData, student) {
        if (!student) {
            return {
                summary: { present: 0, sick: 0, excused: 0, absent: 0, total: 0 },
                records: []
            };
        }

        var attendanceList = allData.attendance || [];
        var subjects = allData.subjects || [];

        var studentRecords = attendanceList
            .filter(function (att) {
                return att.studentId === student.id || att.studentId === student.studentNumber;
            })
            .sort(function (a, b) {
                return new Date(b.date || b.attendanceDate) - new Date(a.date || a.attendanceDate);
            })
            .map(function (att) {
                var subj = subjects.find(function (s) { return s.id === att.subjectId; });
                var status = att.status || "PRESENT";

                var statusLabel = "Hadir";
                var statusClass = "success";
                if (status === "SICK" || status === "Sakit") {
                    statusLabel = "Sakit";
                    statusClass = "warning";
                } else if (status === "EXCUSED" || status === "Izin") {
                    statusLabel = "Izin";
                    statusClass = "info";
                } else if (status === "ABSENT" || status === "Alfa" || status === "Alpa") {
                    statusLabel = "Alfa";
                    statusClass = "danger";
                }

                return {
                    id: att.id,
                    date: att.date || att.attendanceDate || "",
                    subjectName: subj ? subj.name : (att.subjectName || "Mata Pelajaran"),
                    status: statusLabel,
                    statusClass: statusClass,
                    note: att.notes || att.note || "-"
                };
            });

        var summary = {
            present: studentRecords.filter(function (r) { return r.status === "Hadir"; }).length,
            sick: studentRecords.filter(function (r) { return r.status === "Sakit"; }).length,
            excused: studentRecords.filter(function (r) { return r.status === "Izin"; }).length,
            absent: studentRecords.filter(function (r) { return r.status === "Alfa"; }).length,
            total: studentRecords.length
        };

        return {
            summary: summary,
            records: studentRecords
        };
    }

    function getAnnouncementsForUser(allData, student) {
        var announcements = (allData.announcements || []).filter(function (item) {
            return item.active !== false && item.isPublished !== false && !item.isArchived;
        });

        return announcements
            .filter(function (ann) {
                var target = ann.targetType || ann.target || "ALL";
                if (target === "ALL" || target === "Semua") return true;
                if (!student) return target === "PUBLIC" || target === "ALL";

                if (target === "STUDENTS" || target === "Peserta") return true;
                if (target === "PROGRAM" && ann.targetId && ann.targetId === student.programId) return true;
                if (target === "CLASS" && ann.targetId && ann.targetId === student.classId) return true;
                return false;
            })
            .sort(function (a, b) {
                return new Date(b.createdAt || b.publishDate) - new Date(a.createdAt || a.publishDate);
            });
    }

    function getWebsiteContent(allData) {
        var seedContent = (window.DEMO_SEED && window.DEMO_SEED.websiteContent) || {};
        var savedContent = allData.websiteContent || {};
        return Object.assign({}, seedContent, savedContent);
    }

    window.Workflow = {
        normalizeEmail: normalizeEmail,
        getProgram: getProgram,
        getProfile: getProfile,
        getRegistrationAmount: getRegistrationAmount,
        ensurePaymentRecord: ensurePaymentRecord,
        setPaymentStatus: setPaymentStatus,
        submitPaymentProof: submitPaymentProof,
        ensureStudentFromRegistration: ensureStudentFromRegistration,
        acceptRegistration: acceptRegistration,
        getStudentByEmail: getStudentByEmail,
        getClassById: getClassById,
        getSchedulesForStudent: getSchedulesForStudent,
        getAttendanceForStudent: getAttendanceForStudent,
        getAnnouncementsForUser: getAnnouncementsForUser,
        getWebsiteContent: getWebsiteContent
    };
})();
