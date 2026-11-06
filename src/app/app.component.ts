import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { navigateToUrl } from 'single-spa';

@Component({
  selector: 'auth-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'auth';
  username: string = '';

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const savedLang = localStorage.getItem('app-language');
    const langToUse = savedLang ?? translate.getBrowserLang() ?? 'en';

    translate.use(langToUse.match(/en|fr/) ? langToUse : 'en');
  }

  switchLanguage(e: Event) {
    const selectElement = e.target as HTMLSelectElement;
    const selectedLang = selectElement.value;
    this.translate.use(selectedLang);
    localStorage.setItem('app-language', selectedLang);
  }

  // onSubmit() {
  //   if (this.username.trim()) {
  //     sessionStorage.setItem('username', this.username);
  //     // alert('Username saved to sessionStorage!');
  //     this.username = '';
  //     navigateToUrl('#/app-nav');
  //   } else {
  //     alert('Please enter a valid username.');
  //   }
  // }
}
