import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.fireBaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {

        this.utilsSvc.presentToast({

          message: 'Tu solicitud ha sido enviada. Si el correo ingresado está registrado, recibirás un enlace para restablecer tu contraseña en unos segundos.',
          duration: 1500,
          color: 'tertiary',
          position: 'middle',
          icon: 'mail-outline'

        })

        this.utilsSvc.routerLink('/auth');
        this.form.reset();

      }).catch(error => {

        console.log(error);

        this.utilsSvc.presentToast({

          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'

        })

      }).finally(() => {

        loading.dismiss();

      })
    }

  }

}