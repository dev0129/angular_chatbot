import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../chat.service';
import { fadeIn } from '../../shared/animations/fadeIn';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  animations: [fadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatDialogComponent implements OnInit, OnDestroy {

  constructor(private chatService: ChatService) { }

  chatMessages;
  possibleAnswers: Subject<string[]>;
  isLoading: Subject<boolean>;
  isLoadingPossibleAnswers: Subject<boolean>;

  private readonly destroy$ = new Subject<void>();

  @ViewChild('scrollMe', { static: true }) private myScrollContainer: ElementRef;

  ngOnInit() {
    this.chatMessages = this.chatService.chatMessages;
    this.isLoading = this.chatService.isLoading;
    this.isLoadingPossibleAnswers = this.chatService.isLoadingPossibleAnswers;
    this.possibleAnswers = this.chatService.possibleAnswers;

    this.chatService.chatMessages.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
      requestAnimationFrame(() => this.scrollToBottom());
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByMessageId(_index: number, message: { id: number }) {
    return message.id;
  }

  trackByAnswer(_index: number, answer: string) {
    return answer;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage(input: string) {
    if (input === 'Meinen Standort bestimmen') {
      this.chatService.getMyLocation();
    } else {
      this.chatService.askBot(input);
    }
  }

  chatInputController(input: HTMLInputElement) {
    if (input.value.trim().length > 0) {
      this.sendMessage(input.value);
    }
    input.value = '';
  }
}
