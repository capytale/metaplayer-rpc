/**
 * Préfixe un message avec un nom donné.
 * @param name le nom à préfixer
 * @param m le message à préfixer
 * @returns le message préfixé
 */
export function prefixMsg(name: string | null | undefined, m: string): string {
    if (name == null || name.length === 0) return m;
    else return `[${name}] ${m}`;
}

/**
 * Une fonction de préfixage des messages d'erreur.
 */
export type PM = (m: string) => string;
