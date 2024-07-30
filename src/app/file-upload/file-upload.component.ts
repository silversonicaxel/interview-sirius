import { NgClass, NgIf, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { endsWithSome } from '../shared/utils';
import { RequestService } from '../services/request.service';

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
  isError = false;
  amountUploading: number = 0;
  amountUploaded: number = 0;

  constructor(private requestService: RequestService) {}

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

  async onFileDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      const filteredFiles = this.getFilteredFiles(event.dataTransfer.files)

      this.openNotification(filteredFiles.length);

      const uploadedFiles = await this.uploadFiles(filteredFiles);

      this.closeNotification(uploadedFiles.length);
    }

    this.isDragging = false;
  }

  async onFileManualSelect(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filteredFiles = this.getFilteredFiles(input.files)

      this.openNotification(filteredFiles.length);

      const uploadedFiles = await this.uploadFiles(filteredFiles);

      this.closeNotification(uploadedFiles.length);
    }
  }

  openNotification(amountUploading: number): void {
    this.amountUploading = amountUploading;
    this.isUploading = true;
  }

  closeNotification(amountUploaded: number): void {
    this.amountUploaded = amountUploaded;
    this.isUploading = false;
    this.isUploaded = true;

    setTimeout(() => {
      this.amountUploading = 0;
      this.amountUploaded = 0;
      this.isUploaded = false;
      this.isError = false;
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

  async uploadFiles(files: File[]): Promise<File[]> {
    const uploadedFiles: File[] = []

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i], files[i].name);

      await this.requestService.post(formData)
        .then(_ => {
          this.fileList.push(files[i]);
          uploadedFiles.push(files[i]);
        })
        .catch(_ => this.isError = true)
    }

    return uploadedFiles;
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
