```typescript
/**
 * Note sur l'exposition et l'appel de méthodes avec paramètre.
 * (Il n'y en avait pas dans la V1)
 */

import type { RPC } from '@mixer/postmessage-rpc';

{
    // La construction de l'objet RPC est inchangée.
    // Pour les besoin de l'illustration, on suppose que l'objet RPC est stocké dans la variable rpc.
    // @ts-ignore
    const rpc: RPC = createRpc();

    // Exposition d'une méthode avec paramètre
    // le paramètre est à extraire du tableau args (par déstructuration)
    // exemple de save(emit?: boolean): 'saved' | ProjectData

    // version typescript
    rpc.expose<[boolean]>('save', ([emit]) => {
        emit = emit === true;
        // faire la sauvegarde
        // ...
        // @ts-ignore
        if (failed) return false;
        if (!emit) return 'saved';
        // récupérer les données du projet
        // @ts-ignore
        const projectData: ProjectData = {
            // ...
        }
        return projectData;
    });

    // version javascript
    // @ts-ignore
    rpc.expose('save', ([emit]) => {
        emit = emit === true;
        // faire la sauvegarde
        // ...
        // @ts-ignore
        if (failed) return false;
        if (!emit) return 'saved';
        // récupérer les données du projet
        // @ts-ignore
        const projectData = {
            // ...
        }
        return projectData;
    });

    // Appel d'une méthode avec paramètre
    // le paramètre est à passer dans le tableau args
    // exemple de loaded(contractId?: string): void | string;

    // version typescript
    {
        const contractId = 'lti.vs:2';
        const remoteContractId = await rpc.call<void | string>('loaded', [contractId]);
        // @ts-ignore
        const isV2 = remoteContractId === contractId;
        // ...
    }

    // version javascript
    {
        const contractId = 'lti.vs:2';
        const remoteContractId = await rpc.call('loaded', [contractId]);
        // @ts-ignore
        const isV2 = remoteContractId === contractId;
        // ...
    }
}
```