import { Component, EventEmitter, Input, Output } from "@angular/core";

import { SettingsButtonKey, SettingsButtonsType } from "../home/settings-buttons";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: [
    '../buttons.scss',
    './button.component.scss'
  ]
})
export class ButtonComponent {

  @Input() button: SettingsButtonKey | string; // `| string` is temp
  @Input() settingsButtons: SettingsButtonsType;
  @Input() neverDarkMode: boolean;

  @Output() toggleButton = new EventEmitter<string>();

  constructor() { }
}
