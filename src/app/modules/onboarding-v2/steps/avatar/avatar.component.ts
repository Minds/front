import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserAvatarService } from '../../../../common/services/user-avatar.service';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Upload } from '../../../../services/api/upload';
import { ConfigsService } from '../../../../common/services/configs.service';

@Component({
  selector: 'm-onboarding--avatarStep',
  templateUrl: 'avatar.component.html',
})
export class AvatarStepComponent {
  readonly cdnAssetsUrl: string;

  cropping: boolean = false;
  file: any;
  imageChangedEvent: any;
  imageLoaded: boolean = false;
  src: string = '';
  waitForDoneSignal: boolean = true;
  croppedImage: any = '';

  @ViewChild('file', { static: false }) fileInput: ElementRef;

  constructor(
    protected upload: Upload,
    protected userAvatarService: UserAvatarService,
    protected router: Router,
    private configs: ConfigsService
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
  }

  uploadPhoto() {
    this.fileInput.nativeElement.click();
  }

  add(e) {
    this.imageChangedEvent = e;
    if (e) {
      this.cropping = true;
    }
  }

  async save() {
    if (!this.croppedImage) {
      return;
    }

    this.userAvatarService.src$.next(this.croppedImage);

    fetch(this.croppedImage)
      .then(res => res.blob())
      .then(async blob => {
        const imageFile = new File([blob], Date.now() + '', {
          type: 'image/png',
        });

        try {
          const response: any = await this.upload.post(
            'api/v1/channel/avatar',
            [imageFile],
            { filekey: 'file' }
          );

          const user = this.configs.get('user');
          if (user) {
            user.icontime = Date.now();
            this.configs.set('user', user);
          }
        } catch (e) {
          console.error(e);
        }
      });
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  onImageLoaded() {
    this.imageLoaded = true;
  }

  cancel() {
    this.fileInput.nativeElement.value = null;
    this.imageChangedEvent = null;
    this.cropping = false;
  }

  skip() {
    this.router.navigate(['/newsfeed']);
  }

  async continue() {
    await this.save();
    this.router.navigate(['/newsfeed']);
  }

  private dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
}
