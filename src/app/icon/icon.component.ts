import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss', '../fonts/icons.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class IconComponent {

  readonly icon = input<string>();

  constructor() { }

}
