import { run } from './run';

export const getCommitHash = () => {
  try {
    return run('git rev-parse --short HEAD').trim();
  } catch (e) {
    throw new Error('Cannot determine current release. Run it within the Git repository or use the --v flag');
  }
};
