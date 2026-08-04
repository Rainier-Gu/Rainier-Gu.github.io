import type { Metadata } from 'next';
import GitHubOAuthCallback from './GitHubOAuthCallback';

export const metadata: Metadata = {
  title: 'GitHub 登录回调',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GitHubOAuthCallbackPage() {
  return <GitHubOAuthCallback />;
}
