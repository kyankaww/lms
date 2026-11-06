document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /*
    |--------------------------------------------------------------------------
    | HELPER
    |--------------------------------------------------------------------------
    */

  function getElement(id) {
    return document.getElementById(id);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };

      return entities[character];
    });
  }

  function showAlert(message, type = "info") {
    const alertArea = getElement("alertArea");

    if (!alertArea) return;

    const allowedTypes = [
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info",
      "light",
      "dark",
    ];

    if (!allowedTypes.includes(type)) {
      type = "info";
    }

    alertArea.innerHTML = `
            <div class="alert alert-${type} small py-2" role="alert">
                ${message}
            </div>
        `;
  }

  function setButtonLoading(button, loadingText, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = loadingText;
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
    }
  }

  function getStoredName() {
    if (window.Auth) {
      const user = window.Auth.getCurrentUser();

      if (user.name) {
        return user.name;
      }
    }

    return localStorage.getItem("registerName") || "Pengguna";
  }

  function getRedirectTarget(fallback) {
    if (window.Auth && typeof window.Auth.safeRedirect === "function") {
      return window.Auth.safeRedirect(fallback);
    }

    return fallback;
  }

  function getRedirectParam() {
    return new URLSearchParams(window.location.search).get("redirect");
  }

  function hasCompleteProfile() {
    if (window.Auth) {
      return window.Auth.hasCompleteProfile();
    }

    return localStorage.getItem("dataDiriLengkap") === "true";
  }

  function normalizeGender(value) {
    if (value === "L") {
      return "Laki-laki";
    }

    if (value === "P") {
      return "Perempuan";
    }

    return value || "";
  }

  function ensureUserRecord(name, email, options) {
    if (!window.DemoStorage) {
      return;
    }

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    const allData = window.DemoStorage.getAll();

    if (!Array.isArray(allData.users)) {
      allData.users = [];
    }

    const settings = options || {};
    const existing = allData.users.find(function (user) {
      return (
        String(user.email || "")
          .trim()
          .toLowerCase() === normalizedEmail
      );
    });

    if (existing) {
      existing.name = String(name || existing.name || "").trim();
      existing.status = settings.status || "active";

      if (settings.role) {
        existing.role = settings.role;
      }
    } else {
      allData.users.push({
        id: "user-" + Date.now(),
        name: String(name || "Pengguna").trim(),
        email: normalizedEmail,
        role: settings.role || "Peserta",
        status: settings.status || "active",
        createdAt: new Date().toISOString(),
      });
    }

    window.DemoStorage.saveAll(allData);
  }

  /*
    |--------------------------------------------------------------------------
    | TAHUN FOOTER
    |--------------------------------------------------------------------------
    */

  const yearElement = getElement("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /*
    |--------------------------------------------------------------------------
    | TAMPILKAN PROGRAM PADA LANDING PAGE
    |--------------------------------------------------------------------------
    */

  function renderProgramCards() {
    const container = getElement("programCards");

    if (!container || !window.DemoStorage) {
      return;
    }

    const programs = window.DemoStorage.getCollection("programs").filter(
      function (program) {
        return program.active === true;
      },
    );

    if (programs.length === 0) {
      container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-light border text-center">
                        Belum ada program aktif.
                    </div>
                </div>
            `;

      return;
    }

    container.innerHTML = programs
      .map(function (program) {
        const icon = program.category === "PKBM" ? "P" : "L";

        return `
                    <div class="col-md-6 col-lg-4">
                        <article class="program-card">
                            <div class="program-icon">
                                ${icon}
                            </div>

                            <div class="program-type">
                                ${escapeHTML(program.category)}
                                ·
                                ${escapeHTML(program.level)}
                            </div>

                            <h3 class="h4 fw-bold mt-2">
                                ${escapeHTML(program.name)}
                            </h3>

                            <p>
                                ${escapeHTML(program.description)}
                            </p>

                            <a
                                class="card-link"
                                href="pages/pendaftaran-program.html?program=${encodeURIComponent(program.id)}"
                            >
                                Pilih Program
                                <span aria-hidden="true">→</span>
                            </a>
                        </article>
                    </div>
                `;
      })
      .join("");
  }

  renderProgramCards();

  /*
    |--------------------------------------------------------------------------
    | KONTEN WEBSITE DINAMIS
    |--------------------------------------------------------------------------
    */

  function applyWebsiteContent() {
    if (!window.DemoStorage) {
      return;
    }

    const content = window.DemoStorage.getAll().websiteContent || {};

    const fields = [
      ["heroTitle", content.heroTitle],
      ["heroAccent", content.heroAccent],
      ["heroDescription", content.heroDescription],
      ["aboutTitle", content.aboutTitle],
      ["aboutDescription", content.aboutDescription],
      ["contactAddress", content.contactAddress],
      ["contactPhone", content.contactPhone],
      ["contactEmail", content.contactEmail],
      ["contactHours", content.contactHours],
      ["footerNote", content.footerNote],
    ];

    fields.forEach(function (entry) {
      const element = getElement(entry[0]);

      if (element && entry[1]) {
        element.textContent = entry[1];
      }
    });
  }

  applyWebsiteContent();

  /*
    |--------------------------------------------------------------------------
    | PENGUMUMAN PUBLIK
    |--------------------------------------------------------------------------
    */

  function renderAnnouncements() {
    const section = getElement("pengumuman");
    const container = getElement("announcementList");

    if (!section || !container || !window.DemoStorage) {
      return;
    }

    const announcements = window.DemoStorage.getCollection("announcements")
      .filter(function (announcement) {
        return announcement.active !== false;
      })
      .sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 3);

    section.classList.toggle("d-none", announcements.length === 0);
    container.replaceChildren();

    announcements.forEach(function (announcement) {
      const column = document.createElement("div");
      column.className = "col-md-6 col-lg-4";

      const card = document.createElement("article");
      card.className = "announcement-card";

      const date = document.createElement("p");
      date.className = "announcement-date";
      date.textContent = new Date(announcement.createdAt).toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      );

      const title = document.createElement("h3");
      title.className = "h5 fw-bold mt-2";
      title.textContent = announcement.title || "Pengumuman";

      const body = document.createElement("p");
      body.className = "text-secondary mb-0";
      body.textContent = announcement.body || "";

      card.append(date, title, body);
      column.appendChild(card);
      container.appendChild(column);
    });
  }

  renderAnnouncements();

  function refreshPublicContent() {
    applyWebsiteContent();
    renderAnnouncements();
    renderProgramCards();
  }

  window.addEventListener("demo-data-updated", refreshPublicContent);
  window.addEventListener("storage", refreshPublicContent);

  /*
    |--------------------------------------------------------------------------
    | PERTAHANKAN PARAMETER REDIRECT PADA TAUTAN AUTH
    |--------------------------------------------------------------------------
    */

  (function preserveRedirectLinks() {
    const redirect = getRedirectParam();

    if (!redirect || document.body.hasAttribute("data-page-access")) {
      return;
    }

    document
      .querySelectorAll('a[href="registration.html"], a[href="login.html"]')
      .forEach(function (link) {
        if (link.getAttribute("href").includes("redirect=")) {
          return;
        }

        link.href =
          link.getAttribute("href") +
          "?redirect=" +
          encodeURIComponent(redirect);
      });
  })();

  /*
    |--------------------------------------------------------------------------
    | NAVIGASI MOBILE
    |--------------------------------------------------------------------------
    */

  document
    .querySelectorAll('.navbar .nav-link[href^="#"]')
    .forEach(function (link) {
      link.addEventListener("click", function () {
        const nav = getElement("mainNav");

        if (nav && nav.classList.contains("show") && window.bootstrap) {
          window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
        }
      });
    });

  /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

  const registerForm = getElement("registerForm");

  if (registerForm) {
    const passwordInput = getElement("password");
    const confirmPasswordInput = getElement("confirmPassword");

    if (passwordInput && confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", function () {
        this.setCustomValidity(
          passwordInput.value !== this.value
            ? "Konfirmasi password tidak cocok."
            : "",
        );
      });

      passwordInput.addEventListener("input", function () {
        confirmPasswordInput.setCustomValidity(
          passwordInput.value !== confirmPasswordInput.value
            ? "Konfirmasi password tidak cocok."
            : "",
        );
      });
    }

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.setCustomValidity(
          passwordInput.value !== confirmPasswordInput.value
            ? "Konfirmasi password tidak cocok."
            : "",
        );
      }

      if (!this.checkValidity()) {
        this.classList.add("was-validated");
        return;
      }

      const button = getElement("btnSubmit");
      const emailInput = getElement("email");
      const nameInput = getElement("fullName");

      if (!emailInput || !nameInput || !passwordInput) {
        showAlert(
          "Formulir belum lengkap. Periksa kembali elemen HTML.",
          "danger",
        );
        return;
      }

      setButtonLoading(button, "Memproses...", true);

      const email = emailInput.value.trim();
      const name = nameInput.value.trim();

      // OTP simulasi untuk pengembangan frontend.
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      localStorage.setItem("registerEmail", email);
      localStorage.setItem("registerName", name);
      localStorage.setItem("otpCode", otp);

      // Daftarkan akun pada direktori pengguna agar bisa dikelola admin.
      ensureUserRecord(name, email, { role: "Peserta", status: "active" });

      // Status verifikasi direset ketika melakukan pendaftaran baru.
      localStorage.removeItem("emailVerified");

      // Profil milik akun sebelumnya tidak boleh diwarisi akun baru.
      if (window.Auth) {
        window.Auth.resetProfileComplete();
      }

      showAlert(
        `Kode verifikasi: <strong>${otp}</strong> (simulasi frontend).`,
        "info",
      );

      const redirect = getRedirectParam();
      const nextUrl = redirect
        ? "verifikasi.html?redirect=" + encodeURIComponent(redirect)
        : "verifikasi.html";

      setTimeout(function () {
        window.location.href = nextUrl;
      }, 3000);
    });
  }

  /*
    |--------------------------------------------------------------------------
    | VERIFIKASI EMAIL
    |--------------------------------------------------------------------------
    */

  const otpForm = getElement("otpForm");

  if (otpForm) {
    const emailDisplay = getElement("emailDisplay");
    const otpInput = getElement("otpCode");
    const timerElement = getElement("timer");
    const countdownArea = getElement("countdownArea");
    const resendButton = getElement("btnResend");
    const verifyButton = getElement("btnVerify");

    const email = localStorage.getItem("registerEmail") || "email@contoh.com";

    if (emailDisplay) {
      emailDisplay.textContent = email;
    }

    // Input OTP hanya menerima angka.
    if (otpInput) {
      otpInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 6);
      });
    }

    let timeLeft = 60;
    let countdownInterval = null;

    function startCountdown() {
      if (!timerElement || !countdownArea || !resendButton) {
        return;
      }

      if (countdownInterval !== null) {
        clearInterval(countdownInterval);
      }

      timeLeft = 60;

      timerElement.textContent = timeLeft;
      countdownArea.classList.remove("d-none");
      resendButton.classList.add("d-none");

      countdownInterval = setInterval(function () {
        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          countdownInterval = null;

          countdownArea.classList.add("d-none");
          resendButton.classList.remove("d-none");
        }
      }, 1000);
    }

    startCountdown();

    // Kirim ulang OTP.
    if (resendButton) {
      resendButton.addEventListener("click", function () {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        localStorage.setItem("otpCode", newOtp);

        if (otpInput) {
          otpInput.value = "";
        }

        showAlert(
          `Kode baru: <strong>${newOtp}</strong> (simulasi frontend).`,
          "info",
        );

        startCountdown();
      });
    }

    // Verifikasi OTP.
    otpForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!otpInput) {
        showAlert("Input kode verifikasi tidak ditemukan.", "danger");
        return;
      }

      const enteredOtp = otpInput.value.trim();

      if (!/^\d{6}$/.test(enteredOtp)) {
        this.classList.add("was-validated");

        showAlert(
          "Masukkan kode verifikasi yang terdiri dari 6 angka.",
          "warning",
        );

        return;
      }

      const storedOtp = localStorage.getItem("otpCode");

      if (!storedOtp) {
        showAlert(
          "Kode verifikasi tidak ditemukan. Silakan daftar kembali.",
          "danger",
        );
        return;
      }

      setButtonLoading(verifyButton, "Memverifikasi...", true);

      setTimeout(function () {
        if (enteredOtp === storedOtp) {
          localStorage.setItem("emailVerified", "true");

          if (countdownInterval !== null) {
            clearInterval(countdownInterval);
          }

          showAlert(
            "Verifikasi berhasil! Mengalihkan ke halaman login...",
            "success",
          );

          const redirect = getRedirectParam();
          const nextUrl = redirect
            ? "login.html?redirect=" + encodeURIComponent(redirect)
            : "login.html";

          setTimeout(function () {
            window.location.href = nextUrl;
          }, 1500);
        } else {
          showAlert("Kode verifikasi salah. Silakan coba lagi.", "danger");

          otpInput.value = "";
          otpInput.focus();

          setButtonLoading(verifyButton, "", false);
        }
      }, 500);
    });
  }

  /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

  const loginForm = getElement("loginForm");

  if (loginForm) {
    const verifiedBadge = getElement("verifiedBadge");
    const verifiedEmail = getElement("verifiedEmail");
    const loginEmail = getElement("email");

    const registeredEmail = localStorage.getItem("registerEmail");
    const emailVerified = localStorage.getItem("emailVerified");
    const loginParams = new URLSearchParams(window.location.search);

    if (loginParams.get("inactive") === "1") {
      showAlert(
        "Akun ini dinonaktifkan oleh admin. Hubungi pengelola untuk bantuan.",
        "warning",
      );
    }

    if (emailVerified === "true" && registeredEmail) {
      if (verifiedBadge) {
        verifiedBadge.classList.remove("d-none");
      }

      if (verifiedEmail) {
        verifiedEmail.textContent = registeredEmail;
      }

      if (loginEmail) {
        loginEmail.value = registeredEmail;
      }
    }

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!this.checkValidity()) {
        this.classList.add("was-validated");
        return;
      }

      const button = getElement("btnLogin");
      const emailInput = getElement("email");

      if (!emailInput) {
        showAlert("Kolom email tidak ditemukan.", "danger");
        return;
      }

      const email = emailInput.value.trim();
      const normalizedEmail = email.toLowerCase();
      const normalizedRegistered = (registeredEmail || "")
        .trim()
        .toLowerCase();

      // Simulasi login: belum menggunakan backend atau autentikasi nyata.
      if (registeredEmail && normalizedEmail !== normalizedRegistered) {
        showAlert(
          "Email tidak sesuai dengan akun demo yang terdaftar.",
          "danger",
        );
        return;
      }

      if (registeredEmail && emailVerified !== "true") {
        showAlert(
          "Email belum diverifikasi. Selesaikan verifikasi terlebih dahulu.",
          "warning",
        );
        return;
      }

      if (window.Auth && !window.Auth.isUserActive(email)) {
        showAlert(
          "Akun ini dinonaktifkan oleh admin. Hubungi pengelola untuk bantuan.",
          "danger",
        );
        return;
      }

      setButtonLoading(button, "Memproses...", true);

      setTimeout(function () {
        if (window.Auth) {
          window.Auth.loginUser(email, getStoredName());
        } else {
          localStorage.setItem("demoLoggedIn", "true");
        }

        showAlert(
          `Login berhasil! Selamat datang, <strong>${escapeHTML(getStoredName())}</strong>.`,
          "success",
        );

        window.location.href = getRedirectTarget("dashboard.html");
      }, 800);
    });
  }

  /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

  const userNameElement = getElement("userName");

  if (userNameElement) {
    userNameElement.textContent = getStoredName();
  }

  const alertDataLengkap = getElement("alertDataLengkap");
  const alertDataDiri = getElement("alertDataDiri");
  const packageButtons = document.querySelectorAll(".btn-paket");

  if (alertDataLengkap || alertDataDiri || packageButtons.length > 0) {
    const dataLengkap = hasCompleteProfile();

    if (dataLengkap) {
      if (alertDataLengkap) {
        alertDataLengkap.classList.remove("d-none");
      }

      if (alertDataDiri) {
        alertDataDiri.classList.add("d-none");
      }

      packageButtons.forEach(function (button) {
        button.disabled = false;
      });
    } else {
      if (alertDataDiri) {
        alertDataDiri.classList.remove("d-none");
      }

      if (alertDataLengkap) {
        alertDataLengkap.classList.add("d-none");
      }

      packageButtons.forEach(function (button) {
        button.disabled = true;
      });
    }
  }

  // Pilih paket pembelajaran.
  packageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const programId = this.getAttribute("data-program-id");

      if (!programId) {
        console.error("ID program tidak ditemukan pada tombol.");
        return;
      }

      // Pastikan data diri sudah lengkap.
      if (!hasCompleteProfile()) {
        if (alertDataDiri) {
          alertDataDiri.classList.remove("d-none");
        }

        if (alertDataLengkap) {
          alertDataLengkap.classList.add("d-none");
        }

        return;
      }

      // Pastikan program tersedia.
      const programs = window.DemoStorage.getCollection("programs");

      const selectedProgram = programs.find(function (program) {
        return program.id === programId && program.active !== false;
      });

      if (!selectedProgram) {
        console.error("Program tidak ditemukan:", programId);
        showAlert(
          "Program tidak ditemukan atau sedang tidak tersedia.",
          "danger",
        );
        return;
      }

      // Simpan pilihan program.
      localStorage.setItem("paketDipilih", selectedProgram.id);

      // Buka halaman pendaftaran dengan program yang dipilih.
      window.location.href =
        "pendaftaran-program.html?program=" +
        encodeURIComponent(selectedProgram.id);
    });
  });

  /*
|--------------------------------------------------------------------------
| RIWAYAT PENDAFTARAN PESERTA DIDIK
|--------------------------------------------------------------------------
*/

  const historyContainer = getElement("daftarRiwayatPendaftaran");
  const emptyHistory = getElement("riwayatKosong");
  const historyCount = getElement("jumlahPendaftaran");

  if (historyContainer && emptyHistory && historyCount) {
    function renderRegistrationHistory() {
      // Email akun yang sedang login.
      const currentEmail = (localStorage.getItem("registerEmail") || "")
        .trim()
        .toLowerCase();

      // Ambil data pendaftaran.
      const registrations = window.DemoStorage.getCollection("registrations");

      // Hanya tampilkan pendaftaran milik akun yang sedang login.
      const myRegistrations = registrations
        .filter(function (registration) {
          return (
            registration.email &&
            registration.email.trim().toLowerCase() === currentEmail
          );
        })
        .sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

      historyContainer.replaceChildren();

      emptyHistory.classList.toggle("d-none", myRegistrations.length > 0);

      historyCount.textContent = myRegistrations.length + " pendaftaran";

      myRegistrations.forEach(function (registration) {
        const column = document.createElement("div");
        column.className = "col-12";

        const card = document.createElement("div");
        card.className = "card shadow-sm border-0 h-100";

        const body = document.createElement("div");
        body.className = "card-body";

        const header = document.createElement("div");
        header.className =
          "d-flex flex-column flex-md-row justify-content-between gap-3";

        const information = document.createElement("div");

        const title = document.createElement("h6");
        title.className = "fw-bold mb-1";
        title.textContent = registration.programName || "Program";

        const category = document.createElement("p");
        category.className = "text-muted small mb-2";
        category.textContent = registration.category || "-";

        const date = document.createElement("p");
        date.className = "text-muted small mb-0";

        const createdAt = new Date(registration.createdAt);

        date.textContent =
          "Tanggal pendaftaran: " +
          (Number.isNaN(createdAt.getTime())
            ? "-"
            : createdAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }));

        information.append(title, category, date);

        const statuses = document.createElement("div");
        statuses.className = "d-flex flex-column align-items-md-end gap-2";

        const registrationStatus = document.createElement("span");
        registrationStatus.className = "badge rounded-pill text-bg-warning";
        registrationStatus.textContent =
          "Pendaftaran: " + (registration.status || "Belum diketahui");

        const paymentStatus = document.createElement("span");
        paymentStatus.className =
          "badge rounded-pill text-bg-light border text-dark";
        paymentStatus.textContent =
          "Pembayaran: " + (registration.paymentStatus || "Belum diketahui");

        statuses.append(registrationStatus, paymentStatus);
        header.append(information, statuses);
        body.appendChild(header);

        const actions = document.createElement("div");
        actions.className = "d-flex flex-wrap gap-2 mt-3";

        const detailLink = document.createElement("a");
        detailLink.className = "btn btn-outline-primary btn-sm";
        detailLink.href =
          "detail-pendaftaran.html?id=" +
          encodeURIComponent(registration.id);
        detailLink.textContent = "Lihat Detail";

        const paymentLink = document.createElement("a");
        paymentLink.className = "btn btn-primary btn-sm";
        paymentLink.href =
          "pembayaran.html?id=" + encodeURIComponent(registration.id);
        paymentLink.textContent =
          registration.paymentStatus === "Lunas"
            ? "Lihat Pembayaran"
            : "Bayar / Konfirmasi";

        actions.append(detailLink, paymentLink);
        body.appendChild(actions);

        card.appendChild(body);
        column.appendChild(card);

        historyContainer.appendChild(column);
      });
    }

    renderRegistrationHistory();

    // Perbarui riwayat jika data berubah selama halaman terbuka.
    window.addEventListener("demo-data-updated", renderRegistrationHistory);
  }

  /*
    |--------------------------------------------------------------------------
    | PENGISIAN DATA DIRI
    |--------------------------------------------------------------------------
    */

  const dataDiriForm = getElement("dataDiriForm");

  if (dataDiriForm) {
    const fileFields = [
      { id: "fileKTP", key: "ktp" },
      { id: "fileKK", key: "kk" },
      { id: "fileIjazah", key: "ijazah" },
      { id: "fileFoto", key: "foto" },
    ];

    const profile = window.Auth ? window.Auth.getProfile() : null;
    const existingDocuments =
      profile && profile.documents ? profile.documents : {};

    // Isi ulang formulir jika profil sudah pernah disimpan.
    if (profile) {
      [
        "namaLengkap",
        "nik",
        "noKK",
        "tempatLahir",
        "tanggalLahir",
        "jenisKelamin",
        "agama",
        "noHP",
        "alamat",
        "pendidikanTerakhir",
        "tahunLulus",
        "namaSekolah",
      ].forEach(function (id) {
        const input = getElement(id);

        if (input && profile[id]) {
          input.value = profile[id];
        }
      });
    }

    const nameInput = getElement("namaLengkap");

    if (nameInput && !nameInput.value) {
      nameInput.value = getStoredName();
    }

    // NIK dan nomor KK hanya menerima angka.
    ["nik", "noKK"].forEach(function (id) {
      const input = getElement(id);

      if (!input) {
        return;
      }

      input.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 16);
      });
    });

    // Tampilkan dokumen yang sudah tersimpan sebelumnya.
    fileFields.forEach(function (field) {
      const input = getElement(field.id);
      const fileName = existingDocuments[field.key];

      if (!input || !fileName) {
        return;
      }

      const noteId = "existing-" + field.id;
      let note = getElement(noteId);

      if (!note) {
        note = document.createElement("div");
        note.id = noteId;
        note.className = "form-text";
        input.insertAdjacentElement("afterend", note);
      }

      note.textContent =
        "File saat ini: " +
        fileName +
        " (pilih file baru jika ingin mengganti)";
    });

    // Validasi ukuran file maksimal 2 MB.
    function validateFileSize(input) {
      if (!input) {
        return true;
      }

      if (
        input.files &&
        input.files.length > 0 &&
        input.files[0].size > 2 * 1024 * 1024
      ) {
        input.setCustomValidity("Ukuran file maksimal 2 MB.");

        return false;
      }

      input.setCustomValidity("");
      return true;
    }

    function validateDocument(input, existingName) {
      if (!input) {
        return true;
      }

      if (!validateFileSize(input)) {
        return false;
      }

      if (
        (!input.files || input.files.length === 0) &&
        !existingName
      ) {
        input.setCustomValidity("Dokumen wajib diunggah.");
        return false;
      }

      input.setCustomValidity("");
      return true;
    }

    fileFields.forEach(function (field) {
      const input = getElement(field.id);

      if (!input) {
        return;
      }

      input.addEventListener("change", function () {
        validateDocument(this, existingDocuments[field.key]);
      });
    });

    dataDiriForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nikInput = getElement("nik");
      const kkInput = getElement("noKK");

      if (nikInput) {
        nikInput.setCustomValidity(
          nikInput.value.length !== 16
            ? "NIK harus terdiri dari 16 digit."
            : "",
        );
      }

      if (kkInput) {
        kkInput.setCustomValidity(
          kkInput.value.length !== 16
            ? "Nomor KK harus terdiri dari 16 digit."
            : "",
        );
      }

      fileFields.forEach(function (field) {
        validateDocument(
          getElement(field.id),
          existingDocuments[field.key],
        );
      });

      if (!this.checkValidity()) {
        this.classList.add("was-validated");

        const firstInvalid = this.querySelector(":invalid");

        if (firstInvalid) {
          firstInvalid.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        return;
      }

      const button = getElement("btnSimpan");

      setButtonLoading(button, "Menyimpan...", true);

      setTimeout(function () {
        const allData = window.DemoStorage.getAll();

        if (!Array.isArray(allData.profiles)) {
          allData.profiles = [];
        }

        const email = window.Auth
          ? window.Auth.getCurrentUser().email
          : (localStorage.getItem("registerEmail") || "")
              .trim()
              .toLowerCase();

        const documents = Object.assign({}, existingDocuments);

        fileFields.forEach(function (field) {
          const input = getElement(field.id);

          if (input && input.files && input.files.length > 0) {
            documents[field.key] = input.files[0].name;
          }
        });

        const profileData = {
          email: email,
          namaLengkap: (getElement("namaLengkap") || {}).value || "",
          nik: (getElement("nik") || {}).value || "",
          noKK: (getElement("noKK") || {}).value || "",
          tempatLahir: (getElement("tempatLahir") || {}).value || "",
          tanggalLahir: (getElement("tanggalLahir") || {}).value || "",
          jenisKelamin: (getElement("jenisKelamin") || {}).value || "",
          agama: (getElement("agama") || {}).value || "",
          noHP: (getElement("noHP") || {}).value || "",
          alamat: (getElement("alamat") || {}).value || "",
          pendidikanTerakhir:
            (getElement("pendidikanTerakhir") || {}).value || "",
          tahunLulus: (getElement("tahunLulus") || {}).value || "",
          namaSekolah: (getElement("namaSekolah") || {}).value || "",
          documents: documents,
          complete: true,
          updatedAt: new Date().toISOString(),
        };

        const profileIndex = allData.profiles.findIndex(function (item) {
          return (
            String(item.email || "").trim().toLowerCase() === email
          );
        });

        if (profileIndex >= 0) {
          Object.assign(allData.profiles[profileIndex], profileData);
        } else {
          allData.profiles.push(profileData);
        }

        // Sinkronkan nama terbaru ke direktori pengguna.
        (allData.users || []).forEach(function (user) {
          if (
            String(user.email || "")
              .trim()
              .toLowerCase() === email
          ) {
            user.name = profileData.namaLengkap;
          }
        });

        // Sinkronkan profil terbaru ke data siswa yang sudah ada.
        (allData.students || []).forEach(function (student) {
          if (
            String(student.email || "").trim().toLowerCase() !== email
          ) {
            return;
          }

          student.fullName = profileData.namaLengkap;
          student.name = profileData.namaLengkap;
          student.nik = profileData.nik;
          student.familyCardNumber = profileData.noKK;
          student.birthPlace = profileData.tempatLahir;
          student.birthDate = profileData.tanggalLahir;
          student.gender = normalizeGender(profileData.jenisKelamin);
          student.religion = profileData.agama;
          student.phone = profileData.noHP;
          student.address = profileData.alamat;
          student.educationLevel = profileData.pendidikanTerakhir;
          student.graduationYear = profileData.tahunLulus;
          student.schoolName = profileData.namaSekolah;
          student.documents = Object.assign(
            {},
            student.documents || {},
            documents,
          );
        });

        window.DemoStorage.saveAll(allData);

        if (window.Auth) {
          window.Auth.markProfileComplete(email);
        } else {
          localStorage.setItem("dataDiriLengkap", "true");
        }

        showAlert(
          "Data diri berhasil disimpan! Mengalihkan...",
          "success",
        );

        setTimeout(function () {
          window.location.href = getRedirectTarget("dashboard.html");
        }, 1200);
      }, 500);
    });
  }
});
