import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class StateService {
    private _isPanningMode = signal<boolean>(localStorage.getItem('isPlanningMode') === '1');

    get isPanningMode() {
        return this._isPanningMode.asReadonly();
    }

    setIsPanningMode(v: boolean) {
        localStorage.setItem('isPlanningMode', v ? '1' : '0')
        this._isPanningMode.set(v)
    }
}