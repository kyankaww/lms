(function () {
    const STORAGE_KEY = "pkbmLpkDemoData";
    const VERSION_KEY = "pkbmLpkDemoVersion";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function initialize() {
        const existing = localStorage.getItem(STORAGE_KEY);
        const savedVersion = Number(
            localStorage.getItem(VERSION_KEY) || 0
        );

        if (!existing || savedVersion !== window.DEMO_SEED.version) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(clone(window.DEMO_SEED))
            );

            localStorage.setItem(
                VERSION_KEY,
                String(window.DEMO_SEED.version)
            );
        }
    }
    function getAll() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
            return clone(window.DEMO_SEED);
        } catch (error) {
            console.error(
                "Data demo tidak dapat dibaca:",
                error
            );
            return clone(window.DEMO_SEED);
        }
    }
    function saveAll(data) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
        window.dispatchEvent(
            new CustomEvent("demo-data-updated", {
                detail: data
            })
        );
        return data;
    }

    function getCollection(name) {
        const data = getAll();
        if (!Array.isArray(data[name])) {
            return [];
        }
        return data[name];
    }

    function saveCollection(name, items) {
        const data = getAll();
        data[name] = items;

        return saveAll(data);
    }

    function reset() {
        const freshData = clone(window.DEMO_SEED);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(freshData)
        );
        localStorage.setItem(
            VERSION_KEY,
            String(window.DEMO_SEED.version)
        );
        window.dispatchEvent(
            new CustomEvent("demo-data-updated", {
                detail: freshData
            })
        );
        return freshData;
    }

    initialize();
    window.DemoStorage = {
        getAll,
        saveAll,
        getCollection,
        saveCollection,
        reset
    };

})();