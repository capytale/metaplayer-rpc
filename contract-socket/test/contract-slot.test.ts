import { expect, test } from 'vitest';
import { createContractSlot } from '../src/contract-slot';

test('createContractSlot1', () => {
    const slot = createContractSlot('foo');
    expect(slot.name).toBe('foo');
    expect(slot.localVersion).toBeUndefined()
    expect(slot.remoteVersion).toBeUndefined();
    expect(slot.isReadyForFactory).toBe(false);
    expect(slot.isReadyForActivation).toBe(false);
    expect(slot.depGroup).toBeUndefined();

    slot.setLocalVersion(1);
    expect(slot.localVersion).toBe(1);
    expect(slot.isReadyForFactory).toBe(false);
    expect(slot.isReadyForActivation).toBe(false);

    slot.setRemoteVersion(2);
    expect(slot.remoteVersion).toBe(2);
    expect(slot.isReadyForFactory).toBe(true);
    expect(slot.isReadyForActivation).toBe(false);

    const _interface = { hello: 'world'};
    slot.setInterface(_interface);
    expect(slot.isReadyForActivation).toBe(false);

    slot.setRemotelyPlugged();
    expect(slot.isReadyForActivation).toBe(true);

    slot.activate();
    expect(slot.isActivated).toBe(true);

    const remote = slot.getRemote();
    expect(remote.name).toBe('foo');
    expect(remote.version).toBe(2);
    expect(remote.i).toBe(_interface);
    expect(remote.v(1)).toBe(_interface);
    expect(remote.v(2)).toBe(_interface);
    expect(remote.v(3)).toBeNull();
});

test('createContractSlot2', () => {
    const slot = createContractSlot('foo');

    slot.setRemoteVersion(2);
    expect(slot.remoteVersion).toBe(2);
    expect(slot.isReadyForFactory).toBe(true);
    expect(slot.isReadyForActivation).toBe(false);

    slot.setLocalVersion(1);
    expect(slot.localVersion).toBe(1);
    expect(slot.isReadyForActivation).toBe(false);

    slot.setRemotelyPlugged();
    expect(slot.isReadyForActivation).toBe(false);

    const _interface = { hello: 'world'};
    slot.setInterface(_interface);
    expect(slot.isReadyForActivation).toBe(true);

    slot.activate();
    expect(slot.isActivated).toBe(true);
});

test('createContractSlot2', async () => {
    const slot = createContractSlot('foo');
    const lazy = slot.getLazyRemote();
    expect(lazy.i).toBeUndefined();

    slot.setRemoteVersion(2);
    slot.setLocalVersion(1);
    slot.setRemotelyPlugged();
    const _interface = { hello: 'world'};
    slot.setInterface(_interface);
    slot.activate();

    const remote = await lazy.promise;
    expect(remote.name).toBe('foo');
    expect(remote.version).toBe(2);
    expect(remote.i).toBe(_interface);
});
