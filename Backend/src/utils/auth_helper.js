export function get_email(profile) {
    const email = profile?.email || profile?.emails?.[0]?.value || profile?._json?.email;
    return Array.isArray(email) ? email[0] : email;
}
export function get_name(profile) {
    return profile.displayName || profile.name?.givenName || "New Player";
}