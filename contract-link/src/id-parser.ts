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
    const [name, v] = id.split(':', 2);
    const version = parseInt(v);
    if (isNaN(version)) return null;
    return { name, version };
}