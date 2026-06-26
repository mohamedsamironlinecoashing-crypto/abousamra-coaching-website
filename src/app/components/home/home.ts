import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutUs } from '../about-us/about-us';
import { Plans } from '../plans/plans';
import { Transformations } from '../transformations/transformations';
import { Guide } from '../guide/guide';
import { Feedbacks } from '../feedbacks/feedbacks';
import { ContactUs } from '../contact-us/contact-us';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutUs, Plans, Transformations, Guide, Feedbacks, ContactUs],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
