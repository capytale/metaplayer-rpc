import { ChatCompletionTool } from "./types/llm";

export type LLMV1 = {
  version: 1;

  /**
   * L'interface qui expose le *MetaPlayer* à l'*Application*.
   */
  metaplayer: {};

  /**
   * L'interface qui expose l'*Application* au *MetaPlayer*.
   */
  application: {
    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* quel contexte donner au premier message
     * d'une conversation avec le LLM (avant tout autre contexte).
     *
     * @param mode le mode en cours.
     */
    getFirstMessageContext(
      mode: "create" | "assignment" | "review" | "view",
    ): string;

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* quel contexte donner à tous les messages
     * d'une conversation avec le LLM (y-compris le premier message).
     */
    getAllMessagesContext(
      mode: "create" | "assignment" | "review" | "view",
    ): string;

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* quels outils
     * sont disponibles pour le LLM.
     */
    getAvailableTools(
      mode: "create" | "assignment" | "review" | "view",
    ): ChatCompletionTool[];

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* d'exécuter un outil. Doit renvoyer le
     * résultat sous forme d'objet (qui doit être sérializable en JSON) ainsi qu'un booléen indiquant si l'opération a
     * réussi (uniquement utilisé pour l'interface utilisateur, la communication de l'échec au LLM doit être gérée
     * dans le résultat, en accord avec la description de l'outil).
     */
    callTool(
      toolName: string,
      toolArguments: any,
      mode: "create" | "assignment" | "review" | "view",
    ): { result: any; success: boolean };

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* la description courte d'un appel
     * d'outil (à afficher à l'utilisateur dans la fenêtre de chat).
     */
    getToolCallDescription(
      toolName: string,
      toolArguments: any,
      mode: "create" | "assignment" | "review" | "view",
    ): string;
  };
};
