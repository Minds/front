import { VotingStrategy } from './voting-strategy';

function percentageOfTotal(i, values, total) {
  const reducedTotal: any = total.reduce((a: any, b: any) => a + b, 0);
  const percent = (values[i] / reducedTotal) * 100;
  return isNaN(percent) ? 0 : percent;
}

function weightedPower(i, choice, balance) {
  return (
    (percentageOfTotal(i + 1, choice, Object.values(choice)) / 100) * balance
  );
}

function flatDeep(arr, d = 1) {
  return d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
        []
      )
    : arr.slice();
}

export class WeightedVoting extends VotingStrategy {
  resultsByVoteBalance() {
    const results = this.proposal.choices.map((choice, i) =>
      this.votes
        .map(vote => weightedPower(i, vote.choice, vote.balance))
        .reduce((a, b: any) => a + b, 0)
    );

    return results
      .map((res, i) => percentageOfTotal(i, results, results))
      .map(p => (this.sumOfResultsBalance() / 100) * p);
  }

  resultsByStrategyScore() {
    const results = this.proposal.choices
      .map((choice, i) =>
        this.strategies.map((strategy, sI) =>
          this.votes
            .map(vote => weightedPower(i, vote.choice, vote.scores[sI]))
            .reduce((a, b: any) => a + b, 0)
        )
      )
      .map(arr => arr.map(pwr => [pwr]));

    return results.map((res, i) =>
      this.strategies
        .map((strategy, sI) => [
          percentageOfTotal(0, results[i][sI], flatDeep(results, 2)),
        ])
        .map(p => [(this.sumOfResultsBalance() / 100) * p])
    );
  }

  sumOfResultsBalance() {
    return this.votes.reduce((a, b: any) => a + b.balance, 0);
  }
}
