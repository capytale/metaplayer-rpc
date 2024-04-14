import { expect, test } from 'vitest';
import { parseId } from '../src/id-parser';

test('parseId', () => {
    expect(parseId('name:1')).toEqual({ name: 'name', version: 1 });
    expect(parseId('name')).toBeNull();
    expect(parseId('foo5:3')).toEqual({ name: 'foo5', version: 3 });
    expect(parseId('bar:0')).toEqual({ name: 'bar', version: 0 });
    expect(parseId('name:1.2')).toBeNull();
    expect(parseId('name:1,3')).toBeNull();
    expect(parseId('name:1:3')).toBeNull();
});
