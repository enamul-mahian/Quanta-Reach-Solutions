/** Minimal browser-side sanitizer for rich text stored by the website CMS. */
export const sanitizeHtml = (unsafeHtml) => {
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined')
        return '';
    const documentFragment = new DOMParser().parseFromString(unsafeHtml, 'text/html');
    documentFragment.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach((node) => node.remove());
    documentFragment.body.querySelectorAll('*').forEach((element) => {
        Array.from(element.attributes).forEach((attribute) => {
            const name = attribute.name.toLowerCase();
            const value = attribute.value.trim().toLowerCase();
            if (name.startsWith('on') || ((name === 'href' || name === 'src') && value.startsWith('javascript:'))) {
                element.removeAttribute(attribute.name);
            }
        });
    });
    return documentFragment.body.innerHTML;
};
