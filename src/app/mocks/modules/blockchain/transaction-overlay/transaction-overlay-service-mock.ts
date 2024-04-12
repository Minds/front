export let transactionOverlayService = new (function () {
  this.component = null;

  this.setComponent = (comp) => {
    this.component = comp;
  };

  this.showAndRun = async (
    fn: Function,
    title: string,
    showNotes: boolean = true
  ) => {};
})();
