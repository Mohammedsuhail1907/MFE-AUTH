import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateUnauthorizedComponent } from './candidate-unauthorized.component';

describe('CandidateUnauthorizedComponent', () => {
  let component: CandidateUnauthorizedComponent;
  let fixture: ComponentFixture<CandidateUnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateUnauthorizedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
