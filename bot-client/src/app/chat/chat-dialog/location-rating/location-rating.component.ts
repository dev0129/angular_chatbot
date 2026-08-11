import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-location-rating',
  templateUrl: './location-rating.component.html',
  styleUrls: ['./location-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationRatingComponent implements OnChanges {

  @Input() rating: number;

  stars: number[] = [];

  ngOnChanges() {
    this.stars = this.computeStars(this.rating);
  }

  trackByIndex(index: number) {
    return index;
  }

  private computeStars(rating: number) {
    const stars = [];
    const starsArray = rating ? rating.toString().split('.') : ['0', '0'];

    const amountFullStars = Number(starsArray[0]);
    let amountHalfStars = 0;
    let amountEmptyStars = 0;

    if (Number(starsArray[1]) >= 3 && Number(starsArray[1]) < 7) {
      amountHalfStars++;
    }

    amountEmptyStars = 5 - amountFullStars - amountHalfStars;

    stars.push(...Array(amountFullStars).fill(1));
    stars.push(...Array(amountHalfStars).fill(0));
    stars.push(...Array(amountEmptyStars).fill(-1));
    return stars;
  }

}
