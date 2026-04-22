import { truncateBody } from '../src/features/activity-feed/utils';

describe('activity feed utils', () => {
  it('returns original body when short enough', () => {
    expect(truncateBody('short body', 20)).toBe('short body');
  });

  it('truncates long body and adds ellipsis', () => {
    expect(truncateBody('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefghij...');
  });
});