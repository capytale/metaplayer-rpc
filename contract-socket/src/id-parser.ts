const regEx = /^\d+$/;

/**
 * L'identifiant d'un contrat est constitué de :
 *  - son nom,
 *  - sa version.
 * Il est de la forme : "name:version".
 * 
 * @param id 
 * @returns null si l'identifiant est invalide.
 */
export function parseId(id: string): null | { name: string, version: number } {
    const [name, v, rest] = id.split(':', 3);
    if (v == null) return null;
    if (rest != null) return null;
    if (!regEx.test(v)) return null;
    const version = parseInt(v);
    if (isNaN(version)) return null;
    if (version === 0) return null;
    return { name, version };
}