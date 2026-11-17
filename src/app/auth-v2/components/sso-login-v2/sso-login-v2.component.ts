
import { Component } from '@angular/core';

@Component({
  selector: 'auth-sso-login-v2',
  standalone: false,
  templateUrl: './sso-login-v2.component.html',
  styleUrls: ['./sso-login-v2.component.scss']
})
export class SsoLoginV2Component {

  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
  }

}
