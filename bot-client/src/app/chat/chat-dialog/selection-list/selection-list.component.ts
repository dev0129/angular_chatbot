import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionListComponent {

  @Input() selectionList: string[];

  constructor(private chatService: ChatService) { }

  trackBySelection(_index: number, selection: string) {
    return selection;
  }

  sendMessage(value: string) {
    this.chatService.askBot(value);
  }

}
