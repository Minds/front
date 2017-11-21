import { run } from './run';

export const getCommitHash = () => {
  try {
    let hash = run('git rev-parse --short HEAD').trim();
    return '_' + hash; //edge case where 50e3252 is Infinty
  } catch (e) {
    throw new Error('Cannot determine current release. Run it within the Git repository or use the --v flag');
  }
};
