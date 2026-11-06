import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule, Routes } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

const routes: Routes = [
  { path: 'layout', component: LayoutComponent}
];

@NgModule({
  declarations: [
    // SidebarComponent,
    // HeaderComponent,
    // LayoutComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    RouterModule.forChild(routes)
  ]
})
export class LayoutModule { }
