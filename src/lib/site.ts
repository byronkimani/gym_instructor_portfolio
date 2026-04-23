/**
 * Optional public URLs. When unset, UI should link to on-site fallbacks (e.g. /contact#social-handles)
 * instead of generic third-party homepages.
 */
export function getSocialUrl(platform: 'instagram' | 'twitter' | 'facebook'): string | null {
  const key =
    platform === 'instagram'
      ? 'NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL'
      : platform === 'twitter'
        ? 'NEXT_PUBLIC_SOCIAL_TWITTER_URL'
        : 'NEXT_PUBLIC_SOCIAL_FACEBOOK_URL';
  const v = process.env[key]?.trim();
  return v || null;
}
