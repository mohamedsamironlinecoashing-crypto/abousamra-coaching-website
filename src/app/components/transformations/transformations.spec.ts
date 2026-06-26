import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transformations } from './transformations';

describe('Transformations', () => {
  let component: Transformations;
  let fixture: ComponentFixture<Transformations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transformations],
    }).compileComponents();

    fixture = TestBed.createComponent(Transformations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
