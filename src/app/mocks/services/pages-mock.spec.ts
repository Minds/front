export let pagesServiceMock = new (function() {
  this.isInternalLink = () => {
    return true;
  };
})();
