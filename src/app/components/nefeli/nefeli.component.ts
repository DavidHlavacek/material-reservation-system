import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Nefeli2Component } from '../nefeli2/nefeli2.component';

@Component({
  selector: 'app-nefeli',
  standalone: true,
  imports: [CommonModule, MatCardModule, Nefeli2Component],
  templateUrl: './nefeli.component.html',
  styleUrl: './nefeli.component.css'
})
export class NefeliComponent {

}
