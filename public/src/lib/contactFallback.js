import { SITE } from '/src/config/site.js';
/**
 * Opens a pre-filled email in the visitor's default mail application.
 * This keeps public contact actions usable on a static deployment before
 * the optional Firebase backend is connected.
 */
export const openPreparedEmail = (subject, lines) => {
    const body = lines
        .filter((line) => typeof line === 'string' && line.trim().length > 0)
        .join('\n');
    const mailtoUrl = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.assign(mailtoUrl);
};
