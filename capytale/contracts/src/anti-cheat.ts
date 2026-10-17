/**
 * Contrat pour contrôler l'anti-cheat.
 *
 * Documentation : [
 * https://capytale.forge.apps.education.fr/doctechcapytale/capytale-metaplayer/02-contracts/#anti-cheat
 * ](https://capytale.forge.apps.education.fr/doctechcapytale/capytale-metaplayer/02-contracts/#anti-cheat)
 */
export type AntiCheatV1 = {
  version: 1;

  /**
   * L'interface qui expose le *MetaPlayer* à l'*Application*.
   */
  metaplayer: {
    reportGainedFocus(): void;
    reportLostFocus(): void;
  };

  /**
   * L'interface qui expose l'*Application* au *MetaPlayer*.
   */
  application: {
    lock(): void;
    unlock(): void;
  };
};