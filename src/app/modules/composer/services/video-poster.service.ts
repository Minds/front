import { Injectable } from '@angular/core';

/**
 * Video Poster structure
 */
export interface VideoPoster {
  url: string;
  file?: File;
  fileBase64?: string;
  fileName?: string;
}
