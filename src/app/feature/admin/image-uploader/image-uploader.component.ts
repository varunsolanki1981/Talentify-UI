import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageUploadService } from '../../../core/services/image-upload.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmdialogComponent } from '../../../renderers/confirmdialog-component/confirmdialog-component';
import { Image } from '../../../core/models/user.interface';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';


@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.css'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploaderComponent implements OnInit {
    @ViewChild('fileInput') myInputVariable!: ElementRef;
    selectedFile: File | null = null;
    previewSrc: string | ArrayBuffer | null = null;
    uploading = false;
    uploadProgress = 0;
    title = '';
    description = '';
    serverMessage: string | null = null;
    uploadedList: any[] = [];
    previewModalSrc: string | null = null;
    showPreviewModal = false;
    private pendingDeletes = new Map<string, any>();
    images: Image[] = [];

    constructor(private uploadService: ImageUploadService, private dialog: MatDialog, 
        private snackBar: MatSnackBar, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.uploadForm = this.fb.group({
            title: [''],
            description: ['']
        });
    }

    ngOnInit(): void {
        this.loadUploadedImages();
    }

    uploadForm!: FormGroup;
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        this.selectedFile = input.files[0];

        const reader = new FileReader();
        reader.onload = () => this.previewSrc = reader.result;
        reader.readAsDataURL(this.selectedFile);
    }

    onSubmit() {
        // After successful submission/upload
        this.uploadForm.reset();
        this.clearFileInput();
    }

    clearFileInput() {
        this.uploadForm.reset();
        this.uploadForm.controls['title'].setValue('New title');
        this.uploadForm.controls['description'].setValue('New description');
        // This part is the same for both form types
        if (this.myInputVariable && this.myInputVariable.nativeElement) {
            this.myInputVariable.nativeElement.value = null; // Resets the input field
        }
    }

    upload() {
        if (!this.selectedFile) return;
        this.uploading = true;
        this.uploadProgress = 0;
        this.serverMessage = null;

        this.uploadService.uploadImage(this.selectedFile, this.uploadForm.get('title')?.value, this.uploadForm.get('description')?.value).subscribe({
            next: (event: any) => {
                if (event.type === 'progress') {
                    this.uploadProgress = event.loaded;
                    this.uploading = true;
                    console.log(`Upload progress: ${this.uploadProgress}%`);
                } else if (event.type === 'complete') {
                    const body = event.body;
                    this.serverMessage = body?.message || (body?.fileName ? 'Uploaded: ' + body.fileName : 'Upload complete');
                    console.log('Upload complete:', this.serverMessage);
                    if (body) this.uploadedList.unshift(body);
                    this.uploading = true;
                }
            },
            error: (err) => {
                console.error(err);
                this.uploading = false;
                this.serverMessage = 'Upload failed';
            },
            complete: () => {
                //this.uploading = false;
                this.selectedFile = null;
                this.previewSrc = null;
                this.title = '';
                this.description = '';
                this.loadUploadedImages();
                //this.clearFileInput();
            }
        });

    }

    loadUploadedImages() {
        this.uploadService.getUploadedImages().subscribe({
            next: (list: Image[]) => {
               this.uploadedList = Array.isArray(list) ? list : [];
                this.cdr.detectChanges();
            },
            error: () => { }
        });
    }

    openPreview(item: any) {
        const url = item.url || item.fileUrl || item.filePath || item.imageData || null;
        if (!url) return;
        //console.log('Opening preview for:', item, 'URL:', url);
        this.previewModalSrc = url;
        this.showPreviewModal = true;
    }

    closePreview() {
        this.previewModalSrc = null;
        this.showPreviewModal = false;
    }

    deleteItem(item: any) {
        const id = item.id || item.fileName || item.name;
        if (!id) return;

        const ref = this.dialog.open(ConfirmdialogComponent, {
            data: { title: 'Are you sure you want to delete this image?', message: `Delete ${item.fileName || id}?` }
        });

        ref.afterClosed().subscribe(confirmed => {
            if (!confirmed) return;

            // Optimistic UI: remove immediately
            this.uploadedList = this.uploadedList.filter(i => (i.id || i.fileName || i.name) !== id);

            // show snackbar with Undo
            const snackRef = this.snackBar.open((item.fileName || id) + ' deleted', 'Undo', { duration: 6000 });

            // start timer to perform server delete after snackbar duration
            const timer = setTimeout(() => {
                this.uploadService.deleteImage(id).subscribe({
                    next: (list: any) => {
                    console.log('Delete response:', list);
                        this.serverMessage = 'Image deleted successfully';
                        this.cdr.detectChanges();
                        this.loadUploadedImages(); // Refresh list after deletion
                     },
                    error: () => { 
                        this.serverMessage = 'Delete failed on server'; 
                        console.error('Failed to delete image with id:', id);
                        this.cdr.detectChanges();
                    }
                });
                this.pendingDeletes.delete(id);
            }, 6000);

            this.pendingDeletes.set(id, { timer, item });

            // handle undo
            snackRef.onAction().subscribe(() => {
                const pending = this.pendingDeletes.get(id);
                console.log('Undo clicked for:', id, 'Pending delete:', pending);
                if (pending) {
                    clearTimeout(pending.timer);
                    this.uploadedList.unshift(pending.item);
                    this.pendingDeletes.delete(id);
                    this.serverMessage = 'Undo delete';
                    console.log('Undo delete for:', id);
                    this.cdr.detectChanges();
                }
            });
        });
    }
}
