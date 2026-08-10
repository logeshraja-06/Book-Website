export const DEFAULT_BOOK_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80';

export function handleImgError(e, fallbackUrl) {
  if (e?.target && e.target.src !== fallbackUrl) {
    e.target.onerror = null;
    e.target.src = fallbackUrl;
  }
}
