import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { TreeModule } from '@circlon/angular-tree-component';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { FiletypePipe } from './pipes/filetype.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { SubfolderPipe } from './pipes/subfolder.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FiletypePipe,
    HomeComponent,
    SearchPipe,
    SortPipe,
    SubfolderPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
