import { NgClass, NgIf, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { endsWithSome } from '../shared/utils';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) name!: string;
  @Input() extensions: string[] = ['pdf'];
  @Input() tabindex: number = -1;

  readonly NOTIFICATION_CLOSE_TIMER = 3000;
  readonly ICON_PATH = '/icons/';

  fileList: File[] = [];
  isFocused = false;
  isDragging = false;
  isUploading = false;
  isUploaded = false;
  amountUploading: number = 0;

  onInputFocus() {
    this.isFocused = true;
  }

  onInputBlur() {
    this.isFocused = false;
  }

  onFileDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onFileDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      const filteredFiles = this.getFilteredFiles(event.dataTransfer.files)

      this.openNotification(filteredFiles.length);

      this.uploadFiles(filteredFiles);

      this.closeNotification();
    }

    this.isDragging = false;
  }

  onFileManualSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filteredFiles = this.getFilteredFiles(input.files)

      this.openNotification(filteredFiles.length);

      this.uploadFiles(filteredFiles);

      this.closeNotification();
    }
  }

  openNotification(amountUploading: number): void {
    this.amountUploading = amountUploading;
    this.isUploading = true;
  }

  closeNotification(): void {
    this.isUploading = false;
    this.isUploaded = true;

    setTimeout(() => {
      this.amountUploading = 0;
      this.isUploaded = false;
    }, this.NOTIFICATION_CLOSE_TIMER);
  }

  getFilteredFiles(files: FileList): File[] {
    const filteredFileList: File[] = []

    for (let i = 0; i < files.length; i++) {
      if (endsWithSome(files[i].name.toLowerCase(), this.extensions)) {
        filteredFileList.push(files[i]);
      }
    }

    return filteredFileList;
  }

  uploadFiles(files: File[]): void {
    for (let i = 0; i < files.length; i++) {
      this.fileList.push(files[i]);
    }
  }

  useAcceptFileExtensions(extensions: string[]): string {
    return extensions.length > 0
      ? extensions.map((extension: string) => `.${extension.toLowerCase()}`).join(',')
      : ''
  }

  useFileSize(size: number): string {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} kB`;
    }

    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }

  useFileIcon(type: string): string {
    if (type === 'application/pdf') {
      return `${this.ICON_PATH}pdf.svg`;
    }

    if (type.startsWith('image/')) {
      return `${this.ICON_PATH}image.svg`;
    }

    if (type.startsWith('video/')) {
      return `${this.ICON_PATH}video.svg`;
    }

    if (type.startsWith('audio/')) {
      return `${this.ICON_PATH}audio.svg`;
    }

    return `${this.ICON_PATH}unknown.svg`;
  }
}
