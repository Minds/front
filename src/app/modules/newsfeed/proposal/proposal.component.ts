import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
} from '@angular/core';


@Component({
    selector: 'm-proposal',
    templateUrl: './proposal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalComponent implements OnInit {


    constructor(
    ) { }

    ngOnInit() {
    }

}
