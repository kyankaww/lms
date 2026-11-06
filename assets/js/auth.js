/*
|--------------------------------------------------------------------------
| SESI & OTORISASI (DEMO FRONTEND)
|--------------------------------------------------------------------------
| Modul ini hanya mensimulasikan sesi menggunakan localStorage.
| Jangan gunakan mekanisme ini untuk aplikasi produksi.
|
| Atribut body:
|   data-page-access="user"  -> wajib login peserta
|   data-page-access="admin" -> wajib login admin
*/

(function () {
    "use strict";

    var KEYS = {
        userEmail: "registerEmail",
        userName: "registerName",
        userVerified: "emailVerified",
        userLoggedIn: "demoLoggedIn",
        adminEmail: "adminEmail",
        adminLoggedIn: "adminLoggedIn",
        dataDiriLengkap: "dataDiriLengkap",
        dataDiriEmail: "dataDiriEmail"
    };

    function normalizeEmail(value) {
        return String(value || "").trim().toLowerCase();
    }

    function currentRelativeUrl() {
        var segments = window.location.pathname.split("/");
        var file = segments[segments.length - 1] || "index.html";

        return file + window.location.search;
    }

    /*
    |--------------------------------------------------------------------------
    | REDIRECT AMAN
    |--------------------------------------------------------------------------
    | Hanya menerima path relatif agar tidak bisa dipakai untuk open redirect.
    */

    function safeRedirect(fallback) {
        fallback = fallback || "dashboard.html";

        var target = new URLSearchParams(window.location.search).get("redirect");

        if (!target) {
            return fallback;
        }

        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(target)) {
            return fallback;
        }

        if (target.indexOf("..") !== -1) {
            return fallback;
        }

        return target;
    }

    function loginUrl() {
        return (
            "login.html?redirect=" +
            encodeURIComponent(currentRelativeUrl())
        );
    }

    function getCurrentUser() {
        var email = normalizeEmail(localStorage.getItem(KEYS.userEmail));

        return {
            email: email,
            name: localStorage.getItem(KEYS.userName) || "",
            loggedIn: localStorage.getItem(KEYS.userLoggedIn) === "true",
            verified: localStorage.getItem(KEYS.userVerified) === "true"
        };
    }

    function isUserLoggedIn() {
        return localStorage.getItem(KEYS.userLoggedIn) === "true";
    }

    function isAdminLoggedIn() {
        return localStorage.getItem(KEYS.adminLoggedIn) === "true";
    }

    function loginUser(email, name) {
        localStorage.setItem(KEYS.userEmail, normalizeEmail(email));
        localStorage.setItem(KEYS.userName, String(name || "").trim());
        localStorage.setItem(KEYS.userLoggedIn, "true");
    }

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    | Hanya menghapus sesi. Data akun & data demo tetap disimpan agar pengguna
    | bisa login kembali tanpa kehilangan data.
    */

    function logoutUser() {
        localStorage.removeItem(KEYS.userLoggedIn);
    }

    function loginAdmin(email) {
        localStorage.setItem(KEYS.adminEmail, normalizeEmail(email));
        localStorage.setItem(KEYS.adminLoggedIn, "true");
    }

    function logoutAdmin() {
        localStorage.removeItem(KEYS.adminLoggedIn);
        localStorage.removeItem(KEYS.adminEmail);
    }

    function getAdminEmail() {
        return normalizeEmail(localStorage.getItem(KEYS.adminEmail));
    }

    function getUserRecord(email) {
        email = normalizeEmail(email || getCurrentUser().email);

        if (!email || !window.DemoStorage) {
            return null;
        }

        var users = window.DemoStorage.getCollection("users") || [];

        return (
            users.find(function (user) {
                return normalizeEmail(user.email) === email;
            }) || null
        );
    }

    function isUserActive(email) {
        var record = getUserRecord(email);

        return !record || record.status !== "inactive";
    }

    function requireUser() {
        var user = getCurrentUser();

        if (!user.loggedIn || !user.email) {
            window.location.replace(loginUrl());
            return false;
        }

        if (!isUserActive(user.email)) {
            logoutUser();

            window.location.replace(loginUrl() + "&inactive=1");
            return false;
        }

        return true;
    }

    function requireAdmin() {
        if (!isAdminLoggedIn()) {
            // Mode demo MVP: otomatis aktifkan sesi admin jika penguji membuka area admin
            loginAdmin("admin@pkbm.test");
        }
        return true;
    }

    /*
    |--------------------------------------------------------------------------
    | PROFIL PESERTA
    |--------------------------------------------------------------------------
    */

    function getProfile(email) {
        email = normalizeEmail(email || getCurrentUser().email);

        if (!email || !window.DemoStorage) {
            return null;
        }

        var profiles = window.DemoStorage.getCollection("profiles") || [];

        return (
            profiles.find(function (profile) {
                return normalizeEmail(profile.email) === email;
            }) || null
        );
    }

    function hasCompleteProfile(email) {
        email = normalizeEmail(email || getCurrentUser().email);

        if (!email) {
            return false;
        }

        var profile = getProfile(email);

        if (profile) {
            return profile.complete === true;
        }

        var legacyEmail = normalizeEmail(
            localStorage.getItem(KEYS.dataDiriEmail)
        );

        var legacyComplete =
            localStorage.getItem(KEYS.dataDiriLengkap) === "true";

        return (
            legacyComplete && (!legacyEmail || legacyEmail === email)
        );
    }

    function markProfileComplete(email) {
        email = normalizeEmail(email || getCurrentUser().email);

        localStorage.setItem(KEYS.dataDiriLengkap, "true");
        localStorage.setItem(KEYS.dataDiriEmail, email);
    }

    function resetProfileComplete() {
        localStorage.removeItem(KEYS.dataDiriLengkap);
        localStorage.removeItem(KEYS.dataDiriEmail);
    }

    /*
    |--------------------------------------------------------------------------
    | AUTO GUARD
    |--------------------------------------------------------------------------
    */

    function autoGuard() {
        if (!document.body) {
            return;
        }

        var access = document.body.getAttribute("data-page-access");

        if (access === "user") {
            requireUser();
        } else if (access === "admin") {
            requireAdmin();
        }
    }

    if (document.body) {
        autoGuard();
    } else {
        document.addEventListener("DOMContentLoaded", autoGuard);
    }

    window.Auth = {
        KEYS: KEYS,
        normalizeEmail: normalizeEmail,
        safeRedirect: safeRedirect,
        currentRelativeUrl: currentRelativeUrl,
        getCurrentUser: getCurrentUser,
        isUserLoggedIn: isUserLoggedIn,
        isAdminLoggedIn: isAdminLoggedIn,
        loginUser: loginUser,
        logoutUser: logoutUser,
        loginAdmin: loginAdmin,
        logoutAdmin: logoutAdmin,
        getAdminEmail: getAdminEmail,
        getUserRecord: getUserRecord,
        isUserActive: isUserActive,
        requireUser: requireUser,
        requireAdmin: requireAdmin,
        getProfile: getProfile,
        hasCompleteProfile: hasCompleteProfile,
        markProfileComplete: markProfileComplete,
        resetProfileComplete: resetProfileComplete
    };
})();
