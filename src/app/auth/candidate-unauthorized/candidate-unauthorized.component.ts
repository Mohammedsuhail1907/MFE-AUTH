import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'auth-candidate-unauthorized',
  standalone: false,
  templateUrl: './candidate-unauthorized.component.html',
  styleUrls: ['./candidate-unauthorized.component.scss']
})
export class CandidateUnauthorizedComponent implements OnInit {

  accessDeniedConfig = environment.environment.accessDeniedConfig;
  footerConfig = environment.environment.Footer;

  constructor() { }

  ngOnInit(): void { }

}
