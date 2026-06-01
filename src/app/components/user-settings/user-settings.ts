import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AppwriteService } from '../../services/appwrite.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings {
  passwordForm!: FormGroup;
  selectedAvatarFile: File | null = null;
  avatarPreview: string | null = null;
  currentUser: User | null = null;
  isSavingAvatar = false;
  isSavingPassword = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private appwriteService: AppwriteService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.initPasswordForm();
    this.loadUserData();
  }

  initPasswordForm() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  loadUserData() {
    this.authService.currentUser$.subscribe((user) => {
      if (user && user.id) {
        this.currentUser = user;

        this.userService.getUserById(user.id).subscribe({
          next: (freshUser) => {
            console.log('Datos frescos del backend:', freshUser);

            if (freshUser.profileUrl && freshUser.profileUrl.trim() !== '') {
              this.avatarPreview = freshUser.profileUrl;
            } else {
              this.avatarPreview = 'assets/default-avatar.jpg';
            }
          },
          error: (err) => {
            console.error('Error al obtener usuario fresco:', err);
            this.avatarPreview = user.profileUrl || 'assets/default-avatar.jpg';
          },
        });
      }
    });
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('La foto de perfil no debe superar los 10 MB.');
      return;
    }

    this.selectedAvatarFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  async updateProfilePicture() {
    if (!this.selectedAvatarFile || !this.currentUser) return;

    this.isSavingAvatar = true;
    try {
      const urls = await this.appwriteService.uploadMultiFiles(
        [this.selectedAvatarFile],
        'avatars',
      );
      const newAvatarUrl = urls[0];

      this.userService.updateAvatar(this.currentUser.id!, newAvatarUrl).subscribe({
        next: (updatedUser) => {
          alert('Foto de perfil actualizada con éxito.');
          this.selectedAvatarFile = null;
          this.isSavingAvatar = false;
        },
        error: (err) => {
          console.error(err);
          this.isSavingAvatar = false;
        },
      });
    } catch (error) {
      console.error('Error al subir el avatar a Appwrite:', error);
      this.isSavingAvatar = false;
    }
  }

  onSubmitPassword() {
    if (this.passwordForm.invalid || !this.currentUser) return;

    this.isSavingPassword = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    const payload = {
      current: currentPassword,
      update: newPassword,
    };

    console.log(payload);

    this.userService.changePassword(this.currentUser.id!, payload).subscribe({
      next: () => {
        alert('Contraseña modificada exitosamente.');
        this.passwordForm.reset();
        this.isSavingPassword = false;
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Error al cambiar la contraseña. Verifique sus datos.');
        this.isSavingPassword = false;
      },
    });
  }
}
