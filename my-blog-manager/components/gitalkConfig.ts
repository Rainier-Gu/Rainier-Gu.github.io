import { siteConfig } from '../siteConfig';

export type GitalkRuntimeConfig = {
  clientID: string;
  clientSecret: string;
  repo: string;
  owner: string;
  admin: string[];
  proxy: string;
};

function splitList(value?: string) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAdmin(admin?: string[]) {
  return (admin || []).map((item) => item.trim()).filter(Boolean);
}

export function getGitalkConfig(): GitalkRuntimeConfig {
  const envAdmin = splitList(process.env.NEXT_PUBLIC_GITALK_ADMIN);
  const siteAdmin = normalizeAdmin(siteConfig.gitalkConfig.admin);

  return {
    clientID:
      process.env.NEXT_PUBLIC_GITALK_CLIENT_ID ||
      siteConfig.gitalkConfig.clientID ||
      '',
    clientSecret:
      process.env.NEXT_PUBLIC_GITALK_CLIENT_SECRET ||
      siteConfig.gitalkConfig.clientSecret ||
      '',
    repo:
      process.env.NEXT_PUBLIC_GITALK_REPO ||
      siteConfig.gitalkConfig.repo ||
      'Rainier-Gu.github.io',
    owner:
      process.env.NEXT_PUBLIC_GITALK_OWNER ||
      siteConfig.gitalkConfig.owner ||
      'Rainier-Gu',
    admin: envAdmin.length > 0 ? envAdmin : siteAdmin.length > 0 ? siteAdmin : ['Rainier-Gu'],
    proxy: '/api/github',
  };
}

export function isGitalkConfigured(config = getGitalkConfig()) {
  return Boolean(
    config.clientID &&
    config.clientSecret &&
    config.repo &&
    config.owner &&
    config.admin.length > 0
  );
}

export function getGitalkIssueId(id: string) {
  return (id.replace(/\/$/, '') || '/').substring(0, 49);
}
