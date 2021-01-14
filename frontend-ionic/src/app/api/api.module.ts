import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';

const components = [];

@NgModule({
    imports: [BrowserModule, HttpClientModule],
    declarations: components,
    exports: components,
    providers: [],
})
export class ApiModule {}
