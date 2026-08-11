import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Location } from '../../../models';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsListComponent {

  @Input() locationsList: Location[];

  constructor(private chatService: ChatService) { }

  trackByPlaceId(_index: number, location: Location) {
    return location.place_id;
  }

  showLocationDetails(location: Location) {
    this.chatService.showLocationDetails(location);
  }

}
