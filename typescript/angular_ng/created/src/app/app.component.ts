import { Component } from '@angular/core'
import { BokehJSComponent } from './bokeh-js/bokeh-js.component';

@Component({
  selector: 'app-root',
  imports: [BokehJSComponent],
  template: `<app-bokeh-js></app-bokeh-js>`,
  styles: [],
})

export class AppComponent {}
