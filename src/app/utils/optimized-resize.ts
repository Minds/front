class OptimizedResize {
  private callbacks = [];
  private running = false;

  public isRunning(): boolean {
    return this.running;
  }

  // fired on resize event
  private resize() {
    if (!this.running) {
      this.running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(this.runCallbacks.bind(this));
      } else {
        setTimeout(this.runCallbacks.bind(this), 66);
      }
    }
  }

  // run the actual callbacks
  private runCallbacks() {
    this.callbacks.forEach((callback) => {
      callback();
    });

    this.running = false;
  }

  // adds callback to loop
  private addCallback(callback) {
    if (callback) {
      this.callbacks.push(callback);
    }
  }

  // public method to add additional callback
  public add(callback) {
    if (!this.callbacks.length) {
      window.addEventListener('resize', this.resize.bind(this));
    }
    this.addCallback(callback);
  }
}

export const optimizedResize = new OptimizedResize();
