import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(dirty: string, options?: DOMPurify.Config): string {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'span', 'div'
        ],
        ALLOWED_ATTR: [
            'href', 'title', 'alt', 'src', 'class', 'style', 'target', 'rel'
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        ...options,
    });
}

/**
 * Sanitize plain text (removes all HTML tags)
 * @param text - The text to sanitize
 * @returns Plain text without HTML
 */
export function sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize rich text content for devotionals and other rich content
 * Allows more HTML tags for formatting
 */
export function sanitizeRichText(content: string): string {
    return sanitizeHTML(content, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'span', 'div',
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'
        ],
        ALLOWED_ATTR: [
            'href', 'title', 'alt', 'src', 'class', 'style', 'target', 'rel',
            'width', 'height', 'colspan', 'rowspan', 'align'
        ],
    });
}
