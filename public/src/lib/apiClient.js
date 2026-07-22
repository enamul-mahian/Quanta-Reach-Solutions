const getCsrfToken = () =>
    document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') || '';

const hydrateTimestamp = (value) => {
    const ms = Date.parse(value);

    if (!Number.isFinite(ms)) {
        return value;
    }

    const date = new Date(ms);

    return {
        seconds: Math.floor(ms / 1000),
        nanoseconds: 0,
        toDate: () => new Date(date),
        toMillis: () => ms,
    };
};

const hydrate = (value, key = '') => {
    if (Array.isArray(value)) {
        return value.map((item) => hydrate(item));
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([childKey, childValue]) => [
                childKey,
                hydrate(childValue, childKey),
            ])
        );
    }

    if (typeof value === 'string' && /At$/.test(key)) {
        return hydrateTimestamp(value);
    }

    return value;
};

const request = async (path, options = {}) => {
    const headers = new Headers(options.headers || {});

    headers.set('Accept', 'application/json');

    if (!(options.body instanceof FormData) && options.body != null) {
        headers.set('Content-Type', 'application/json');
    }

    const csrf = getCsrfToken();
    const method = (options.method || 'GET').toUpperCase();

    if (csrf && !['GET', 'HEAD'].includes(method)) {
        headers.set('X-CSRF-TOKEN', csrf);
    }

    const response = await fetch(`/api${path}`, {
        credentials: 'same-origin',
        ...options,
        headers,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const details = payload.errors
            ? Object.values(payload.errors).flat().join(' ')
            : '';

        throw new Error(
            details ||
            payload.message ||
            `Request failed (${response.status})`
        );
    }

    /*
     * Important:
     * Preserve an explicit null response such as {"data": null}.
     * Using payload.data ?? payload incorrectly converts it into
     * a truthy object and creates a false authenticated state.
     */
    const responseData = Object.prototype.hasOwnProperty.call(payload, 'data')
        ? payload.data
        : payload;

    return hydrate(responseData);
};

export const api = {
    get: (path) =>
        request(path),

    post: (path, data) =>
        request(path, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    patch: (path, data) =>
        request(path, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    put: (path, data) =>
        request(path, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (path) =>
        request(path, {
            method: 'DELETE',
        }),
};

export const contentApi = {
    list: (type, includeAll = false) =>
        api.get(
            `/content/${type}${includeAll ? '?include_all=1' : ''}`
        ),

    show: (type, idOrSlug) =>
        api.get(
            `/content/${type}/${encodeURIComponent(idOrSlug)}`
        ),

    create: (type, data) =>
        api.post(`/content/${type}`, { data }),

    publicCreate: (type, data) =>
        api.post(`/public/${type}`, { data }),

    update: (type, id, data) =>
        api.patch(
            `/content/${type}/${encodeURIComponent(id)}`,
            { data }
        ),

    remove: (type, id) =>
        api.delete(
            `/content/${type}/${encodeURIComponent(id)}`
        ),
};