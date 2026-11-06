import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})



export class SidebarComponent {
  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Projects',
      icon: 'pi pi-briefcase',
      items: [
        { label: 'Project 1', icon: 'pi pi-folder', routerLink: '/projects/1' },
        { label: 'Project 2', icon: 'pi pi-folder', routerLink: '/projects/2' }
      ]
    },
    {
      label: 'Repos',
      icon: 'pi pi-code',
      items: [
        { label: 'Repo A', icon: 'pi pi-github', routerLink: '/repos/a' },
        { label: 'Repo B', icon: 'pi pi-github', routerLink: '/repos/b' }
      ]
    }
  ];
}
