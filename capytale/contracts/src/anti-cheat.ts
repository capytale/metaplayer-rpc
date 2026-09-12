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