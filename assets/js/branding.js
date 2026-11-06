/*
|--------------------------------------------------------------------------
| IDENTITAS MEREK (BRANDING)
|--------------------------------------------------------------------------
| Semua halaman memakai satu sumber identitas. Jika nama lembaga berubah,
| cukup ubah nilai default di bawah atau isi "Konten Website" di panel admin.
*/

(function () {
    "use strict";

    var DEFAULT_BRAND = {
        name: "PKBM & LPK",
        mark: "P",
        tagline: "Pendidikan Kesetaraan & Pelatihan Kerja",
        description:
            "Layanan pendidikan kesetaraan dan pelatihan keterampilan untuk membantu setiap peserta meraih kesempatan yang lebih baik.",
        email: "info@pkbm-lpk.test",
        phone: "0812-3456-7890",
        address: "Jl. Pendidikan No. 10, Bandung",
        hours: "Senin–Sabtu, 08.00–17.00"
    };

    function getContent() {
        try {
            if (!window.DemoStorage) {
                return null;
            }

            var data = window.DemoStorage.getAll();
            return data && data.websiteContent ? data.websiteContent : null;
        } catch (error) {
            return null;
        }
    }

    function getBrand() {
        var content = getContent() || {};
        var name = String(content.siteName || DEFAULT_BRAND.name).trim();
        var markMatch = name.match(/[a-z0-9]/i);

        return {
            name: name || DEFAULT_BRAND.name,
            mark: markMatch ? markMatch[0].toUpperCase() : DEFAULT_BRAND.mark,
            tagline: content.tagline || DEFAULT_BRAND.tagline,
            description: content.heroDescription || DEFAULT_BRAND.description,
            email: content.contactEmail || DEFAULT_BRAND.email,
            phone: content.contactPhone || DEFAULT_BRAND.phone,
            address: content.contactAddress || DEFAULT_BRAND.address,
            hours: content.contactHours || DEFAULT_BRAND.hours
        };
    }

    function setText(selector, value) {
        document.querySelectorAll(selector).forEach(function (element) {
            element.textContent = value;
        });
    }

    function applyTitle(brand) {
        var title = document.title || "";

        if (title.indexOf("PKBM & LPK") !== -1) {
            document.title = title.replace(/PKBM & LPK/g, brand.name);
        } else if (title.indexOf("Sekolah") !== -1) {
            document.title = title.replace(/Sekolah/g, brand.name);
        }
    }

    function applyMetaDescription(brand) {
        var meta = document.querySelector('meta[name="description"]');

        if (!meta) {
            return;
        }

        meta.setAttribute("content", brand.description);
    }

    function applyFavicon(brand) {
        var existing = document.querySelector('link[data-brand-favicon="true"]');

        if (existing) {
            existing.remove();
        }

        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
            '<rect width="64" height="64" rx="16" fill="#3157d5"/>' +
            '<text x="32" y="43" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="34" font-weight="800" fill="#ffffff">' +
            brand.mark +
            "</text></svg>";

        var link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/svg+xml";
        link.setAttribute("data-brand-favicon", "true");
        link.href = "data:image/svg+xml," + encodeURIComponent(svg);

        document.head.appendChild(link);
    }

    function applyBrand() {
        var brand = getBrand();

        setText("[data-brand-name]", brand.name);
        setText("[data-brand-mark]", brand.mark);
        setText("[data-brand-tagline]", brand.tagline);
        setText("[data-brand-email]", brand.email);
        setText("[data-brand-phone]", brand.phone);
        setText("[data-brand-address]", brand.address);
        setText("[data-brand-hours]", brand.hours);
        setText("[data-brand-year]", String(new Date().getFullYear()));

        applyTitle(brand);
        applyMetaDescription(brand);
        applyFavicon(brand);

        window.Brand = brand;
    }

    applyBrand();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyBrand);
    }

    window.addEventListener("demo-data-updated", applyBrand);
})();
