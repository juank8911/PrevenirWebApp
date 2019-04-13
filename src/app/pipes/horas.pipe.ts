import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {

  transform(value: string): string {
    value = moment.utc(value).format('hh:mm a');
    // console.log(value);
    return value;
  }
}
