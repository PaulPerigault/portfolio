// TF_LOG* et TF_CLI_ARGS* de l'environnement hérité n'atteignent jamais un processus `infra:*`.
import { describe, expect, it } from 'vitest';
import { childEnv, githubEnv, identityEnv } from './lib/infra-secrets.mjs';

const inherited = {
  PATH: '/bin',
  TF_LOG: 'trace',
  TF_LOG_PATH: 'out.log',
  TF_LOG_PROVIDER: 'debug',
  TF_CLI_ARGS: '-destroy',
  TF_CLI_ARGS_apply: '-auto-approve',
  TF_VAR_other: 'kept',
};
const deps = {
  env: inherited,
  readFile: () => 'AWS_ACCESS_KEY_ID=fake-id\nGITHUB_IAC_TOKEN=fake-gh\n',
  root: '.',
};

describe('variables TF_* ambiantes', () => {
  it.each([
    ['childEnv', childEnv],
    ['githubEnv', githubEnv],
    ['identityEnv', identityEnv],
  ])('%s retire TF_LOG* et TF_CLI_ARGS*, garde le reste', (_name, load) => {
    const env = load(['AWS_ACCESS_KEY_ID'], deps);
    expect(Object.keys(env).filter((name) => /^TF_(?:LOG|CLI_ARGS)/.test(name))).toEqual([]);
    expect(env).toMatchObject({ PATH: '/bin', TF_VAR_other: 'kept', AWS_ACCESS_KEY_ID: 'fake-id' });
  });
});
