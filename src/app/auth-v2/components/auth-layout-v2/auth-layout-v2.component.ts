
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';

@Component({
  selector: 'auth-auth-layout-v2',
  standalone: false,
  templateUrl: './auth-layout-v2.component.html',
  styleUrls: ['./auth-layout-v2.component.scss']
})
export class AuthLayoutV2Component implements OnInit, OnDestroy {
  showStoreBadges = false;

  googlePlayUrl = '';
  appStoreUrl = '';

  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  get isForgotPasswordPage(): boolean {
    return (
      this.router.url.includes('/forgot-password') ||
      this.router.url.includes('/reset-password') ||
      this.router.url.includes('/sso-login')
    );
  }

  ngOnInit(): void {
    this.googlePlayUrl = environment.environment?.GooglePlayUrl || '';
    this.appStoreUrl = environment.environment?.AppStoreUrl || '';

    this.updateStoreBadgeVisibility();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd =>
          event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateStoreBadgeVisibility();
      });
  }

  private updateStoreBadgeVisibility(): void {
    const currentUrl = this.router.url.split('?')[0].split('#')[0];

    this.showStoreBadges = currentUrl.endsWith('/login');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
