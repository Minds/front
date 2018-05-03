export const SOURCE_CANDIDATE_PICK_LINEAR = 1;
export const SOURCE_CANDIDATE_PICK_ZIGZAG = 2;

export class SourceCandidates {
  protected candidates: { [index:string]: any[] } = {};
  protected blacklist = [];
  protected lastBlacklistedType;

  setSource(type: string, values: any[]) {
    this.candidates[type] = values;
  }

  markAsClean() {
    this.blacklist = [];
    this.lastBlacklistedType = void 0;
  }

  setAsBlacklisted(type: string, value: any) {
    this.blacklist.push({ type, value });
    this.lastBlacklistedType = type;
    // console.log('[sourcecandidates] blacklisted', { type, value }, JSON.stringify(this), this);
  }

  isBlacklisted(type: string, value: any) {
    return this.blacklist.findIndex(item => item.type === type && item.value === value) > -1;
  }

  empty() {
    this.candidates = {};
    this.markAsClean();
  }

  pick(typePriorities: string[], strategy: number = SOURCE_CANDIDATE_PICK_LINEAR): { type, value } {
    switch (strategy) {
      case SOURCE_CANDIDATE_PICK_ZIGZAG:
        return this._pickZigZag(typePriorities);

      case SOURCE_CANDIDATE_PICK_LINEAR:
      default:
        return this._pickLinear(typePriorities);
    }
  }

  private _pickZigZag(typePriorities: string[]): { type, value } {
    const reorderedTypePriorities = typePriorities;

    if (this.lastBlacklistedType) {
      const index: number = reorderedTypePriorities.findIndex(type => type === this.lastBlacklistedType);

      if (index > -1) {
        reorderedTypePriorities.push(...reorderedTypePriorities.splice(index, 1));
      }
    }

    return this._pickLinear(reorderedTypePriorities);
  }

  private _pickLinear(typePriorities: string[]): { type, value } {
    for (let type of typePriorities) {
      if (!this.candidates[type]) {
        continue;
      }

      const candidates = this.candidates[type].filter(value => !this.isBlacklisted(type, value));

      if (candidates.length > 0) {
        return {
          type,
          value: candidates[0],
        };
      }
    }

    return void 0;
  }
}
