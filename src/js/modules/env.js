import { debounce } from '../utils/debounce';

import { emitter } from './event-emitter';

/**
 * @typedef {Object} EnvType
 * @property {{value: {x: number; y: number;}}} viewportResolution
 * @property {number} viewportAspectRatio
 * @property {boolean} isPortrait
 * @property {boolean} isMobile
 * @property {boolean | undefined} browserSupportsWebp
 * @property {boolean | undefined} browserSupportsAvif
 * @property {boolean} imageFormatsSupportDetected
 * @property {() => void} checkModernImageFormatsSupport
 * @property {() => void} checkBrowserSupportsWebp
 * @property {() => void} checkBrowserSupportsAvif
 * @property {(filename: string) => string} getFileNameWithModernImageFormat
 *
 */

/**
 * @class
 * @implements {EnvType}
 */
class Env {
  constructor() {
    /** @type {undefined | boolean} */
    this.browserSupportsWebp = undefined;
    /** @type {undefined | boolean} */
    this.browserSupportsAvif = undefined;
    this.imageFormatsSupportDetected = false;
    this.isMobile = window.innerWidth < 670;

    const updateEnvValues = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      this.viewportResolution = {
        value: {
          x: windowWidth,
          y: windowHeight,
        },
      };
      this.viewportAspectRatio =
        this.viewportResolution.value.x / this.viewportResolution.value.y;

      this.isPortrait = this.viewportAspectRatio < 1;
    };

    updateEnvValues();

    this.checkModernImageFormatsSupport();

    document.addEventListener('DOMContentLoaded', () => {
      updateEnvValues();
      emitter.emit('env:windowResized');
    });

    window.addEventListener(
      'resize',
      debounce(() => {
        updateEnvValues();
        emitter.emit('env:windowResized');
      }, 100)
    );
  }

  checkModernImageFormatsSupport() {
    this.checkBrowserSupportsAvif().then(() => {
      if (!this.browserSupportsAvif) {
        this.checkBrowserSupportsWebp();
      }
      this.imageFormatsSupportDetected = true;
      emitter.emit('env:imageFormatsSupportDetected');
    });
  }

  checkBrowserSupportsWebp() {
    this.browserSupportsWebp = false;
    const elem = document.createElement('canvas');
    if (elem?.getContext('2d')) {
      // was able or not to get WebP representation
      this.browserSupportsWebp =
        elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
  }

  checkBrowserSupportsAvif() {
    return new Promise((resolve) => {
      const image = new Image();

      image.onerror = () => {
        resolve(false);
      };

      image.onload = () => {
        this.browserSupportsAvif = true;
        resolve(true);
      };

      image.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    }).catch(() => {
      return false;
    });
  }

  /** @param {string} filename */
  getFileNameWithModernImageFormat(filename) {
    const originalExtension = filename.split('.').pop();
    const filenameWithoutExtension = filename.replace(
      `.${originalExtension}`,
      ''
    );
    if (this.browserSupportsAvif) {
      return `${filenameWithoutExtension}.avif`;
    }
    if (this.browserSupportsWebp) {
      return `${filenameWithoutExtension}.webp`;
    }
    return filename;
  }
}

/** @type {EnvType} */
export const env = new Env();
