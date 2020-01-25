import { h, render } from 'preact';
import SettingsForm from './settingsForm';

if (document) {
    const elem = document.getElementById("settings");
    if (elem)
        render(<SettingsForm />, elem);
}
