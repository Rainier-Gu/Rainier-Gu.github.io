'use client';

import GitHubComments from './GitHubComments';

export default function MomentComments({ id }: { id: string }) {
  return <GitHubComments id={id} compact />;
}
