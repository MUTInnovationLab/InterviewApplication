import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrloginPage } from './hrlogin.page';

describe('HrloginPage', () => {
  let component: HrloginPage;
  let fixture: ComponentFixture<HrloginPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HrloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
