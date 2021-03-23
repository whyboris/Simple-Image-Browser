import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { TreeModule } from '@circlon/angular-tree-component';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { SearchPipe } from './search.pipe';
import { SortPipe } from './sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchPipe,
    SortPipe
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
