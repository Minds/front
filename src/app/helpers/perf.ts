export default function perf(label: string): PerfInstance {
  return new PerfInstance(label);
}

export class PerfInstance {
  protected stepNum: number = 0;
  protected stepTs: number;

  constructor(protected label: string) {
    this.step('Init');
  }

  step(label: string = 'Step') {
    const last = this.stepTs;
    const now = performance.now();

    this.stepNum++;
    this.stepTs = now;

    console.info(
      `${this.label} - ${label} - Step ${this.stepNum}`,
      last ? `- ${now - last}ms` : ''
    );
  }

  end() {
    this.step('End');
  }
}
