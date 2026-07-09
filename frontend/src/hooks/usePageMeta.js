import { useEffect } from 'react';

/**
 * usePageMeta — sets document.title and the <meta name="description">
 * content for the current page.
 *
 * Honest scope note: because this site uses hash-based routing, search
 * engines still treat every page as the same URL for indexing purposes —
 * this hook does NOT create separately-indexable pages (see the comment
 * in public/sitemap.xml for what would). What it does give you, for free:
 * correct browser tab titles per page, and a better preview if a JS-
 * executing crawler or link-preview bot renders the page before reading
 * meta tags.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
