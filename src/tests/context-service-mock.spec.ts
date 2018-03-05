/**
 * @author emi
 */
export let contextServiceMock = new function () {
  this.listen = () => this;
  this.unlisten = () => this;
  this.reset = () => this;
  this.set = (product, entity?) => this;
  this.get = () => {};
  this.resolveLabel = (guid) => guid;
  this.resolveStaticLabel = (product) => product;
};
