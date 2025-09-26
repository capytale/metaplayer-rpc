import { expect, test } from 'vitest';
import { contractSlotFactory } from '../src/contract-slot';

test('createContractSlot1', () => {
    const createContractSlot = contractSlotFactory((m) => { return m; });
    const slot = createContractSlot('foo');
    expect(slot.name).toBe('foo');
    expect(slot.localVersion).toBeUndefined()
    expect(slot.depGroup).toBeUndefined();

    slot.localVersion = 1;
    expect(slot.localVersion).toBe(1);
    expect(slot.localVersionSent).toBe(false);
    expect(slot.localInterfaceSent).toBe(false);

    slot.localVersionSent = true;
    expect(slot.localVersionSent).toBe(true);
    expect(slot.localInterfaceSent).toBe(false);

    slot.localInterfaceSent = true;
    expect(slot.localInterfaceSent).toBe(true);

    expect(slot.isActivable).toBe(false);
    expect(slot.remoteVersion).toBeUndefined();

    slot.remoteVersion = 2;
    expect(slot.remoteVersion).toBe(2);
    expect(slot.remoteVersionReceived).toBe(true);
    expect(slot.remoteInterfaceReceived).toBe(false);

    expect(slot.isActivable).toBe(false);

    const _interface = { hello: 'world'};
    slot.setRemoteInterface(_interface);
    expect(slot.remoteInterfaceReceived).toBe(true);

    expect(slot.isActivable).toBe(true);

    slot.activate();
    expect(slot.isActivated).toBe(true);

    const remote = slot.getRemote();
    expect(remote.name).toBe('foo');
    expect(remote.version).toBe(2);
    expect(remote.i).toBe(_interface);
    expect(remote.v(1)).toBe(_interface);
    expect(remote.v(2)).toBe(_interface);
    expect(remote.v(3)).toBeUndefined();
});

test('createContractSlot2', async () => {
    const createContractSlot = contractSlotFactory((m) => { return m; });
    const slot = createContractSlot('foo');
    const lazy = slot.getLazyRemote();
    expect(lazy.i).toBeUndefined();

    slot.remoteVersion = 2;
    slot.localVersion = 1;
    slot.localVersionSent = true;
    slot.localInterfaceSent = true;
    const _interface = { hello: 'world'};
    slot.setRemoteInterface(_interface);
    slot.activate();

    const remote = await lazy.promise;
    expect(remote.name).toBe('foo');
    expect(remote.version).toBe(2);
    expect(remote.i).toBe(_interface);
});
