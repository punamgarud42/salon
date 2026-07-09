import { useState } from 'react';

/**
 * useCopyToClipboard — returns [copied, copy(text)]. `copied` resets to
 * false automatically after 2 seconds so a "Copied!" label reverts on its
 * own. Falls back to a hidden-textarea + execCommand trick if the async
 * Clipboard API isn't available (e.g. non-HTTPS contexts).
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  async function copy(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('[useCopyToClipboard] copy failed:', err);
    }
  }

  return [copied, copy];
}
