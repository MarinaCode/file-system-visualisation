import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { FolderComponent } from './folder/folder.component';
import { FolderService } from './folder.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import {MatToolbarModule} from '@angular/material/toolbar';
// import { TransformPathPipe } from './transform-path.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FolderComponent,
    HeaderNavigationComponent
  ],
  imports: [
    BrowserModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule
  ],
  providers: [FolderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
