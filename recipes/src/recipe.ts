import { Step } from './step';

/**
 * Abstract base class for recipe for making a BokehJS example, consisting of multiple steps.
 */
export abstract class Recipe {
  constructor(
    readonly type: string,
    readonly framework: string,
    readonly bundler: string,
    readonly details: string = ''
  ) {}

  protected add(step: Step): void {
    this._steps.push(step);
  }

  get steps(): Step[] {
    return this._steps;
  }

  private _steps: Step[] = [];
}
