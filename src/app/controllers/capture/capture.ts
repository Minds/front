import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LICENSES, ACCESS } from '../../services/list-options';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';
import { Upload } from '../../services/api/upload';
import { Client } from '../../services/api/client';


@Component({
  selector: 'minds-capture',
  host: {
    '(dragover)': 'dragover($event)',
    '(dragleave)': 'dragleave($event)',
    '(drop)': 'drop($event)'
  },
  templateUrl: 'capture.html'
})

export class Capture {

  uploads: Array<any> = [];

  postMeta: any = {}; //TODO: make this object

  albums: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;

  dragging: boolean = false;

  control;

  default_maturity: number = 0;
  default_license: string = 'all-rights-reserved';
  licenses = LICENSES;
  access = ACCESS;
  constructor(public session: Session, public _upload: Upload, public client: Client, public router: Router, public title: MindsTitle) {
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.getAlbums();
    }

    this.title.setTitle('Capture');
  }

  getAlbums() {
    var self = this;
    this.client.get('api/v1/media/albums/list', { limit: 5, offset: this.offset })
      .then((response: any) => {
        if (!response.entities)
          return;
        console.log(response);
        self.albums = response.entities;
      });
  }

  createAlbum(album) {
    var self = this;
    this.inProgress = true;
    this.client.post('api/v1/media/albums', { title: album.value })
      .then((response: any) => {
        self.albums.unshift(response.album);
        self.postMeta.album_guid = response.album.guid;
        self.inProgress = false;
        album.value = '';
      });
  }

  selectAlbum(album) {
    this.postMeta.album_guid = album.guid;
  }

  deleteAlbum(album) {
    if (confirm('Are you sure?')) {
      let i: any;
      for (i in this.albums) {
        if (album.guid === this.albums[i].guid)
          this.albums.splice(i, 1);
      }
      this.client.delete('api/v1/media/albums/' + album.guid);
    }
  }

  /**
   * Add a file to the upload queue
   */
  add(file: any) {
    var self = this;

    for (var i = 0; i < file.files.length; i++) {

      var data: any = {
        guid: null,
        state: 'created',
        progress: 0,
        license: this.default_license || 'all-rights-reserved',
        mature: this.default_maturity || 0
      };

      var fileInfo = file.files[i];

      if (fileInfo.type && fileInfo.type.indexOf('image') > -1) {
        data.type = 'image';
      } else if (fileInfo.type && fileInfo.type.indexOf('video') > -1) {
        data.type = 'video';
      } else if (fileInfo.type && fileInfo.type.indexOf('audio') > -1) {
        data.type = 'audio';
      } else {
        data.type = 'unknown';
      }

      data.name = fileInfo.name;
      data.title = data.name;

      var upload_i = this.uploads.push(data) - 1;
      this.uploads[upload_i].index = upload_i;

      this.upload(this.uploads[upload_i], fileInfo);

    }

  }

  upload(data, fileInfo) {
    var self = this;
    this._upload.post('api/v1/media', [fileInfo], this.uploads[data.index], (progress) => {
      self.uploads[data.index].progress = progress;
      if (progress === 100) {
        self.uploads[data.index].state = 'uploaded';
      }
    })
      .then((response: any) => {
        self.uploads[data.index].guid = response.guid;
        self.uploads[data.index].state = 'complete';
        self.uploads[data.index].progress = 100;
      })
      .catch(function (e) {
        self.uploads[data.index].state = 'failed';
        console.error(e);
      });
  }

  modify(index) {
    this.uploads[index].state = 'uploaded';
    //we don't always have a guid ready, so keep checking for one
    var promise = new Promise((resolve, reject) => {
      if (this.uploads[index].guid) {
        setTimeout(() => { resolve(); }, 300);
        return;
      }
      var interval = setInterval(() => {
        if (this.uploads[index].guid) {
          resolve();
          clearInterval(interval);
        }
      }, 1000);
    });
    promise.then(() => {
      this.client.post('api/v1/media/' + this.uploads[index].guid, this.uploads[index])
        .then((response: any) => {
          console.log('response from modify', response);
          this.uploads[index].state = 'complete';
        });
    });
  }

  /**
   * Publish our uploads to an album
   */
  publish() {
    if (!this.postMeta.album_guid)
      return alert('You must select an album first');
    var self = this;
    var guids = this.uploads.map((upload) => {
      if (upload.guid !== null || upload.guid !== 'null' || !upload.guid)
        return upload.guid;
    });
    this.client.post('api/v1/media/albums/' + this.postMeta.album_guid, { guids: guids })
      .then((response: any) => {
        self.router.navigate(['/media', this.postMeta.album_guid]);
      })
      .catch((e) => {
        alert('there was a problem.');
      });
  }

  /**
   * Make sure the browser doesn't freak
   */
  dragover(e) {
    e.preventDefault();
    this.dragging = true;
  }

  /**
   * Tell the app we have stopped dragging
   */
  dragleave(e) {
    e.preventDefault();
    console.log(e);
    if (e.layerX < 0)
      this.dragging = false;
  }

  drop(e) {
    e.preventDefault();
    this.dragging = false;
    this.add(e.dataTransfer);
  }

}
