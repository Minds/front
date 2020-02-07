export class Sidebar {
  static _() {
    return new Sidebar();
  }

  open() {
    var self = this;
    var drawer: any = document.getElementsByTagName('minds-sidebar')[0];

    if (drawer.classList.contains('is-visible')) {
      return this.close();
    }
    drawer.classList.add('is-visible');

    //we have a delay so we don't close after click
    // setTimeout(() => {
    //   var listener = e => {
    //     drawer.classList.remove('is-visible');
    //     document.removeEventListener('click', listener);
    //   };
    //   document.addEventListener('click', listener);
    // }, 300);
  }
  close() {
    var drawer: any = document.getElementsByTagName('minds-sidebar')[0];
    drawer.classList.remove('is-visible');
  }
}
