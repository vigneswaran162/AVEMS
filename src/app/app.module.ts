import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { AddEventComponent } from './Admin/add-event/add-event.component';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { ToastrModule } from 'ngx-toastr';
import { AddEventListComponent } from './Admin/add-event-list/add-event-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { NavbarComponent } from './Navbar/navbar/navbar.component';
import { EventCardComponent } from './Content/event-card/event-card.component';
import { HomeComponent } from './Content/home/home.component';
import { EventDetailsComponent } from './Content/event-details/event-details.component';
import { RegisterationListComponent } from './Admin/Registeration/registeration-list/registeration-list.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { SideNavLinkComponent } from './Admin/side-nav-link/side-nav-link.component';


@NgModule({
  declarations: [
    AppComponent,
    AddEventComponent,
    SidenavbarComponent,
    AddEventListComponent,
    NavbarComponent,
    EventCardComponent,
    HomeComponent,
    EventDetailsComponent,
    RegisterationListComponent,
    SideNavLinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMaterialTimepickerModule,
    CKEditorModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true
    }),
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule
    
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
