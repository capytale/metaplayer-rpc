import { ChatCompletionTool } from "./types/llm";
import { Mode } from "./types/mode";

/**
 * Contrat pour utiliser des outils LLM.
 *
 * Documentation : [https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#l-l-m](https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#l-l-m)
 */
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
    getFirstMessageContext(mode: Mode): string;

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* quel contexte donner à tous les messages
     * d'une conversation avec le LLM (y-compris le premier message).
     */
    getAllMessagesContext(mode: Mode): string;

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* quels outils
     * sont disponibles pour le LLM.
     */
    getAvailableTools(mode: Mode): ChatCompletionTool[];

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* d'exécuter un outil. Doit renvoyer le
     * résultat sous forme d'objet (qui doit être serializable en JSON) ainsi qu'un booléen indiquant si l'opération a
     * réussi (uniquement utilisé pour l'interface utilisateur, la communication de l'échec au LLM doit être gérée
     * dans le résultat, en accord avec la description de l'outil).
     */
    callTool(
      toolName: string,
      toolArguments: any,
      mode: Mode,
    ): { result: any; success: boolean };

    /**
     * Le *MetaPlayer* appelle cette méthode pour demander à l'*Application* la description courte d'un appel
     * d'outil (à afficher à l'utilisateur dans la fenêtre de chat).
     */
    getToolCallDescription(
      toolName: string,
      toolArguments: any,
      mode: Mode,
    ): string;
  };
};
