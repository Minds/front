import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-formToast',
  templateUrl: './form-toast.component.html',
})
export class FormToastComponent implements OnInit {
  @Input() status: string = 'success';
  @Input() hidden: boolean = false; //OJMTODO
  constructor() {}

  ngOnInit() {}
}

// TODOOJM : add timer, add max-width, slide into fixed position
