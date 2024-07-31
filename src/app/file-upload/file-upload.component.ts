import { NgClass, NgIf, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { endsWithSome } from '../shared/utils';
import { ApiService } from '../services/api.service';
import { catchError, concatMap, from, map, of } from 'rxjs';

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
  currentUploadedFileList: File[] = [];
  currentAmountUploading: number = 0;
  currentAmountUploaded: number = 0;

  constructor(private apiService: ApiService) {}

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

      this.showUploadingNotification(filteredFiles.length);

      this.uploadFiles(filteredFiles);
    }

    this.isDragging = false;
  }

  onFileManualSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filteredFiles = this.getFilteredFiles(input.files)

      this.showUploadingNotification(filteredFiles.length);

      this.uploadFiles(filteredFiles);
    }
  }

  showUploadingNotification(amountUploading: number): void {
    this.currentAmountUploading = amountUploading;
    this.isUploading = true;
  }

  showUploadedNotification(amountUploaded: number): void {
    this.currentAmountUploaded = amountUploaded;
    this.isUploading = false;
    this.isUploaded = true;

    setTimeout(() => {
      this.currentAmountUploading = 0;
      this.currentAmountUploaded = 0;
      this.isUploaded = false;
      this.isError = false;
      this.currentUploadedFileList = [];
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
    const headers = { 'enctype': 'multipart/form-data' };

    const fileUploadObservables = from(files)
      .pipe(
        concatMap((file: File) => {
          const fileFormData = new FormData();
          fileFormData.append('file', file, file.name);

          return this.apiService.postForm(fileFormData, headers)
            .pipe(
              map(response => {
                this.fileList.push(file);
                this.currentUploadedFileList.push(file);
                return response;
              }),
              catchError(_ => {
                this.isError = true;
                return of(null);
              })
            );
        })
    );

    fileUploadObservables.subscribe({
      complete: () => {
        this.showUploadedNotification(this.currentUploadedFileList.length);
      },
      error: () => {
        this.isError = true;
      }
    });
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
